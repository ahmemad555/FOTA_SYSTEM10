const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique:[true,"user is already exist"],
        required: [true, 'email is required'],
        trim: true
    },
    name:{
        type:String,
        required:[true,"name is required"]
    },
    password: {
        type: String,
        minlength: [8, 'password must be at least 8 characters long'],
        required: [true, 'password is required']
    },
    verified:{
        type:Boolean,
        default:false
    },
    role: {
        type: String,
        enum: ['manager', 'admin','user'],
        default: 'user'
    },
    authToken: String,
    profileRef:{
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'profileModel'
    },
    profileModel:{
        type: String,
        enum: ['Student', 'Instructor', 'Manager', 'Admin'],
        default:null
    },
    history:{
        type: Array,
        default: []
    },
    resetPasswordTokenUsed: {
        type: Boolean,
        default: false
    },

}, {
    timestamps: true
});

// حذف الـ index القديم عند تشغيل التطبيق
// userSchema.pre('save', async function() {
//     try {
//         await this.collection.dropIndex('userId_1');
//     } catch (error) {
//         // تجاهل الخطأ إذا لم يكن الـ index موجوداً
//     }
// });



// compare password 
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};










const User = mongoose.model("User", userSchema);

module.exports = User;

