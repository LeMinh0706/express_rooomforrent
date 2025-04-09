let jwt = require('jsonwebtoken')
let constants = require('../utils/constants')
let userController = require('../controllers/users');
const e = require('express');
module.exports = {
    check_authentication: async function (req, res, next) {
        if (req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization;
            if (authorization.startsWith("Bearer")) {
                let token = authorization.split(" ")[1]
                let result = jwt.verify(token, constants.SECRET_KEY);
                if (result.expire > Date.now()) {
                    let user = await userController.GetUserByID(result.id);
                    req.user = user;
                    next();
                } else {
                    throw new Error("ban chua dang nhap")
                }
            } else {
                throw new Error("ban chua dang nhap")
            }
        } else {
            throw new Error("ban chua dang nhap")
        }
    },
    check_authorization: function (roles) {
        return async function (req, res, next) {
            try {
                let roleOfUser = req.user.role.roleName;
                if (roles.includes(roleOfUser)) {
                    next();
                } else {
                    throw new Error("ban khong co quyen")
                }
            } catch (error) {
                next(error)
            }
        }
    },
    check_me: function (req, res, next) {
        try {
            const userIdFromToken = req.user?.id;  
            const userIdFromParams = req.params.id;  
    
    
            if (userIdFromToken === userIdFromParams) {
                return next();  
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền truy cập vào tài nguyên này.'
                });
            }
        } catch (error) {
            console.error('Error in checkMe:', error);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error.message
            });
        }
    },
}