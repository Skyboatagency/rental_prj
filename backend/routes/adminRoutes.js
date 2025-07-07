const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login admin
router.post('/login', adminController.loginAdmin);

// Get all admins
router.get('/', adminController.getAllAdmins);

// Get admin by ID
router.get('/:id', adminController.getAdminById);

// Register new admin
router.post('/register', adminController.registerAdmin);

// Verify admin registration
router.post('/verify', adminController.verifyAdmin);

// Update admin
router.put('/:id', adminController.updateAdmin);

// Delete admin
router.delete('/:id', adminController.deleteAdmin);

module.exports = router; 