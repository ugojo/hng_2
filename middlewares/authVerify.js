const { PrismaClient } = require("@prisma/client")
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

const authVerify = async(req, res, next)=>{
    const {authorization} = req.headers

    if (!authorization) {
        return res.status(401).json({"status": "Bad request", 
            "message":"Authentication Token Failed",
           "statusCode": 401 })
    }

    const token = authorization.split(' ')[1]

    try {
        const {userId} = jwt.verify(token, process.env.SECRET_KEY)
        req.usersId = await prisma.user.findUnique({
            where:{
                userId
            },
        select:{
            userId: true
        }})
        console.log({"req" : req.usersId});
        next()
    } catch (error) {
        return next(error)
    }
}

module.exports = authVerify