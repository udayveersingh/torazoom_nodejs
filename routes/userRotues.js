import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middleware/auth-midleware.js';
import checkUserWebAuth from '../middleware/auth-web-midleware.js';

// middleware 
router.use('/changepassword', checkUserAuth);
router.use('/loggeduser', checkUserAuth)
router.use('/dashboard', checkUserWebAuth)
router.get('/', checkUserWebAuth, (req, res) => {
    // User is not authenticated, so redirect to the login page
    res.redirect('/dashboard');
});

// Public routes 
// router.get('/', UserController.login);
router.get('/login', UserController.login);
router.get('/register', UserController.registration);
router.post('/register', UserController.userRegistration);
router.get('/dashboard', UserController.dashboard);
router.post('/login', UserController.userLogin);
router.get('/logout', UserController.logout);
router.get('/languages', UserController.languages);
router.post('/send-reset-password-email', UserController.sendUserPasswordResetEmail)
router.post('/reset-password/:id/:token', UserController.userPasswordReset)


// Protected routes
router.post('/changepassword', UserController.changeUserPassword);
router.get('/loggeduser', UserController.loggedUser)


export default router;