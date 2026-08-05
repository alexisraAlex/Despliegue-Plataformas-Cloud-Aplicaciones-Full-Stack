const express = require('express');
const router = express.Router();
const { login, renovarToken } = require('../controllers/authController');

router.post('/login', login);
router.post('/refresh', renovarToken);

module.exports = router;