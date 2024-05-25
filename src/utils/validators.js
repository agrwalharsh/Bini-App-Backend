function isValidMobileNumber(mobileNumber) {
    const regex = /^\d{10}$/; // Regex to check if the mobile number is 10 digits
    return regex.test(mobileNumber);
}

function isValidPassword(password) {
    const regex = /^\d{8}$/
    return regex.test(password); // Check if password length is 8 characters
}

module.exports = {
    isValidMobileNumber,
    isValidPassword
};