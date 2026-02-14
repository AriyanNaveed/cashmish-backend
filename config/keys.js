import dotenv from 'dotenv';
import setupDNS from './dns.js';
setupDNS();
dotenv.config();

console.log("Email Config Check:", {
    EMAIL_USER: process.env.EMAIL_USER ? "FOUND" : "NOT FOUND",
    EMAIL_PASS: process.env.EMAIL_PASS ? "FOUND" : "NOT FOUND"
});

export default {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackURL: process.env.GOOGLE_CALLBACK_URL,
    emailUser: process.env.EMAIL_USER,
    emailPass: process.env.EMAIL_PASS,
    port: process.env.PORT || 5000,
}