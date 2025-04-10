var servicesModel = require('../schemas/services')
var invoiceModel = require('../schemas/invoice')
const { GetUserByUsername } = require('./users')
module.exports = {
    GetAllServices: async function(status, currentPage =1, limit = 5){
        let service =  await servicesModel.find({
            isDeleted:status
        })
        const totalItems = service.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = service.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetServicesByServiceName: async function(name){
        return await servicesModel.findOne({
            serviceName: name 
          });

    },
    GetServicesOfUser: async function() {
        return await servicesModel.find({
            isDeleted: false,
            serviceName: { $ne: "Gia hạn bài" } 
        });
    },
    CreateAServices:async function(name, price){
       try {
        let newServices = new servicesModel({
            serviceName:name,
            price:price
        })
        return await newServices.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateAServices: async function (id, body) {
        try {
            let services = await servicesModel.findById(id);
            let allowField = ["serviceName", "price"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    services[key] = body[key];
                }
            }
            return await services.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAServices: async function (id) {
        try {
            let service = await servicesModel.findById(id)
            return await servicesModel.findByIdAndUpdate(
                id, {
                isDeleted: !service.isDeleted
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
}