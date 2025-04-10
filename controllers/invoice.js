
var invoiceModel = require('../schemas/invoice')
var postModel = require('../schemas/post')
var serviceModel = require('../schemas/services')
module.exports = {
    GetInvoiceByUser: async function (userId, serviceName,  currentPage = 1 , limit =5 ) {
        let posts = await postModel.find({ user: userId }, '_id'); 

        let postIds = posts.map(p => p._id);
        let invoices = await invoiceModel.find({ post: { $in: postIds } })
        .sort({ createdAt: -1 }) 
        .populate({
            path: 'service', 
            select: 'serviceName'  
        });
        if (serviceName) {
            invoices = invoices.filter(invoice => invoice.service?.serviceName.toLowerCase() === serviceName.toLowerCase());
        }
        const totalItems = invoices.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = invoices.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetStatistic:  async function (year) {
        let months = {};
        for (let i = 1; i <= 12; i++) {
            months[`Tháng ${i}`] = 0;
        }
    
        const invoices = await invoiceModel.find({
            createdAt: {
                $gte: new Date('2025-01-01T00:00:00.000Z'),
                $lt: new Date('2026-01-01T00:00:00.000Z')
            }
        });
    
        invoices.forEach(invoice => {
            let date = new Date(invoice.createdAt);
            let month = date.getMonth() + 1; 
            let key = `Tháng ${month}`;
            months[key] += invoice.totalPrice || 0;

        });
    
        return months;
    },
    GetStatisticByTime:  async function (year, month) {
        const allServices = await serviceModel.find(); 
        const serviceMap = {};
        allServices.forEach(service => {
            serviceMap[service.serviceName] = 0;
        });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(month === 12 ? year + 1 : year, month === 12 ? 0 : month, 1);

        const invoices = await invoiceModel.find({
        createdAt: {
            $gte: startDate,
            $lt: endDate
        }
        }).populate('service');

    invoices.forEach(invoice => {
        const name = invoice.service?.serviceName;
        const amount = invoice.totalPrice;
        if (name && serviceMap.hasOwnProperty(name)) {
            serviceMap[name] += amount;
        }
    });

    return serviceMap;
    }
}