const express = require('express')
const { login, signUp, logout, getAllUser, createGroup, resetGroupUsers } = require('../Helpers/Authhelpers')
const { verifyAuthentication } = require('../Middleware/Middleware')
const router = express.Router()

router.post('/login', login)
router.post('/signup', signUp)
router.post('/logout', verifyAuthentication, logout)

router.get('/getalluser', getAllUser)
router.post('/creategroup', verifyAuthentication, createGroup)
router.post('/addgroupuser', verifyAuthentication, resetGroupUsers)
router.post('/exitgroupuser', verifyAuthentication,resetGroupUsers)


module.exports = router