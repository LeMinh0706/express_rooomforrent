const imageProductModel = require('../schemas/postImages'); 

module.exports = {
    deleteImagesByPostId: async function (postId) {
        try {
            const images = await imageProductModel.find({ post: postId });
            if (images.length > 0) {
            await imageProductModel.deleteMany({ post: postId });
            }
        } catch (error) {
            console.error('Error while deleting images:', error);
            return {
            success: false,
            message: 'Error while deleting images.',
            error: error.message
            };
        }
    }
}

