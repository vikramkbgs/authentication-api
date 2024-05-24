// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getUserNormalProfile, getUserAdminProfile, updateUserProfile, getAllUserProfiles } = require('../controllers/profileController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

/**
 * @swagger
 * /api/profile/user-self:
 *   get:
 *     summary: Get the profile details of the logged-in normal user (role not visible)
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 profilePictureUrl:
 *                   type: string
 *                 isPublic:
 *                   type: boolean
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user-self', protect, getUserNormalProfile);

/**
 * @swagger
 * /api/profile/user-admin:
 *   get:
 *     summary: Get the profile details of the logged-in admin user (role visible)
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profile details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 profilePictureUrl:
 *                   type: string
 *                 isPublic:
 *                   type: boolean
 *                 privateField:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized as an admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/user-admin', protect, isAdmin, getUserAdminProfile);

/**
 * @swagger
 * /api/profile/user-self-update:
 *   put:
 *     summary: Update the profile details of the logged-in user
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               profilePictureUrl:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put('/user-self-update', protect, updateUserProfile);


/**
 * @swagger
 * /api/profile/users:
 *   get:
 *     summary: Get user profiles (Admin all user and non-admin only public)
 *     tags: [Profile]
 *     description: Returns all user profiles for admin users and only public user profiles for non-admin users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Unauthorized. Indicates the user is not authenticated.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the user profile.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         bio:
 *           type: string
 *           description: The biography of the user.
 *         phone:
 *           type: string
 *           description: The phone number of the user.
 *         profilePictureUrl:
 *           type: string
 *           description: The URL of the user's profile picture.
 *         isPublic:
 *           type: boolean
 *           description: Indicates if the profile is public or private.
 *         role:
 *           type: string
 *           description: The role of the user.
 *           enum: [user, admin]
 *           default: user
 */
router.get('/users', protect, getAllUserProfiles);

module.exports = router;
