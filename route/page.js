const express = require("express")
const router = express.Router()
const post = require('../models/post')
const {OAuth2Client} = require('google-auth-library');
const authenticate= require('../middleWare/authenticate');
const accountStudent = require("../models/accountStudent");
const accountF = require('../models/account')
const notification = require('../models/notification')
const checkAuthen = require("../middleWare/checkAuthenGG")
const authController = require('../Controller/authController')
const CLIENT_ID='100847206415-rbdoqmgsbdvlik3s3nmukildi3mbpivg.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


router.get("/",checkAuthen,(req,res)=>{
    let user = req.user
  
    post.find({}).sort({createdAt:-1}).limit(10).exec((err, docs)=>{
        // sort ở đây lấy theo thời gian tạo đi từ tạo sau thì chạy lên đầu ( thời gian tạo gân nhất thì suất hiện đầu tiên ) là trừ 1 , giới hạn là 10 bái
        if(err)
            console.log(err);
        else 
        {
            let token = req.cookies['session-token']
            if(token!==undefined){
                
                let user = {}
                async function verify() {
                    const ticket = await client.verifyIdToken({
                        idToken: token,
                        audience: CLIENT_ID,  
                    });
                    const payload = ticket.getPayload();
                        user.email= payload.email;
                }
                verify().then(()=>{
                    console.log(user.email);
                    var email = user.email
                    console.log("email = user.email", email);
                    accountStudent.findOne({email: user.email},(err, doc)=>{
                        //console.log(doc);
                        if(doc.length===0){
                            res.render('index',{doc,email})
                        }
                        else {
                        res.render('index',{doc,docs,email})
                        }
                    })
                    
                })
            }
            else {
                let email = req.cookies.account;
                //console.log(email);
                accountF.findOne({email:email},(err, doc)=>{
                    res.render('index',{doc,docs,email})
                })
        }
        } 
    })
    
  
})
router.get('/signup',(req,res)=>{
    var token = req.cookies.account
    if(token.includes("admin752")){
        res.render('signup')
    }
    else {
        res.redirect('/')
    }
    //res.render("signup")
})
router.get("/login",(req,res)=>{
    if(req.cookies['session-token'] !==undefined || req.cookies.account!== undefined){
        res.redirect('/')
    }else 
    res.render("login")
})

router.get('/logout',(req,res)=>{
    res.clearCookie("session-token");
    res.clearCookie('jwt');
    res.clearCookie('account')
    res.redirect('/login')
})


router.get('/error-page',(req,res)=>{
    let user = req.user
    res.render('error')
})

router.get('/admin/Account',(req,res)=>{
    res.render('admin-account')
})

//router của sv 
router.get('/profile',checkAuthen,(req,res)=>{
    let token = req.cookies['session-token']
    if(token!==undefined){
    let user = {}
     async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: token,
             audience: CLIENT_ID,  
         });
         const payload = ticket.getPayload();
             user.email= payload.email;
       }
       verify().then(()=>{
            var email = user.email
            accountStudent.findOne({email: user.email},(err, doc)=>{
            //console.log(user.email);
               post.find({email:user.email}).sort({createdAt:-1}).limit(10).exec((error,docs)=>{
                  // console.log("doc,",docs.image.length);
                   if(error){
                       console.log(error);
                   }
                   else 
                res.render('profile',{doc,docs,email})
               })
               //console.log(doc);
              
           })
          
       })
    }
    else {     let email = req.cookies.account;
        accountF.findOne({email:email},(err, doc)=>{
            post.find({email:email}).sort({createdAt:-1}).limit(10).exec((error,docs)=>{
                // console.log("doc,",docs.image.length);
                 if(error){
                     console.log(error);
                 }
                 else 
              res.render('profile',{doc,docs,email})
             })
        })}
            
})

