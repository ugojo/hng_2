const {PrismaClient} = require('@prisma/client')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const errorHandler = require('../middlewares/errorHandler')

const prisma = new PrismaClient()


const  createToken =  (userId)=>{
    return jwt.sign({userId}, process.env.SECRET_KEY, {expiresIn: '1d'})
}

const login = async (req, res)=>{

    const {email} = req.body
    const passwrd = req.body.password

    const emptyfield = []

    if (!email) {
        emptyfield.push('email')
    }
    if (!passwrd) {
        emptyfield.push('password')
    }
    if (emptyfield.length > 0) {
        return res.status(422).json({"errors":
            [{"field": emptyfield, "message": emptyfield +" Required"}] })
    }

    const user = await prisma.user.findFirst({
        where:{
            email
        }
       })
    if (!user) {
        return res.status(401).json({"status": "Bad request", 
                                     "message":"Authentication failed",
                                    "statusCode": 401 })
    }
    const verifyPass = await bcrypt.compare(passwrd, user.password)
    if (!verifyPass) {
        return res.status(401).json({"status": "Bad request", 
                                     "message":"Authentication failed",
                                    "statusCode": 401 })
    }
    const {password,  ...otherDetails} = user
    const token = createToken(user.userId)

    res.status(200).json({'status': 'success', 'message': 'Login successful',
                           data :  {'accessToken': token}, 'user' : otherDetails})
}





const signup = async(req, res, next)=>{

    const {firstName, lastName, email, phone} = req.body
    const passwrd = req.body.password

    const emptyfield = []

    if (!firstName) {
        emptyfield.push('firstName')
    }
    if (!lastName) {
        emptyfield.push('lastName')
    }
    if (!email) {
        emptyfield.push('email')
    }
    if (!passwrd) {
        emptyfield.push('password')
    }
    if (!phone) {
        emptyfield.push('phone')
    }
    if (emptyfield.length > 0) {
        return res.status(422).json({'error':{'field': emptyfield, "message":"All field required" }})
    }
    const genSalt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(passwrd, genSalt)
    
    const userExits = await prisma.user.findFirst({
        where:{
            email
        },
    })
    if (userExits) {
        return res.status(401).json({"status": "Bad request", 
                                     "message":"Can't use email",
                                    "statusCode": 401})
    }
    const user = await prisma.user.create({
        data:{
            firstName,
            lastName,
            email,
            password: hashPassword,
            phone,
            organisations : {
             create: {
                name : firstName+"'s Organisation",
             }
        }
    }
    })
    const {password, ...otherDetails} = user
    res.status(201).json({'user': otherDetails, "message":"User registered sucessfully" })
}


module.exports = {
    login,
    signup,
    createToken
}