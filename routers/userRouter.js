const express = require('express')
const { login, signup} = require('../controllers/usersController')

const router = express.Router()

router.post('/login', login)

router.post('/register', signup)



module.exports = router