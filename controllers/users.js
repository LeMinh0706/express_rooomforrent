let userModel = require('../schemas/user')
let roleModel = require('../schemas/role')
let bcrypt = require('bcrypt')

module.exports = {
    GetAllUsers: async function (status, currentPage = 1, limit = 3) {
        let users = await userModel.find({ isDeleted: status })
        .populate({
            path: 'role',
            match: { roleName: 'User' } 
        });

        users =  users.filter(user => user.role);
        const totalItems = users.length;
        const totalPage = Math.ceil(totalItems / limit);
        const startIndex = (currentPage - 1) * limit;
        const paginatedResults = users.slice(startIndex, startIndex + limit);
        return {
            totalPage,          
            currentPage,           
            content: paginatedResults 
        };
    },
    GetUserByID: async function (id) {
        return await userModel.findById(id).populate({
            path:'role',select:'roleName'
        });
    },
    GetUserByEmail: async function (email) {
        return await userModel.findOne({
            email:email
        }).populate({
            path:'role',select:'roleName'
        });
    },
    GetUserByToken: async function (token) {
        return await userModel.findOne({
            resetPasswordToken:token
        }).populate({
            path:'role',select:'roleName'
        });
    },
    GetUserByUsername: async function (userName) {
        return await userModel.findOne({
            userName: userName
        }).populate({
            path:'role',select:'roleName'
        }).select('-createdAt -users -updatedAt -__v');
    },
    CreateAnUser: async function (userName, password,phoneNumber, email, rolename) {
        try {
            let role = await roleModel.findOne({
                roleName: rolename
            })
            if (role) {
                let user = new userModel({
                    avatar: "http://localhost:4000/avatars/anhmacdinh.png",
                    userName: userName,
                    password: password,
                    phoneNumber: phoneNumber,
                    email: email,
                    role: role._id
                })
                return await user.save();
            } else {
                throw new Error("khong tim thay")
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    UpdateAnUser: async function (user, body) {
        try {
            let allowField = ["password", "email", "avatar","phoneNumber","city","district","ward","address", "role"]
            for (const key of Object.keys(body)) {
                if (allowField.includes(key)) {
                    user[key] = body[key];
                }
            }
            return await user.save();
        } catch (error) {
            throw new Error(error.message)
        }
    },
    DeleteAnUser: async function (id) {
        try {
            let user = await userModel.findById(id);
            return await userModel.findByIdAndUpdate(
                id, {
                isDeleted: !user.isDeleted,
            }
            )
        } catch (error) {
            throw new Error(error.message)
        }
    },
    CheckLogin: async function (username, password) {
        let user = await this.GetUserByUsername(username);
        if(user.isDeleted){
            throw new Error("Tài khoản đã bị khóa")
        }
        if (!user) {
            throw new Error("Username hoặc password không đúng")
        } else {
            if (bcrypt.compareSync(password, user.password)) {
                return  user;
            } else {
                throw new Error("Username hoặc password không đúng")
            }
        }
    },
    ChangePassword: async function(user,oldpassword,newpassword){
        if(bcrypt.compareSync(oldpassword,user.password)){
            user.password = newpassword;
            return await user.save();
        }else{
            throw new Error('oldpassword khong dung')
        }
    },
}
