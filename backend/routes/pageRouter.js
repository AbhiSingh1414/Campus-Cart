const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/isLoggedIn');

// Home page
router.get('/', (req, res) => {
    res.send("Chl rha hai");
});

// Help page
router.get('/help', isLoggedIn, (req, res) => {
    res.render('help');
});

router.get('/about', (req, res) => {
    res.render('about');
});

module.exports = router;