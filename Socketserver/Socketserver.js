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
        console.log("online user", onlineUser)

        console.log("username is ", username)
        socket.broadcast.emit("userJoinMessage", username)
    })
    socket.on('message', ({ message, isPrivate, from, to }) => {
        if (isPrivate) {
            console.log("is private")
            const receiverId = onlineUser.find((obj) => obj.userid === to)
            console.log("online user", onlineUser)
            console.log("receiver socket id is ", receiverId)
            socket.to(receiverId.scoketid).emit("newmessage", message)
        }
        else {
            console.log("false")
            socket.broadcast.to("groupaa").emit('newmessage',message)
        }
        console.log(socket.id, message)
    })

    socket.on('new-group',({groupName}) => {
       console.log(groupName)
        socket.join(groupName)
    })
})