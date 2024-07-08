const express = require('express')
require('dotenv').config()
const userRouter = require('./routers/userRouter')
const orgRouter = require('./routers/orgRouter')
const errorHandler = require('./middlewares/errorHandler')


const app = express()


app.use(express.json())

app.use((req, res, next)=>{

    console.log(req.path, req.method);
    next();
})

app.use('/auth/',userRouter)
app.use('/organsitions/', orgRouter)


app.use(errorHandler)


module.exports = app