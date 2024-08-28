const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")

router.get('/', (req, res) => {res.render('index')})
router.get('/signup', (req, res) => { res.render('signup') })
router.get('/signin', (req, res) => {res.render('signin')})
router.get('/booking', auth , (req, res) => {res.render('booking')})
router.get('/contact',auth, (req, res) => {res.render('contact')})

module.exports = router