router.get('/edit-account',(req,res)=>{
    
    let token = req.cookies['session-token']
    if(token!==undefined){
    //console.log("da vao ");
    let user = {}
     async function verify() {
         const ticket = await client.verifyIdToken({
             idToken: token,
             audience: CLIENT_ID,  
         });
         const payload = ticket.getPayload();
             user.email= payload.email;
       }
       verify().then(()=>{
           //console.log(user.email);// user email lấy ở bên trên 
           accountStudent.findOne({email: user.email},(err, doc)=>{
               //console.log(doc.fullname);
               res.render('edit-account',{doc})
           })
          
       })
    }
    else {
       // console.log("dã vao duoi");
        var email = req.cookies.account// 2 cách lấy  cookie 1 giống bên  if 2 là dùng . giống ở đây
        console.log("email:",email);
        accountF.findOne({email: email},(err,doc)=>{
            res.render('edit-account',{doc})
        })
    }
  
})
// tạo thông báo
router.get('/createNotification',checkAuthen,(req,res)=>{
    var token =  req.cookies.jwt;
    if(token){
        var email = req.cookies.account
        console.log("email",email);
        accountF.findOne({email: email},(err, doc)=>{
            notification.find({email:email}).exec((err, docs)=>{
                notification.find({email:email}).limit(10).sort({createdAt:-1}).exec((err,infoNoti)=>{
               
                res.render('create-notfication',{doc, infoNoti,docs})
            })
        })
         
        })

    }
    else res.redirect('/')
    
})
router.get('/createNotification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    var token =  req.cookies.jwt;
    if(token){
        var email = req.cookies.account
        console.log("email",email);
        accountF.findOne({email: email},(err, info)=>{
            notification.find({email:email}).exec((err, docs)=>{
                notification.find({email:email}).skip(skip).limit(10).sort({createdAt:-1}).exec((err,infoNoti)=>{
                console.log(info.faculty);
                res.render('create-notfication',{info, infoNoti,docs})
            })
        })
         
        })

    }
    else res.redirect('/')
    
})

// chỉnh sửa thông báo
//router.get("/deleteNoti/:id",authController.deleteNoti)

// xem thông tin profile 
router.get("/profile/:email",(req,res)=>{
    var email= req.params.email
    console.log( "email láy từ params",email);
            let token = req.cookies['session-token']
            if(token!==undefined){
            let user = {}
             async function verify() {
                 const ticket = await client.verifyIdToken({
                     idToken: token,
                     audience: CLIENT_ID,  
                 });
                 const payload = ticket.getPayload();
                     user.email= payload.email;
               }
               verify().then(()=>{
                    var emailCookies = user.email
                    accountStudent.findOne({email: user.email},(error, doc)=>{
                    //console.log(user.email);
                        post.find({email: email}).sort({createdAt:-1}).limit(10).exec((err,docs)=>{
                          // console.log("doc,",docs.image.length);
                           if(err){
                               console.log(err);
                           }
                           else 
                        res.render('profile',{doc,docs,emailCookies})
                       })
                       //console.log(doc);
                      
                   })
                  
               })
            }
    
    
    else {
        emailCookies = req.cookies.account
        post.find({email: email}).sort({createdAt:-1}).limit(10).exec((err,docs)=>{
            accountF.findOne({email:emailCookies},(err,doc)=>{
                res.render('profile',{doc,docs})
            })
        })
    }
    
})


router.get('/notification',checkAuthen,(req,res)=>{
    notification.find({}).sort({createdAt:-1}).exec((err, docs)=>{// dòng trên này dùng để hiển thị có bao nhiêu nút bấm 
        notification.find({}).sort({createdAt:-1}).limit(10).exec((err, doc)=>{// dòng dưới này dùng đểload 10 data
            res.render('department-notfication',{doc,docs})
        })
    })
})

router.get('/detailNotify/:id',(req,res)=>{
    var id= req.params.id
    console.log(id);
    notification.findOne({_id:id},(err,result)=>{
        console.log(result.faculty);
        //console.log("result",result.faculty);
        console.log("result2",result.image[1]);
        res.render("notification-detail",{result})
    })
})

router.get('/CTHSSV',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)",result,pathname:"CTHSSV"})
    })
})
})
router.get('/CTHSSV/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng Công tác học sinh sinh viên (CTHSSV)",pathname:"CTHSSV"})
        })
    })
})


router.get('/KhoaCntt',checkAuthen,(req,res)=>{   
    notification.find({faculty:"Khoa Công nghệ thông tin"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Công nghệ thông tin"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,faculty:"Khoa Công nghệ thông tin", result,pathname:"KhoaCntt"})
        })
    })
})
router.get('/KhoaCntt/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Công nghệ thông tin"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Công nghệ thông tin"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Công nghệ thông tin",pathname:"KhoaCntt"})
        })
    })
})

