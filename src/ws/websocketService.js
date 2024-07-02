const WebSocket = require('ws');
const User = require('../models/userModel'); // Adjust path as per your project structure
const { ROLES } = require('../utils/constants');

const clients = new Map(); // Map to store connected clients

// Function to validate if a user is a valid building or security user
async function validateUser(userId) {
    const user = await User.findById(userId);
    return user && (user.role === ROLES.BUILDING_ADMIN || user.role === ROLES.SECURITY);
}

// Initialize WebSocket server
function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (ws) => {
        console.log('Client connected');

        ws.on('message', async (message) => {
            const data = JSON.parse(message);

            // Register client if they are a building or security user
            if (data.type === 'register') {
                const isValidUser = await validateUser(data.userId);
                if (isValidUser) {
                    clients.set(data.userId, ws); // Store client connection
                    console.log(`User ${data.userId} registered`);
                } else {
                    ws.close(1008, 'Invalid user role'); // Close connection if invalid user
                }
                return;
            }

            // Ensure the user is a valid building or security user
            const isValidUser = await validateUser(data.userId);
            if (!isValidUser) {
                ws.close(1008, 'Invalid user role'); // Close connection if invalid user
                return;
            }

            // Handle visitor request updates
            if (data.type === 'visitor_request_update') {
                notifyClients({ type: 'visitor_request_update', userId: data.userId });
            }
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            // Remove client from the map
            for (let [userId, client] of clients.entries()) {
                if (client === ws) {
                    clients.delete(userId);
                    break;
                }
            }
        });
        ws.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    });

    return wss;
}

// Function to notify specific clients based on userId
function notifyClients(message) {
    clients.forEach((client, userId) => {
        if (userId.toString() === message.userId) {
            client.send(JSON.stringify({
                type: message.type
            }));
        }
    });
}

module.exports = { initWebSocketServer, notifyClients };
