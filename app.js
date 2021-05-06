require('dotenv').config()
const express = require("express")

const cookieParser = require("cookie-parser")
const mongoose= require("mongoose")
const morgan = require("morgan")
const fetch = require("node-fetch")
const socketIo = require("socket.io")
const app = express()

//khai bao cua gg 
const {OAuth2Client} = require('google-auth-library');

const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
// kết thúc khai báo gg 
app.set("view engine", "ejs")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))// load image
app.use("/public",express.static('public'))// load css and js

app.use('/',require('./route/page'))
app.use('/',require('./route/auth'))


//mongoose.connect("mongodb://localhost:27017/DoAnWebNangCao",
mongoose.connect("mongodb+srv://Thinh:thinh54082166@doanwebnangcao.9qotc.mongodb.net/DoAnWebNangCao?retryWrites=true&w=majority",
    {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex: true}
)

const db = mongoose.connection;
db.on("error",(err)=>{
    console.log(err);
})

db.once('open',()=>{
    console.log(" database  da duoc ket noi");
})
app.use(morgan('dev'))
const httpServer=app.listen(process.env.PORT||3000, ()=>{
    console.log("server is running on port 3000")
})

const io= socketIo(httpServer)

io.on("connection",client=>{
    console.log("client was connected");
    client.on('info',data=>{// cách viết của es6
        //console.log("data nhận từ client",data);
        client.broadcast.emit('dataWhenFPostNoti', data)
    })
})
