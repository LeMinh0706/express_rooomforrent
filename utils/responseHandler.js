module.exports={
    CreateErrorRes:function(res,message,statusCode){
        return res.status(statusCode).send({
            success:false,
            time: new Date().toISOString(),
            message:message
        })
    },
    CreateSuccessRes:function(res,data,statusCode){
        return res.status(statusCode).send({
            success:true,
            time: new Date().toISOString(),
            data:data
        })
    }
}