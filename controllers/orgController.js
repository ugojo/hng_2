const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const getOrg = async(req, res) =>{

    console.log(req.usersId.userId);
    const org = await prisma.user.findUnique({
        where: {
            userId: req.usersId.userId
        },
        include:{
            firstName: false,
            lastName: false,
            password: false,
            phone: false,
            email: false,
            userId: false,
            organisations: true
        }
    })


    res.status(200).json({"status": "sucess", "message": "user login sucessfully", data: org})
}

const getOrgId = async(req, res)=>{
    const org = await prisma.organisation.findUnique({
        where:{
            orgId: req.params.orgId
        }
    })
    res.status(200).json({"message": org})
}

//create organisation
const createOrg = async(req, res, next)=>{
    const {name, description} = req.body

    const emptyfield = []

    if (!name) {
        emptyfield.push('Organisation name required')
    }
    if (emptyfield.length > 0) {
        return res.status(422).json({"errors":
            [{"field": emptyfield, "message": emptyfield +" Required"}] })
    }

   try {
    const org = await prisma.organisation.create({
        data: {
            name,
            description,
            usersId : {
                connect: {
                    userId : req.usersId.userId
                }
            }
        }
    })
    res.status(200).json({"status": "success", "message": "Organisation created sucessfully",
                          data: org
    })

   } catch (error) {
      return next(error)
   }
}


// UPDATE ORGANISATION BY ADDING USERS
const updateOrg = async (req, res)=>{

    const {orgId} = req.body

    const emptyfield = []

    if (!orgId) {
        emptyfield.push('Organisation Id Required')
    }
    // if (!req.usersId.userId) {
    //     emptyfield.push('User Id Required')
    // }

    if (emptyfield.length > 0) {
        return res.status(422).json({"errors":
            [{"field": emptyfield, "message": emptyfield +" Required"}] })
    }

    const orgExits = await prisma.organisation.findUnique({
        where:{orgId}
    })
    if (!orgExits) {
        return res.status(401).json({"status": "Bad request", 
            "message":"Organisation not found",
           "statusCode": 404 })
    }
    const org = await prisma.organisation.update({
        where: {
            orgId
        },
        data:{
            usersId :{
                connect : {
                    userId: req.usersId.userId
                }
            }
        }
    })
    res.status(200).json({"message": org})
}

module.exports = {
        getOrg,
        getOrgId,
        createOrg,
        updateOrg
}