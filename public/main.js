
let socket 

  console.log("server  đã sẵn sàng hoạt dộng")
  socket= io()
  socket.on('connect',()=>{
  console.log("đã kết nối socket thành công id= ",socket.id)
  socket.on("dataWhenFPostNoti",(data)=>{
  
    var pathname=''
    if(data.faculty=='Phòng Công tác học sinh sinh viên (CTHSSV)'){
      pathname= 'CTHSSV'
    }else if(data.faculty=='Khoa Công nghệ thông tin'){
      pathname= 'KhoaCntt'
    }else if(data.faculty=='Trung tâm tin học'){
      pathname= 'TTTH'
    }else if(data.faculty=='Trung tâm đào tạo phát triển xã hội (SDTC)'){
      pathname= 'SDTC'
    }else if(data.faculty=='Trung tâm phát triển Khoa học quản lý và Ứng dụng công nghệ (ATEM)'){
      pathname= 'ATEM'
    }else if(data.faculty=='Trung tâm hợp tác doanh nghiệp và cựu sinh viên'){
      pathname= 'TTHTDN'
    }else if(data.faculty=='Trung tâm ngoại ngữ - tin học – bồi dưỡng văn hóa'){
      pathname= 'TTNNTH'
    }else if(data.faculty=='Viện chính sách kinh tế và kinh doanh'){
      pathname= 'VCS'
    }else if(data.faculty=='Khoa luật'){
      pathname= 'KhoaLuat'
    }else if(data.faculty=='Khoa Mỹ thuật công nghiệp'){
      pathname= 'KhoaMyThuatCongNgiep'
    }else if(data.faculty=='Khoa Điện-điện tử'){
      pathname= 'KhoaDien'
    }else if(data.faculty=='Khoa Quản trị kinh doanh'){
      pathname= 'KhoaQTKD'
    }else if(data.faculty=='Khoa Môi trường và bảo hộ lao động'){
      pathname= 'KhoaMoiTruong'
    }else if(data.faculty=='Khoa Lao động công đoàn'){
      pathname= 'KhoaLDCD'
    }else if(data.faculty=='Khoa giáo dục quốc tế'){
      pathname= 'KhoaGDQT'
    }else if(data.faculty=='Khoa Tài chính ngân hàng'){
      pathname= 'KhoaTCNH'
    }else if(data.faculty=='Phòng Đại học'){
      pathname= 'PhongDaiHoc'
    }else if(data.faculty=='Phòng Sau đại học'){
      pathname= 'PhongSauDaiHoc'
    }else if(data.faculty=='Phòng điện toán và máy tính'){
      pathname= 'PhongDienToanMayTinh'
    }else if(data.faculty=='Phòng khảo thí và kiểm định chất lượng'){
      pathname= 'PhongKhaoThi'
    }else if(data.faculty=='Phòng tài chính'){
      pathname= 'PhongTaiChinh'
    }else if(data.faculty=='TDT Creative Language Center'){
      pathname= 'PhongLC'
    }
    
    console.log("pathname",pathname);
    $('#alertNoti').append(`   
    <div id="snackbar" class="alert alert-success" >


    <strong id="facultyAlert"><a id="aLinkNoti"href="/${pathname}/notification/1">${data.faculty}</strong> vừa đăng thông báo : <strong id="messNoti">${data.titlePostNoti}</strong>
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
    </div>
    `)
  })
  })

  function postNoti(){
    var faculty = document.getElementById("selectFaculty").value
    var titlePostNoti = document.getElementById("title-text").value
    console.log("faculty",faculty, titlePostNoti);
    data={
      faculty: faculty,
      titlePostNoti:titlePostNoti
    }
    socket.emit('info',data )
  }





 // hàm dùng đẻ tạo nhiều attribute trong 1 lần 
 function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function openNav() {
  document.getElementById("mySidenav").style.width = "300px";
  document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
}





 function commentPost(event){
  //console.log(event);
  //var classComment =document.getElementById("classCommentId")
 // classComment.addEventListener("keyup", function(event) {
    console.log(event);
  
  //if (event.keyCode === 13) {
   
    //event.preventDefault();
    var comment 
   var contentComment= document.getElementsByClassName("classComment")
   //var btn = event.target
   //var id = btn.dataset.id
   var id = event.getAttribute("data-id")
   //console.log(id);
  for ( var i =0;i <contentComment.length;i++){
    if(contentComment[i].value!==""){
     comment=contentComment[i].value
  
     var imageUserComment = document.getElementById("hiddenPicture").value
     var emailUserComment = document.getElementById("hiddenEmailOfPost").value
     var nameUserComment = document.getElementById("hiddenFullname").value
     //console.log(comment,imageUserComment,nameUserComment,emailUserComment);
    
     var data={
      id:id,
      imageUserComment:imageUserComment,
      emailUserComment:emailUserComment,
      nameUserComment:nameUserComment,
      comment:comment
     }
     contentComment[i].value=""
     $.ajax({
      url: 'http://localhost:3000/commentPost',
      type: 'POST',
      dataType: 'JSON',
      data:data
    
      }).done(ketqua=>{
        if(ketqua.code===0){
          var emailUCommentFS = ketqua.data.emailUComment
          var imageUserCommentFS= ketqua.data.imageUserComment
          var nameUserCommentFS= ketqua.data.nameUserComment
          var content= ketqua.data.content
          var id = ketqua.data.id
          var commentId = ketqua.data.commentId
          console.log(id,imageUserCommentFS,nameUserCommentFS,content);
          console.log("commentId",commentId);
          // ảnh đại diện của người comment
         
          var parentDiv = document.getElementById("addComment-"+id)
          var divComment= document.createElement("div")
          setAttributes(divComment,{"class":"media mt3", "id":commentId})
          var aTag = document.createElement("a")
          setAttributes(aTag,{"class":"pr-2"})
          var pictureComment=document.createElement("img")
          setAttributes(pictureComment,{"src":imageUserCommentFS,"width":"36", "height":"36", "class":"rounded-circle mr-2"})
          aTag.appendChild(pictureComment)
          divComment.appendChild(aTag)
          parentDiv.appendChild(document.createElement("br"))
         

          // nội dung tin comment
          var divOfComment = document.createElement("div")
          setAttributes(divOfComment,{"class":"media-body UpdateDelete"})
          var pTagOfcomment = document.createElement("p")
          setAttributes(pTagOfcomment,{"class":"text-muted"})
          var nodeContentComment = document.createTextNode(content)
         // console.log("nodeContentComment",nodeContentComment);
         var emailUCommentToCheck = document.createElement("input")
         setAttributes(emailUCommentToCheck,{"type":"hidden", "value":emailUCommentFS,"class":"emailUCommentId"})
          var strongOfP = document.createElement("strong")
          var nodeStrongOfP = document.createTextNode(nameUserCommentFS)
          strongOfP.appendChild(nodeStrongOfP)
          pTagOfcomment.appendChild(strongOfP)
          pTagOfcomment.appendChild(document.createTextNode(": "))
          pTagOfcomment.appendChild(nodeContentComment)
          pTagOfcomment.appendChild(emailUCommentToCheck)
          
          aTagUpdateComment=document.createElement("a")
          setAttributes(aTagUpdateComment,{ "class":"text-comment updateComment"})
          nodeUpdateComment= document.createTextNode("chỉnh sửa ")
         aTagUpdateComment.appendChild(nodeUpdateComment)

         aTagDeleteComment=document.createElement("a")
         setAttributes(aTagDeleteComment,{"data-id":id,"data-idComment":commentId ,"class":"text-comment deleteComment", "data-userCurrent":emailUCommentFS})
         nodeDeleteComment= document.createTextNode(" xóa")
          aTagDeleteComment.appendChild(nodeDeleteComment)
          aTagDeleteComment.setAttribute("onclick", "deleteComment(this)")
         
          // đây là div của phần name và content
          
          divOfComment.appendChild(pTagOfcomment)
          divOfComment.appendChild(aTagUpdateComment)
          divOfComment.appendChild(aTagDeleteComment)
          // đây là div tổng của toàn bộ phần comment 
          divComment.appendChild(divOfComment)


          parentDiv.appendChild(divComment)

   
          /*var UpdateDelete = document.getElementsByClassName("UpdateDelete")
    var emailUCommentId= document.getElementsByClassName("emailUCommentId")
   //console.log(UpdateDelete.length,emailUCommentId.length);
    for(var i =UpdateDelete.length-1;i>=0;i--){
 
     
      var emailCurrentUser = document.getElementById("hiddenEmailOfPost").value
     
        if(emailUCommentId[i].value===emailCurrentUser){
          console.log(emailUCommentId,emailCurrentUser);
          console.log("da vao day");
        var UpdateLink = document.createElement("a")
        setAttributes(UpdateLink,{"class":"text-comment"})
        var nodeUpdateLink = document.createTextNode("chỉnh sửa")
        UpdateLink.appendChild(nodeUpdateLink)
        var deleteLink = document.createElement("a")
        setAttributes(deleteLink,{"class":"text-comment"})
        var nodeDeleteLink = document.createTextNode("xóa")
        deleteLink.appendChild(nodeDeleteLink)
  
        //
        
       
      
      UpdateDelete[i].appendChild(UpdateLink)
      UpdateDelete[i].appendChild(deleteLink)
    
      }
      break
      
    }*/
        }
        
      })

      }
    }

   
  //}
}

