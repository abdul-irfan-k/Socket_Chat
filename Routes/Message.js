const express  = require('express')
const { getAllUser, addMessage, getAllMessage } = require('../Helpers/Messagehelper')
const { verifyAuthentication } = require('../Middleware/Middleware')
const router = express.Router()

router.post('/addmessage',verifyAuthentication,addMessage)
router.post('/getmessage',verifyAuthentication,getAllMessage)


module.exports = router