const express = require ('express');
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const {admin} = require('../middlewares/admin');
const {getAdminStats} = require('../controllers/adminController');

router.get('/',isLoggedIn,admin,getAdminStats);

module.exports = router;