// xóa comment bài viết
//$(".deleteComment").click(e=>{
  function deleteComment(event){
 /*var btn = e.target
  var id= btn.dataset.id
  var idComment = btn.dataset.idcomment
  var userCurrentInComment= btn.dataset.usercurrent*/
  var id = event.getAttribute("data-id")
  var idComment = event.getAttribute("data-idComment")
  var userCurrentInComment= event.getAttribute("data-userCurrent")
  console.log("data lays dduwocj sau khi bam xoa",id, idComment, userCurrentInComment);
  $.ajax({
    url:"http://localhost:3000/deleteComment",
    type:"POST",
    dataType:"JSON",
    data:{
      id:id,
      idComment:idComment,
      userCurrentInComment: userCurrentInComment
    }
  })
  .done(ketqua=>{
    //console.log(ketqua);

    if(ketqua.code===0){
      console.log();
      document.getElementById(ketqua.data.id).remove()
    }
    else if(ketqua.code===1){
      alert(ketqua.message)
    }
  })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/loginGG');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    if(xhr.responseText=="success"){
        signOut();
        location.assign('/')
    }
    else 
    { 
        signOut();
        console.log("da vao day");
        location.assign('/login')
        
    }

    };
    xhr.send(JSON.stringify({token:id_token}));
}

