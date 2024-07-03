const admin = require('firebase-admin');
require('dotenv').config()

const firebaseConfig = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_URL,
    "client_x509_cert_url": process.env.CLIENT_URL,
    "universe_domain": process.env.UNIVERSE_DOMAIN
}

// Initialize Firebase Admin SDK
admin.initializeApp({credential: admin.credential.cert(firebaseConfig)});

const sendNotification = async (tokens, payload) => {
    console.log(tokens)
    try {
        const response = await admin.messaging().sendToDevice(tokens, payload);
        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = {
    sendNotification
};
