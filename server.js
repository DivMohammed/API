// CREATE SERVER
const express = require("express")
const app = express()
const _PORT = process.env.PORT || 8000;
const cors = require("cors")
const bodyParser = require("body-parser");

// Package activation
app.use(cors())
// for IDK
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// error stuck
app.use(express.json())

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

app.use(express.static('public'))



const { sendTestEmail } = require("./models/mailer");

const cloudinary = require("cloudinary").v2

const uploadImage = require('./models/Cloudinary')

require('dotenv').config()




app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(
  cors({
    origin: "*",
  })
);









// CONNECT TO DB > DATA BASE
      DBR = process.env.DBR;


// Call the library
const mongoose = require("mongoose")
///////
mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
    const conn = await mongoose.connect(DBR);
    console.log(`MongoDB Connecteed: ${conn.connection.host}`)
    } catch (error) {
    console.log(error)
    process.exit(1)
    }
}














// ADMIN MODEL
const AdminModel = require('./models/Admins')
// const UPimage = require('./models/image');
// const UserGallery = require("./models/imagesGallery");





app.post("/register", async (req , res)=>{
    const {username, password, email, backgroundImage, avatar} = req.body

    const admin = await AdminModel.findOne({email})
    if(admin){
    //the (&&) mean if the condition true do and there is no else if
    return res.json({message: "email already have"})
    }
    if(!admin){
    const hashedPassword = bcrypt.hashSync(password, 10)

    //The number of cycles to store
    const newAdmin = new AdminModel({username, email, password: hashedPassword, backgroundImage, avatar});

    await newAdmin.save()

    const token = jwt.sign({id:newAdmin._id}, process.env.SECRET)
    // Generates a token code specifically for the user
    return res.json({token, adminID: newAdmin._id, message: "admin created"})

    }
});









app.post("/login", async (req, res)=>{
    const {email, password} = req.body


    const admin = await AdminModel.findOne({email})

    if(!admin){
    // !admin && res.json({message: "Email dose not exists!"})
    return res.json({message: "Email dose not exists!"})
    }

    if(admin){
    const isPasswordValid = await bcrypt.compare(password, admin.password);
     !isPasswordValid && res.json({message: "Username or Password is not correct"})

    if(isPasswordValid){
    var token = jwt.sign({id: admin._id}, process.env.SECRET)
    // Generates a token code specifically for the user
    return res.json({token, adminID: admin._id})
    }
    }
})






app.get("/users", async (req, res)=>{
    const users = await AdminModel.find();
    res.json(users)
})





app.post("/update", async (req, res)=>{
    const {urlavataro, username, email, id, urlbackgroundImag, urlavatar, IdImgbackground, IdImgAvatar, imgUrl} = await req.body

    // if(IdImgbackground){
    // await cloudinary.uploader.destroy(IdImgbackground)
    // }

    // if(IdImgAvatar){
    // await cloudinary.uploader.destroy(IdImgAvatar)
    // }
    
    await AdminModel.updateOne({_id:id},{username:username, email:email, avatar:urlavataro, backgroundImage:urlbackgroundImag})

    return res.json({username, email, id, urlavatar, urlbackgroundImag, IdImgbackground, IdImgAvatar,urlavataro})
})







app.post("/updateGallery", async (req, res)=>{
    const {id, GalleryImage} = await req.body

   await AdminModel.updateOne({_id:id},{GalleryImage:GalleryImage})

   return res.json({GalleryImage})
})










app.post("/check", async (req, res)=>{
    const {email} = await req.body

    const check = await AdminModel.findOne({email})
    if (check){
        return res.json("email Exist")
    }

    if (!check){
        return res.json("email does not Exist")
    }
})








// app.get('/getImage', async(req, res)=>{
//     await UPimage.find()
//     .then(users => res.json(users))
//     .catch(err => res.json(err))
// })













// app.get('/getImageGallery', async(req, res)=>{
//     await UserGallery.find()
//     .then(users => res.json(users))
//     .catch(err => res.json(err))
// })






app.post('/deleteGallery', async(req, res)=>{ 
    const {id, i, IdImgGallery} = await req.body

    // const pathFile = `public/imagesGallery/${i}`

    await AdminModel.updateOne({_id:id},{$pull:{GalleryImage:{$in:[i]}}})
    // await UserGallery.deleteOne({image:i})

    // await fs.unlink(pathFile, (err) => {
    //     if (err) {
    //         console.error(err)
    //         return
    //     }
    //     })


    await cloudinary.uploader.destroy(IdImgGallery)

    return res.json({IdImgGallery})

})












app.post("/send_recovery_email", async (req, res) => {
  const {recipient_email, OTP} = await req.body
  try {
    if (recipient_email === "EMAIL_ID") {
      throw new Error(
        "Please update SENDER_EMAIL_ID with your email id in server.js"
      );
    }
    const info = await sendTestEmail(recipient_email,OTP);
    res.send(info);
  } catch (error) {
    res.send(error);
  }
});








app.post('/getId', async(req, res)=>{ 
    const {email, newPassword} = await req.body
    const check = await AdminModel.findOne({email})

    if (check){
        const newHashedPassword = bcrypt.hashSync(newPassword, 10)
        await AdminModel.updateOne({_id:check._id},{password:newHashedPassword})
        return res.json({message: "ok"})
    }

    if (!check){
        return res.json({message: "not"})
    }
})











const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
  })



  app.get("/get-signature", async (req, res) => {
    const timestamp = await Math.round(new Date().getTime() / 1000)
    const signature = await cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp
      },
      cloudinaryConfig.api_secret
    )
    res.json({ timestamp, signature })
  })













  app.post("/uploadImage", async (req, res) => {
  await uploadImage(req.body.image)
      .then((url) => res.send(url))
      .catch((err) => res.status(500).send(err));
  });
  








// Server running
// It is not important that the port number can be any number
// The second parameter is what to do after listening
/////
connectDB().then(() => {
app.listen(_PORT, ()=>{
    console.log("Server work!!")
})
})
/////
// app.listen(_PORT, ()=>{
//     console.log("Server work!!")
// })