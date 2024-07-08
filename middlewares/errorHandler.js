

const errorHandler = (error, req, res, next)=>
{
    console.log(error);
    const errStatus = error.name || "Bad Request"
    const errstatusCode = error.statusCode || 500
    const errMsg = error.message

    res.status(errstatusCode).json({
        "status": errStatus,
        "message": errMsg,
        "statusCode": errstatusCode
    })
}


module.exports = errorHandler