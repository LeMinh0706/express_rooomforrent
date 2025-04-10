var postCategoryModel = require('../schemas/PostCategory')
module.exports = {
    GetAllPostCategory: async function(status, currentPage =1, limit = 5){
        let categorys =  await postCategoryModel.find({
            isDeleted:status
          })
          const totalItems = categorys.length;
          const totalPage = Math.ceil(totalItems / limit);
          const startIndex = (currentPage - 1) * limit;
          const paginatedResults = categorys.slice(startIndex, startIndex + limit);
          return {
              totalPage,          
              currentPage,           
              content: paginatedResults 
          };
    },
    GetCategoryByName: async function(name){
        return await postCategoryModel.findOne({
            categoryName: name 
        });
    
    },
    CreateAPostCategory:async function(name){
       try {
        let postCategory = new postCategoryModel({
            categoryName:name
        })
        return await postCategory.save()
       } catch (error) {
        throw new Error(error.message)
       }
    },
    UpdateAPostCategory: async function (id, body) {
        try {
            let postCategory = await postCategoryModel.findById(id);
            let allowField = ["categoryName"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    postCategory[key] = body[key];
                }
            }
            return await postCategory.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAPostCategory: async function (id) {
        try {
            let category = await postCategoryModel.findById(id)
            return await postCategoryModel.findByIdAndUpdate(
                id, {
                isDeleted: !category.isDeleted
            },{new: true }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
}