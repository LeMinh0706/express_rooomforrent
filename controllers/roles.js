var roleModel = require('../schemas/role')
module.exports = {
    GetAllRoles: async function(){
        return await roleModel.find({
            isDeleted:false
          })
    },
    GetRoleById: async function(id){
        return await roleModel.findById(id)
    },
    CreateARole:async function(name){
       try {
        let newRole = new roleModel({
            roleName:name
        })
        return await newRole.save()
       } catch (error) {
        throw new Error(error.message)
       }
    }
}