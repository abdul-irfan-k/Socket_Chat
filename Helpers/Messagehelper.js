const Messageshema = require("../Model/Messageshema")
const Userschema = require("../Model/Userschema")

const addMessage = async (req, res) => {
    const { receiverId, receiverName, message, isPrivate } = req.body
    const { id, username } = req.user

    console.log("id :", id, "receiverId :", receiverId, message)
    const messageSchema = new Messageshema({ senderId: id, senderName: username, receiverId, receiverName, message })
    if (!isPrivate) messageSchema.isGroupMsg = true
    const data = await messageSchema.save()

    res.send(data)
}

const getAllMessage = async (req, res) => {
    console.log(req.url)
    const { msgUserId } = req.body
    const { id, username } = req?.user

    console.log(req.body)
    console.log(id, msgUserId)
    const data = await Messageshema.aggregate([
        { $match: { $or: [{ senderId: id, receiverId: msgUserId }, { senderId: msgUserId, receiverId: id }] } },
        {
            $project: {
                senderId: 1, senderName: 1, receiverId: 1, receiverName: 1, message: 1, createdAt: 1, "mySelf": { $cond: [{ $eq: ["$senderId", id] }, true, false] }
            }
        }
    ])

    res.send(data)
}



module.exports = {
    addMessage,
    getAllMessage
}