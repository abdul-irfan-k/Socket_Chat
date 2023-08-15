const jwt = require('jsonwebtoken')
const { set } = require('mongoose')

const verifyAuthentication = async (req, res, next) => {
   

    const token = req.cookies.acessToken
    const refreshToken = req.cookies.refreshToken

    if (!token) {
        return res.send("Access denied Please login")
    }

    const decode = jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
                if (err) console.log("no reset Token found ", err)
                else {
                    const refreshToken = jwt.sign({ id: decode.id, username: decode.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1m" })
                    res.cookie("refreshToken", refreshToken, { httpOnly: true, sometime: "strict" })
                    // res.send("no sended")
                    req.user = {
                        id: decode.id,
                        username: decode.username
                    }
                    next()
                }
            })
        }
        else {
            req.user = {
                id: decode.id,
                username: decode.username
            }
            next()
        }
    })
}



module.exports = {
    verifyAuthentication
}