// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// OAuth login with Google
router.get('/login/google', authController.loginWithGoogle);
router.get('/login/google/callback', authController.googleCallback);

// Logout user
router.get('/logout', authController.logout);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: password123
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request. Indicates invalid input data.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized. Indicates invalid credentials.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/login/google:
 *   get:
 *     summary: Login with Google
 *     tags: [Authentication]
 *     description: Redirects user to Google OAuth login page
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth login page
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication operations
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Logs out the currently authenticated user by clearing the authentication token cookie.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out the user
 *       401:
 *         description: Unauthorized. Indicates the user is not authenticated.
 *       500:
 *         description: Internal server error
 */