router.get('/TTTH',checkAuthen,(req,res)=>{
    notification.find({faculty:"Trung tâm tin học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm tin học"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,faculty:"Trung tâm tin học",pathname:"TTTH",result})
        })
    })
})
router.get('/TTTH/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Trung tâm tin học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm tin học"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Trung tâm tin học",pathname:"TTTH"})
        })
    })
})

router.get('/SDTC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)",result,pathname:"SDTC"})
    })
})
})
router.get('/SDTC/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Trung tâm đào tạo phát triển xã hội (SDTC)",pathname:"SDTC"})
        })
    })
})

router.get('/ATEM',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)",result,pathname:"ATEM"})
    })
})
})
router.get('/ATEM/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)",pathname:"ATEM"})
        })
    })
})

router.get('/TTHTDN',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên",result,pathname:"TTHTDN"})
    })
})
})
router.get('/TTHTDN/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Trung tâm hợp tác doanh nghiệp và cựu sinh viên",pathname:"TTHTDN"})
        })
    })
})

router.get('/TTNNTH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa",result,pathname:"TTNNTH"})
    })
})
})
router.get('/TTNNTH/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa",pathname:"TTNNTH"})
        })
    })
})

router.get('/VCS',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Viện chính sách kinh tế và kinh doanh"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Viện chính sách kinh tế và kinh doanh"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Viện chính sách kinh tế và kinh doanh",result,pathname:"VCS"})
    })
})
})
router.get('/VCS/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Viện chính sách kinh tế và kinh doanh"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Viện chính sách kinh tế và kinh doanh"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Viện chính sách kinh tế và kinh doanh",pathname:"VCS"})
        })
    })
})

router.get('/KhoaLuat',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa luật"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa luật"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa luật",result,pathname:"KhoaLuat"})
    })
})
})
router.get('/KhoaLuat/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa luật"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa luật"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa luật",pathname:"KhoaLuat"})
        })
    })
})

router.get('/KhoaMyThuatCongNgiep',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Mỹ thuật công nghiệp"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Mỹ thuật công nghiệp"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Mỹ thuật công nghiệp",result,pathname:"KhoaMyThuatCongNgiep"})
    })
})
})
router.get('/KhoaMyThuatCongNgiep/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Mỹ thuật công nghiệp"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Mỹ thuật công nghiệp"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Mỹ thuật công nghiệp",pathname:"KhoaMyThuatCongNgiep"})
        })
    })
})

router.get('/KhoaDien',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Điện-điện tử"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Điện-điện tử"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Điện-điện tử",result,pathname:"KhoaDien"})
    })
})
})
router.get('/KhoaDien/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Điện-điện tử"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Điện-điện tử"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Điện-điện tử",pathname:"KhoaDien"})
        })
    })
})

router.get('/KhoaQTKD',checkAuthen,(req,res)=>{
    notification.find({faculty:"Khoa Quản trị kinh doanh"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Quản trị kinh doanh"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Quản trị kinh doanh",result,pathname:"KhoaQTKD"})
    })
})
})
router.get('/KhoaQTKD/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Quản trị kinh doanh"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Quản trị kinh doanh"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Quản trị kinh doanh",pathname:"KhoaQTKD"})
        })
    })
})

router.get('/KhoaMoiTruong',checkAuthen,(req,res)=>{
    notification.find({faculty:"Khoa Môi trường và bảo hộ lao động"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Môi trường và bảo hộ lao động"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Môi trường và bảo hộ lao động",result,pathname:"KhoaMoiTruong"})
    })
})
})
router.get('/KhoaMoiTruong/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Môi trường và bảo hộ lao động"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Môi trường và bảo hộ lao động"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Môi trường và bảo hộ lao động",pathname:"KhoaMoiTruong"})
        })
    })
})

router.get('/KhoaLDCD',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Lao động công đoàn"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Lao động công đoàn"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Lao động công đoàn",result,pathname:"KhoaLDCD"})
    })
})
})
router.get('/KhoaLDCD/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Lao động công đoàn"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Lao động công đoàn"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Lao động công đoàn",pathname:"KhoaLDCD"})
        })
    })
})

