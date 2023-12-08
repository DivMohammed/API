const {Schema, model} = require("mongoose")

const AdminSchema = new Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        // unique: true
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type: String,
    },
    backgroundImage: String,
    GalleryImage:{
        type: Array,
    },
})

const AdminModel = model("admins" ,AdminSchema)
module.exports = AdminModel