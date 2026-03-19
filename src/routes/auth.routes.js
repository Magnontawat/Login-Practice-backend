// src/routes/auth.routes.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
// ถ้ามี POST request เข้ามาที่ /register
// ให้เรียก function register ใน authController
router.post('/register', authController.register)
router.post('/login',authController.login )
router.get('/me', authMiddleware, authController.me )
module.exports = router