function signOut() {
var auth2 = gapi.auth2.getAuthInstance();
auth2.signOut().then(function () {
console.log('User signed out.');
});
}


$(document).ready(function(){
  var start=0
  window.addEventListener('scroll',()=>{
    //console.log("you scrool tyto the end pge");
        // fetch api to get scroll
       
    console.log("start bên trên", start);
    
     
        if($(window).scrollTop() + $(window).height() >= $('#listCard').height() ){
          console.log($(window).scrollTop() + $(window).height());
          console.log($('#listCard').height() );
          start = start +1
          console.log("start sau khi cộng",start);
          console.log(window.location);
          var hiddenpicture = document.getElementById("hiddenpicture").value
          var data= {
            start:start, 
            hiddenpicture: hiddenpicture,
            pathname:window.location.pathname
          }
          fetch('http://localhost:3000/loadWindowScroll',{
            method: "POST",
            headers:{
              'content-type':'application/json'
            },
            body:JSON.stringify(data)
          })
          .then(res=>res.json())
          .then(json=>{
           
              if(json.code===0){
             
                console.log(json);
                for(var i =0;i<json.data.length;i++){
                  console.log(`${json.data[i].email}`);
                  console.log("da vao i ");
                       var htmlLoad=$(
                         `<div class="card" >
                          <div class="card-body h-100">
                           <div class="media">
                           <input type = "hidden" id="idNews" value="${json.data[i._id]}">
                           
                               <img src="${json.data[i].imageUser}" width="56" height="56" class="rounded-circle mr-3" alt="Ashley Briggs">
                               <div class="media-body" >
                               <div id="addComment-${json.data[i]._id}">
                               
                                   <p class="mb-2"><strong><a href="profile/${json.data[i].email}">${json.data[i].name}</a></strong></p>
                                   <p>${json.data[i].message}</p>
                                     <!--hình ảnh được upload-->
                                   <div class="row no-gutters mt-1">
                               
                                       <div class="col-6 " id="img-${json.data[i]._id}">
                                
    
                                       </div>
                                 
                                   </div>
           
                                   <small class="text-muted">${json.data[i].updatedAt}</small><br><!--time real dòng trạng thái-->
                                   <!--nút like-->
                                   <a href="#" class="btn btn-sm btn-danger mt-1"><i class="fa fa-heart-o"></i>Like</a>
                                   
                                   <!--nút bình luận-->
                                     <a href="#comment" class="btn btn-sm btn-danger mt-1"><i class="fa fa-comments-o"></i> comment</a>
                                   <!--dòng bình luận-->
                               
                                   <div  id="comment-${json.data[i]._id}">
                                   
                                  
                                   </div>
                       
                               </div>
                                   <hr>
                                   <!--dòng comment line trang tin-->
                                   <div class="row">
                                     <div class="col-auto">
                   
                                       <!-- Avatar -->
                                       <div class="avatar avatar-sm">
                                       
                                         <img src="${json.data2.hiddenpicture}" width="36" height="36" class="rounded-circle mr-2" alt="Stacie Hall">
                                       </div>
                   
                                     </div>
                                     <div class="col ml-n2">
                   
                                       <!-- Input -->
                                        <div class="mt-1" id="parentComment">
                                          <label class="sr-only">Leave a comment...</label>
                                          <textarea data-id ="${json.data[i]._id}" id="comment"class="form-control form-control-flush classComment" data-toggle="autosize" rows="1" placeholder="Leave a comment" ></textarea>
                                        </div>
                                       
                                   
                                     </div>
                                     
                                     <div class="col-auto align-self-end">
                   
                                       <!-- Icons input file phần bình luân -->
                                       <div class="input-container mb-2">
                                          <button class="btn btn-primary float-left" data-id ="${json.data[i]._id}" onclick="commentPost(this)"><i class="fa fa-arrow-right"></i></button>

                                        <!--<a class="text-reset mr-3" href="#!" type="file" data-toggle="tooltip" title="" data-original-title="Add photo">
                                        //    <i class="fa fa-camera"></i>
                                        //  </a>
                                        //  <a class="text-reset mr-3" href="#!" data-toggle="tooltip" title="" data-original-title="Attach file">
                                        //    <i class="fa fa-paperclip"></i>
                                        //  </a>-->
                                         
                                       </div>
                   
                                     </div>
                               
                                   </div>
                                   <hr>

                             
                           </div>
                         </div>
                       </div>`)
                       $(".listCard").append(htmlLoad)   

                       for(var j =0;j<json.data[i].image.length;j++){
                        console.log('i,j',i,j);
                        console.log(`${json.data[i].image[j]}`);
                         ChildeJ=$(`<img src="${json.data[i].image[j]}" class="img-fluid pr-1" alt="Unsplash" >`)
                         $(`#img-${json.data[i]._id}`).append(ChildeJ) 
                         
                       }
                      
                       
                       for(var z =0;z<json.data[i].comment.length;z++){
                         console.log(`${json.data[i].comment[z].imageUserComment}`);
                         ChildZ=$(`  
                         <div class="media mt-3" id="${json.data[i].comment[z]._id}">
                                        
                            <a class="pr-2" href="#">
                            <img src="${json.data[i].comment[z].imageUserComment}" width="36" height="36" class="rounded-circle mr-2" alt="Stacie Hall">
                            </a>
                            
          
                            <div class="media-body UpdateDelete" ><!--id ở đây dùng để xóa comment ko cần load lại trang -->
                                <p class="text-muted textComment" >
                                    <strong>${json.data[i].comment[z].nameUserComment}</strong>:${json.data[i].comment[z].content}
                                    <input type="hidden" value="${json.data[i].comment[z].emailUComment}" class="emailUCommentId">
                                </p>
                                <a href="#comment" data-index="${i}" data-id="${json.data[i].comment[z]._id}"data-comment="${json.data[i].comment[z].content}" data-userCurrent="${json.data[i].comment[z].emailUComment}" class="text-comment updateComment">chỉnh sửa</a>
                                <a onclick = "deleteComment(this)" data-id="${json.data[i]._id}"data-idComment="${json.data[i].comment[z]._id}" class="text-comment deleteComment" data-userCurrent="${json.data[i].comment[z].emailUComment}">xóa</a>
                            </div>
                        </div>
                         `)
                         $(`#comment-${json.data[i]._id}`).append(ChildZ)
                       }
                    
                      }
              
                  }
    
           
           
          })
   
    }
    
    
  
  })

  // js chạy select muti trong sign up
  $('#showCheckboxes').click(()=>{
    var expanded = false;

    
        var checkboxes = document.getElementById("checkboxes");
        if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
        } else {
            checkboxes.style.display = "none";
            expanded = false;
        }
    
  })


  /* lấy data checkbox trong signup*/
  $("#btnSignUp").click(()=>{
 
    $('input:checkbox.faculty').each(function () {
      var sThisVal = (this.checked ? $(this).val() : "");
      //console.log(sThisVal);
      listFaculty=[]
      if(sThisVal!==''){
        console.log(sThisVal);
        listFaculty.push(sThisVal)
      }
 });
  
  })
  
   
// thêm bài viết mới
    $("#btnPosted").click((e)=>{
        
        e.preventDefault();
        
        var nameUser =document.getElementById("recipient-name").value
        // đây là ảnh đại diện của người dùng đang đăng bài
        var hiddenPicture = document.getElementById("hiddenPicture").value
        // dòng 119 index.ejs
        var messageText= document.getElementById("message-text").value
        var hiddenEmailOfPost= document.getElementById("hiddenEmailOfPost").value
        var videoUpload= document.getElementById("videoUpload").value
        var inputImage = document.getElementById("image_uploads") 
        
        // ảnh người dùng đăng lên
        var file = inputImage.files;
        var formData = new FormData();
        formData.append("nameUser",nameUser)
        formData.append("hiddenPicture",hiddenPicture)
        formData.append("messageText",messageText)
        formData.append("hiddenEmailOfPost",hiddenEmailOfPost)
        formData.append("videoUpload",videoUpload)
        //formData.append("file",$("#image_uploads")[0].files[0]) single upload
        for (var i =0;i<=file.length;i++){
          formData.append("file",file[i])
        }
        for (var value of formData.values()) {
            console.log("value",value);
        }

        $('#myModal').hide();
        $('.modal-backdrop').hide();
        $.ajax({
            url: 'http://localhost:3000/insertPost/',
            type: 'POST',
            dataType: 'JSON',
            enctype:"multipart/form-data",
            contentType: false,
            processData: false,
            data: formData
        }).done(function(ketqua) {
          var post =[]
           // console.log("ketqua",ketqua.data);
            if(ketqua.code===0){
                console.log(" da vao day ");
                console.log(ketqua.data.videoUpload);
                var parentOfCard= document.getElementById("parentOfCard")
                var card = document.createElement('div')
                setAttributes(card,{"class":"card"})
                var cardBody= document.createElement("div")
                setAttributes(cardBody,{"class":"card-body h-100"})
                var parentMedia=document.createElement("div")
                setAttributes(parentMedia,{"class":"media"})
                var parentMediaBody= document.createElement("div")
                setAttributes(parentMediaBody,{"class":"media-body"})
               // var parentMedia = document.getElementById("parentMedia")
                //var parentMediaBody= document.getElementById("parentMediaBody")
                var imageUser = document.createElement("img")
                //set ảnh đại diện
                setAttributes(imageUser,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-3","width":"56", "height":"56"})
                parentMedia.appendChild(imageUser)

                // thiết lập bên trong của thẻ media-body
                //thời gian tạo bài viết
                // tên người đăng mới
                var ptag= document.createElement("p")
                setAttributes(ptag,{"class":"mb-2", "id":"parentOfStrong"})
            
                var strongTag = document.createElement("strong")
                var node = document.createTextNode(ketqua.data.name);
              
                strongTag.appendChild(node)
                ptag.appendChild(strongTag)
                parentMediaBody.appendChild(ptag)
                // mess mới đăng
                var p2 = document.createElement("p")
                var nodeMess = document.createTextNode(ketqua.data.message);
                p2.appendChild(nodeMess)
                parentMediaBody.appendChild(p2)
                
                // hình ảnh sau khi đăng 127
                imageRecieveFromServer = JSON.parse(ketqua.data.image)
                console.log("imageRecieveFromServer",imageRecieveFromServer);
                var divTagsubParentImage =document.createElement("div")
                setAttributes(divTagsubParentImage,{"class":"row no-gutters mt-1"})
                for(var i=0;i<imageRecieveFromServer.length;i++){
                    var divTagChild= document.createElement("div")
                    setAttributes(divTagChild,{"class":"col-6"})
                    var imageUpload= document.createElement("img")
                    setAttributes(imageUpload,{"src":imageRecieveFromServer[i],"class":"img-fluid pr-1"})
                    divTagChild.appendChild(imageUpload)
                    divTagsubParentImage.appendChild(divTagChild)
                    parentMediaBody.appendChild(divTagsubParentImage)
                    }
                  var divOfvideo = document.createElement("div")
                  setAttributes(divOfvideo,{"class":"col-6"})

                  console.log(ketqua.data.videoUpload);
                  if(ketqua.data.videoUpload !=='embed/'){
                  
                  var iframe= document.createElement("iframe")
                  setAttributes(iframe,{"width":"400", "height":"300","src":ketqua.data.videoUpload})
                  
                  divOfvideo.appendChild(iframe)
                  }
                  divTagsubParentImage.appendChild(divOfvideo)
                  parentMediaBody.appendChild(divTagsubParentImage)
                //thời gian tạo bài đăng
                var smallTag = document.createElement("small")
                setAttributes(smallTag,{"class":"text-muted"})
                var nodeSmallTimeCreate = document.createTextNode("now")
                smallTag.appendChild(nodeSmallTimeCreate)
                parentMediaBody.appendChild(smallTag)

                var br = document.createElement("br")
                parentMediaBody.appendChild(br)
                //nút like 
                var aTag = document.createElement("a")
                var nodeATag = document.createTextNode("Like")
                setAttributes(aTag,{"href":"#","class":"btn btn-sm btn-danger mt-1"})
                var iTagIconLike = document.createElement("i")
                setAttributes(iTagIconLike,{"class":"fa fa-heart-o"})
            
         
                aTag.appendChild(iTagIconLike)
                aTag.appendChild(nodeATag)
                parentMediaBody.appendChild(aTag)
                
                // khoảng cách 
          
          
        
                // nút comment
                var aTagCommentButton = document.createElement("a")
                var aTagNodeCommentButton = document.createTextNode("comment")
                setAttributes(aTagCommentButton,{"href":"#comment", "class":"btn btn-sm btn-danger mt-1"})
                var iTagIconComment= document.createElement("i")
                setAttributes(iTagIconComment,{ "class":"fa fa-comments-o"})
                aTagCommentButton.appendChild(iTagIconComment)
                aTagCommentButton.appendChild(aTagNodeCommentButton)
                parentMediaBody.appendChild(aTagCommentButton)
                
                //dòng bình luận
                /*var mediaComment= document.getElementById("mediaComment")
                var aTagComment = document.createElement("a")
                setAttributes(aTagComment,{"class":"pr-2", "href":"#"})
                var imageUserInComment= document.createElement("img")
                setAttributes(imageUserInComment,{"src":"" width="36" height="36" class="rounded-circle mr-2" alt="Stacie Hall"})
                
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"media-body"})*/

                // khung binh luận
                var hr = document.createElement("hr")
                parentMediaBody.appendChild(hr)
                
                //div nay dòng 164
                //div nayf div tổng chir đưng sau parentMediaBody
                var divTagParent= document.createElement("div")
                setAttributes(divTagParent,{"class":"row"})
                var divTagsubParent= document.createElement("div")
                setAttributes(divTagsubParent,{"class":"col-auto"})

                //div dòng 168
                var divTag= document.createElement("div")
                setAttributes(divTag,{"class":"avatar avatar-sm"})
                var imageUserInComment = document.createElement("img")
                //set ảnh đại diện  trong comment
                setAttributes(imageUserInComment,{"src":ketqua.data.imageUser,"class":"rounded-circle mr-2","width":"36", "height":"36"})
                divTag.appendChild(imageUserInComment)
                divTagsubParent.appendChild(divTag)
                divTagParent.appendChild(divTagsubParent)
                parentMediaBody.appendChild(divTagParent)

                // set khung input nhập comment
                //div dòng 173
                var divTagsubParentCommentInput= document.createElement("div")
                setAttributes(divTagsubParentCommentInput,{"class":"col ml-n2"})
                var formInputComment= document.createElement("form")
                setAttributes(formInputComment,{"class":"mt-1"})
                var label= document.createElement("label")
                setAttributes(label,{"class":"sr-only"})
                var nodeTextLabel = document.createTextNode("Leave a commnent")
                var textareaCommentInput= document.createElement("textarea")
                setAttributes(textareaCommentInput,{"class":"form-control form-control-flush", "data-toggle":"autosize", "rows":"1", "placeholder":"Leave a comment","id":"styleInputComment"})
                
                label.appendChild(nodeTextLabel)
                formInputComment.appendChild(label)
                formInputComment.appendChild(textareaCommentInput)
                divTagsubParentCommentInput.appendChild(formInputComment)
                divTagParent.appendChild(divTagsubParentCommentInput)
                parentMediaBody.appendChild(divTagParent)

                //div dòng 184
                var divTagsubParentIconComment= document.createElement("div")
                setAttributes(divTagsubParentIconComment,{"class":"col-auto align-self-end"})
                var divtagicon= document.createElement("div")
                setAttributes(divtagicon,{"class":"input-container mb-2"})
                // icon mays anhr
                var aTagIconCamera = document.createElement("a")
                setAttributes(aTagIconCamera,{"class":"text-reset mr-3", "href":"#!", "type":"file", "data-toggle":"tooltip" ,"title":"", "data-original-title":"Add photo"})
                var iTagIconCamera= document.createElement("i")
                setAttributes(iTagIconCamera,{"class":"fa fa-camera"})
                
                aTagIconCamera.appendChild(iTagIconCamera)
                // icon kẹp giaays
                var aTagIconPaperclip = document.createElement("a")
                setAttributes(aTagIconPaperclip,{"class":"text-reset mr-3", "href":"#!",  "data-toggle":"tooltip" ,"title":"", "data-original-title":"Attach file"})
                var iTagIconPaperclip= document.createElement("i")
                setAttributes(iTagIconPaperclip,{"class":"fa fa-paperclip"})
                aTagIconPaperclip.appendChild(iTagIconPaperclip)
                
                divtagicon.appendChild(aTagIconCamera)
                divtagicon.appendChild(aTagIconPaperclip)
                divTagsubParentIconComment.appendChild(divtagicon)
                divTagParent.appendChild(divTagsubParentIconComment)
                parentMediaBody.appendChild(divTagParent)


                parentMedia.appendChild(parentMediaBody)
                cardBody.appendChild(parentMedia)
                card.appendChild(cardBody)
                parentOfCard.appendChild(card)
                  post.push(parentOfCard)
                  console.log(parentOfCard);
            }
          
        });
        
    });
    // xóa bài viết
    $(".btnDelete").click(e=>{
      e.preventDefault();
      $("#confirmDelete").modal("show")
      var btn = e.target
      var id=btn.dataset.id
      $("#modalBtnDelete").attr('data-id',id)
      //console.log(id);

    
    })
    $("#modalBtnDelete").click(e=>{
      $("#confirmDelete").modal("hide")
      
      var btn = e.target
      var id=btn.dataset.id
     // console.log(id);
    $.ajax({
      url: 'http://localhost:3000/deletePost',
      type: 'POST',
      data: {
        id:JSON.stringify(id)
      }
     }).done(function(ketqua) {
          if(ketqua.code===0){
            console.log(ketqua.data.id);
            document.getElementById(ketqua.data.id).remove()
          }
      })
    })

$('.btnUpdate').click(e=>{
  var btn = e.target
  console.log(e);
  var id = btn.dataset.id
  var name= btn.dataset.name
  var imageUser = btn.dataset.imageuser// chỗ này nếu truyền vào imageUser thì trong targer cũng thành imageuser
  var message = btn.dataset.message
  
  $("#recipient-name").val(name)
  $("#message-text").html(message)
  $("#btnChange").attr("data-id", id)
  $("#btnChange").attr("data-imageuser",imageUser )
})

// thay đổi bài biết
$("#btnChange").click(e=>{
  var btn = e.target
  var id = btn.dataset.id
  //var imageUser = btn.dataset.imageuser
  //var name=document.getElementById("recipient-name").value
  var message=document.getElementById("message-text").value
  //console.log( message, id);
  var inputImage = document.getElementById("image_uploads")    
        // ảnh người dùng update lên
  var file = inputImage.files;
  var formData = new FormData();
  formData.append("message",message)
  formData.append("id",id)
  for (var i =0;i<=file.length;i++){
    formData.append("file",file[i])
  }
  for (var value of formData.values()) {
      console.log("value",value);
  }

  $('#myModal').hide();
  $('.modal-backdrop').hide();
  $.ajax({
    url: 'http://localhost:3000/updatePost',
    type: 'POST',
    dataType: 'JSON',
    enctype:"multipart/form-data",
    contentType: false,
    processData: false,
    data: formData
  
}).done(ketqua=>{
  if(ketqua.code===0){
    updatedMessage = ketqua.data.message
    updatedImage= ketqua.data.image
    id= ketqua.data.id
    //console.log(id,updatedMessage, updatedImage);
    document.getElementsByClassName(id)[1].remove()

    // vì class có thể lấy nhiều nên sẽ tạo thành mảng và lấy cái đầu tiên vì trong mảng chỉ có 1 phần tử giống id truyền vào
    var divParentOfcontentUpdate= document.getElementsByClassName(id)[0]
    //console.log("divParentOfcontentUpdate",divParentOfcontentUpdate);
      // mess mới update
 
    var divId = document.createElement("div")// div này dùng để remove() nếu cập nhật lại lần nữa
    setAttributes(divId,{"id":id})
    var p2 = document.createElement("p")
    var nodeMess = document.createTextNode(updatedMessage);
    p2.appendChild(nodeMess)
    divId.appendChild(p2)
    divParentOfcontentUpdate.appendChild(divId)

    //hình ảnh sau khi update
   
    //console.log("imageRecieveFromServer",updatedImage);
    var divTagsubParentImage =document.createElement("div")
    setAttributes(divTagsubParentImage,{"class":"row no-gutters mt-1"})
    for(var i=0;i<updatedImage.length;i++){
        var divTagChild= document.createElement("div")
        setAttributes(divTagChild,{"class":"col-6"})
        var imageUpload= document.createElement("img")
        setAttributes(imageUpload,{"src":updatedImage[i],"class":"img-fluid pr-1"})
        divTagChild.appendChild(imageUpload)
        divTagsubParentImage.appendChild(divTagChild)
        divId.appendChild(divTagsubParentImage)
    
        }
            // thời gian cập nhật 
        var smallTag = document.createElement("small")
        setAttributes(smallTag,{"class":"text-muted"})
        var nodeSmallTimeCreate = document.createTextNode("now")
        smallTag.appendChild(nodeSmallTimeCreate)
        divId.appendChild(smallTag)
        var br = document.createElement("br")
        divId.appendChild(br)
  }
    

})
})



    $(function () {
        'use strict'
  
        $('[data-toggle="offcanvas"]').on('click', function () {
          $('.offcanvas-collapse').toggleClass('open')
        })
      })


    $('#my-button').click(function(){
        $('#my-file').click();
    });
    $('#my-button2').click(function(){
        $('#my-file2').click();
    });


    $(".btnDeleteNoti").click(e=>{
      console.log("vao delete");
      var btn = e.target
      var id = btn.dataset.id
      console.log(id);
      fetch('http://localhost:3000/deleteNoti',{
        method:"post",
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify({id:id})
      })
      .then(res=>res.json())
      .then(json=>{
        console.log(json);
        if(json.code===0){
          id= json.data.id
          document.getElementById(id).remove()
       
          // alert thông báo xóa thành công 
          $("#response").animate({height: '+=72px' }, 300);
      
      $('<div class="alert alert-success">' +
        '<button type="button" class="close" data-dismiss="alert">' +
        '&times;</button>"xóa thông báo thành công"</div>').hide().appendTo('#response').fadeIn(1000);
        
        $(".alert").delay(2000).fadeOut("normal",function(){
          $(this).remove();
          });
          $("#response").delay(2000).animate({
            height: '-=72px'
        }, 300);
        }

      })

    })


 
   
    // upload thông bao
    $(".btnUpdateNoti").click(e=>{
      var btn = e.target
      var id= btn.dataset.id
      var titleNoti = btn.dataset.title
      var contentNoti= btn.dataset.content

      $("#myModalUpdate").show()
      $(".close").click(()=>{
        $("#myModalUpdate").hide()
      })
      var idUpdateNoti= document.getElementById("idUpdateNoti")
      idUpdateNoti.value=id
      var title = document.getElementById("title-text-update")
      var content= document.getElementById("message-text-update")
      title.value=titleNoti
      content.value=contentNoti

    })

    // thiết lập hide show thông báo alert khi khoa đăng bài

    //$("#snackbar").fadeTo(10,0)//ẩn thông báo dưới góc màn hinh

    // thiết lập file edit account ( phân quyền đổi tài khoản hoặc mật khẩu )
    if( $("#emailOfChaneProfile").val().includes("@student.tdtu.edu.vn")){
      var addNewClass = document.getElementById("linlkChangePass")
      addNewClass.classList.add("disabled")
    }
    else {
       var addNewClass = document.getElementById("linkOfChangeProfile")
       var addNewClassPass = document.getElementById("linlkChangePass")
       addNewClass.classList.add("disabled")
       addNewClass.classList.remove("active")
       addNewClassPass.classList.add("active")
    }
   


    /*$('#my-button').click(function(){
        $('#my-file').click();
    });*/

    // comment bài viêt
//$(".classComment").keyup(event=>{
 




 /* $(".updateComment").click(e=>{
    var btn = e.target
    // console.log(e);
    var idComment = btn.dataset.id
    var indexInDB = btn.dataset.index
    var userCurrentInComment = btn.dataset.usercurrent
    var content= btn.dataset.comment
    console.log(indexInDB);
    var classComment= document.getElementsByClassName("classComment")
    // vì khi in từ trong db ra in ngược nên class của tin đầu tiên suất hiện sẽ nằm ở vị trí cuối cùng trong db
    // trong page thì bắt đầu từ 0 nên phải trừ đi 1 nữa mới đủ 
    indexInpage= classComment.length-1-indexInDB
    
    console.log(classComment.length);
    classComment[indexInpage].value=content*/
    // lam den găn data vao o bình luận

   /* console.log(idComment,userCurrentInComment,content);
    data={
      idComment:idComment,
      userCurrentInComment:userCurrentInComment,
      content:content
    }
    $.ajax({
      url: 'http://localhost:3000/updateComment',
      type: 'POST',
      dataType: 'JSON',
      data:data
    
      }).done(ketqua=>{
    })*/
    
 // })
  
})
