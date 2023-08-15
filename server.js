const express = require('express')
const { createServer } = require('http')
const { Server } = require('socket.io')
const app = express()
const httpServer = createServer(app)
const port = 8000
const cors = require('cors')
require('dotenv').config()
const cookieParser = require("cookie-parser");
const db = require('./Db/Connection')
const bodyParser = require('body-parser')

app.use(cookieParser())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoute = require('./Routes/Auth')
const messageRoute = require('./Routes/Message')

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

let onlineUser = []
io.on("connection", socket => {
    socket.on("userJoin", (username, userid) => {
        onlineUser = [...onlineUser, { username, userid, scoketid: socket.id }]
        socket.broadcast.emit("userJoinMessage", username)
    })

    socket.on('message', ({ message, isPrivate, from, to }) => {
        if (isPrivate) {
            const receiverId = onlineUser.find((obj) => obj.userid === to)
            console.log('receiverd id ',receiverId)
            if (receiverId) socket.to(receiverId.scoketid).emit("newmessage", message)
        }

        else socket.broadcast.to("groupaa").emit('newmessage', message)
    })

    socket.on('new-group', ({ groupName }) => socket.join(groupName))

    socket.on('disconnect', ({username}) => {
        socket.broadcast.emit('leave-user', username)
        console.log("disconnect username", username)
    })
})

app.use('/', messageRoute)
app.use('/auth', userRoute)

httpServer.listen(port, () => {
    console.log(`Server running at ${port}`)
    db.connect().then(() => console.log("db connected"))

})




