const express = require('express');
const router = express.Router();


const { registerUser, loginUser, activateUser, forgotPassword, resetPassword } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/activate/:token', activateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