router.get('/KhoaGDQT',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa giáo dục quốc tế"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa giáo dục quốc tế"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa giáo dục quốc tế",result,pathname:"KhoaGDQT"})
    })
})
})
router.get('/KhoaGDQT/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa giáo dục quốc tế"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa giáo dục quốc tế"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa giáo dục quốc tế",pathname:"KhoaGDQT"})
        })
    })
})

router.get('/KhoaTCNH',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Khoa Tài chính ngân hàng"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Tài chính ngân hàng"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Khoa Tài chính ngân hàng",result,pathname:"KhoaTCNH"})
    })
})
})
router.get('/KhoaTCNH/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Khoa Tài chính ngân hàng"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Khoa Tài chính ngân hàng"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Khoa Tài chính ngân hàng",pathname:"KhoaTCNH"})
        })
    })
})

router.get('/PhongDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Đại học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Đại học"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Đại học",result,pathname:"PhongDaiHoc"})
    })
})
})
router.get('/PhongDaiHoc/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng Đại học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Đại học"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng Đại học",pathname:"PhongDaiHoc"})
        })
    })
})

router.get('/PhongSauDaiHoc',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng Sau đại học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Sau đại học"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng Sau đại học",result,pathname:"PhongSauDaiHoc"})
    })
})
})
router.get('/PhongSauDaiHoc/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng Sau đại học"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng Sau đại học"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng Sau đại học",pathname:"PhongSauDaiHoc"})
        })
    })
})

router.get('/PhongDienToanMayTinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng điện toán và máy tính"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng điện toán và máy tính"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng điện toán và máy tính",result,pathname:"PhongDienToanMayTinh"})
    })
})
})
router.get('/PhongDienToanMayTinh/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng điện toán và máy tính"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng điện toán và máy tính"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng điện toán và máy tính",pathname:"PhongDienToanMayTinh"})
        })
    })
})

router.get('/PhongKhaoThi',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng khảo thí và kiểm định chất lượng"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng khảo thí và kiểm định chất lượng"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng khảo thí và kiểm định chất lượng",result,pathname:"PhongKhaoThi"})
    })
})
})
router.get('/PhongKhaoThi/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng khảo thí và kiểm định chất lượng"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng khảo thí và kiểm định chất lượng"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng khảo thí và kiểm định chất lượng",pathname:"PhongKhaoThi"})
        })
    })
})

router.get('/PhongTaiChinh',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"Phòng tài chính"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng tài chính"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"Phòng tài chính",result,pathname:"PhongTaiChinh"})
    })
})
})
router.get('/PhongTaiChinh/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"Phòng tài chính"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"Phòng tài chính"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"Phòng tài chính",pathname:"PhongTaiChinh"})
        })
    })
})

router.get('/PhongLC',checkAuthen,(req,res)=>{
    
    notification.find({faculty:"TDT Creative Language Center"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"TDT Creative Language Center"}).sort({createdAt:-1}).limit(10).exec((err,doc)=>{
        res.render("department-notfication",{doc,faculty:"TDT Creative Language Center",result,pathname:"PhongLC"})
    })
})
})
router.get('/PhongLC/notification/:number',checkAuthen,(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    notification.find({faculty:"TDT Creative Language Center"}).sort({createdAt:-1}).exec((err, result)=>{
        notification.find({faculty:"TDT Creative Language Center"}).sort({createdAt:-1}).skip(skip).limit(10).exec((err,doc)=>{
            res.render("department-notfication",{doc,result,faculty:"TDT Creative Language Center",pathname:"PhongLC"})
        })  
    })
    
})

router.get('/notification/:number',(req,res)=>{
    var {number}=req.params
    console.log(number);
    var skip = 10*(number-1)
    console.log(skip);
    notification.find({}).sort({createdAt:-1}).exec((err, docs)=>{
    notification.find({}).sort({createdAt:-1}).limit(10).skip(skip).exec((err,doc)=>{
        res.render("department-notfication",{doc,docs})
    })
})
})

 module.exports= router