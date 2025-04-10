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
    },
    UpdateARole: async function (id, body) {
        try {
            let role = await roleModel.findById(id);
            let allowField = ["roleName"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    role[key] = body[key];
                }
            }
            return await role.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
}