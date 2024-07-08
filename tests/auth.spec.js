const request = require("supertest");
const app = require('../app.js')
const {PrismaClient} = require('@prisma/client');
const jwt = require('jsonwebtoken')
const authVerify = require('../middlewares/authVerify.js')
const {createToken} = require('../controllers/usersController')

const prisma = new PrismaClient()


afterAll(async()=>{
    await prisma.user.deleteMany({})
    await prisma.organisation.deleteMany({})
    await prisma.$disconnect()
})

describe('POST /auth/register',()=>{
    it('Register new user successfully', async()=>{
        const response = await request(app)
        .post('/auth/register/')
        .send({
            firstName : "ugochukwu",
            lastName: "obi",
            email: "obiugochukwu003@gmail.com",
            password: "12345677890",
            phone: "0709832456"
        })
        expect(response.statusCode).toBe(201)
        expect(response.body.message).toBe('User registered sucessfully')
    })

    it('should fail for missing fields', async()=>{
        const response = await request(app)
        .post('/auth/register/')
        .send({
            firstName : "ugochukwu",
            lastName: "obi",
            email:"" ,
            password: "12345677890",
            phone: "0709832456"
        })
        expect(response.statusCode).toBe(422)
        expect(response.body.error.message).toBe('All field required')
    })
    it('should fail for exsiting uesr', async()=>{
        const response = await request(app)
        .post('/auth/register/')
        .send({
            firstName : "ugochukwu",
            lastName: "obi",
            email:"obiugochukwu003@gmail.com" ,
            password: "12345677890",
            phone: "0709832456"
        })
        expect(response.body.statusCode).toBe(401)
        expect(response.body.message).toBe("Can't use email")
    })
})

describe('POST /auth/login',()=>{
    it('Should log the user successfully', async()=>{
        const response = await request(app)
        .post('/auth/login/')
        .send({
            email:"obiugochukwu003@gmail.com" ,
            password: "12345677890"
        })
        expect(response.body.status).toBe('success')
        expect(response.body.user.email).toBe("obiugochukwu003@gmail.com")
    })
    it('Should fail log user with incorrect password', async()=>{
        const response = await request(app)
        .post('/auth/login/')
        .send({
            email:"obiugochukwu003@gmail.com" ,
            password: "12345677"
        })
        expect(response.body.statusCode).toBe(401)
        expect(response.body.message).toBe("Authentication failed")
    })
})
