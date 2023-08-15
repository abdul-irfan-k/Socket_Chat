const userSchema = require("../Model/Userschema")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Groupschema = require("../Model/Groupschema")
const Userschema = require("../Model/Userschema")

const login = async (req, res) => {
    console.log(req.url)

    const { username, password } = req.body
    const exisistingUser = await userSchema.findOne({ username })
    if (exisistingUser === null) return res.send({ message: "No user found in this username", isLogined: false })

    const isCorrectPassword = await bcrypt.compare(password, exisistingUser.password)
    if (!isCorrectPassword) return res.send({ message: "invalid username or password", isLogined: false })

    const acessToken = await jwt.sign({ id: exisistingUser._id, username: exisistingUser.username }, process.env.ACESS_TOKEN_SECRET, { expiresIn: "1h" })
    const refreshToken = await jwt.sign({ id: exisistingUser._id, username: exisistingUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })

    res.cookie("acessToken", acessToken, { httpOnly: true, somesite: "strict" })
    res.cookie("refreshToken", refreshToken, { httpOnly: true, somesite: "strict" })
    res.send({ message: "lgoin successfully", isLogined: true, userDetails: { username, userid: exisistingUser._id } })
}

const signUp = async (req, res) => {
    console.log(req.url)

    const { username, email, password, comfirmPassword } = req.body
    if (password !== comfirmPassword) return res.send("password and comfirm password does not matched")

    const oldUser = await userSchema.findOne({ username })
    if (oldUser !== null) return res.send("Sorry,  already have an account in this username")

    const hashedpassword = await bcrypt.hash(password, 12)
    const user = new userSchema({ username, email, password: hashedpassword })
    const data = await user.save()
}

const logout = (req, res) => {
    res.clearCookie("token")
    res.send({ logout: "success" })
}


const getAllUser = async (req, res) => {
    const data = await Userschema.aggregate([

        {
            $project: {
                username: 1, email: 1,
            }
        },
        {
            $unionWith: {
                coll: 'groups', pipeline: [{ $set: { "isGroup": true } },]
            }
        },
    ])
    res.send(data)
}

const createGroup = async (req, res) => {
    console.log(req.url)
    const { groupName } = req.body
    const { username, id } = req.user

    const group = new Groupschema({ groupName, creatorName: username, creatorId: id, admins: [id], users: [id] })
    const data = await group.save()
    res.send(data)
}

const resetGroupUsers = async (req, res) => {
    console.log(req.url)
    const { groupId } = req.body
    const userid = req.user.id
    console.log(groupId)

    const exsistGroup = await Groupschema.findById(groupId)

    if (exsistGroup == null) return res.send("No Group Found")
    const index = exsistGroup.users.findIndex((id) => id === userid)

    if (index == -1) exsistGroup.users.push(userid)  // adding group user
    else {
        exsistGroup.users = exsistGroup.users.filter(id => id !== userid) // removing user from group
    }

    const newData = await Groupschema.findByIdAndUpdate(groupId, { users: exsistGroup.users }, { new: true })
    res.send(newData)
}

module.exports = {
    login,
    signUp,
    logout,
    getAllUser,
    createGroup,
    resetGroupUsers
}