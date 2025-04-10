var roomTypeModel = require('../schemas/roomType')
module.exports = {
    GetAllRoomType: async function(status, currentPage =1, limit = 5){
        let roomType =  await roomTypeModel.find({
            isDeleted:status
        })
        const totalItems = roomType.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = roomType.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetRoomTypeName: async function(name){
        return await roomTypeModel.findOne({
            typeName: name 
        });
    
    },
    CreateARoomType:async function(name){
       try {
        let newRoomType = new roomTypeModel({
            typeName:name
        })
        return await newRoomType.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateARoomType: async function (id, body) {
        try {
            let roomType = await roomTypeModel.findById(id);
            let allowField = ["typeName"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    roomType[key] = body[key];
                }
            }
            return await roomType.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteARoomType: async function (id) {
        try {
            let roomType = await roomTypeModel.findById(id)
            return await roomTypeModel.findByIdAndUpdate(
                id, {
                isDeleted: !roomType.isDeleted
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
}