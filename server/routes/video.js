const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer")
const ffmpeg = require("fluent-ffmpeg");
const { Subscriber } = require('../models/Subscriber');

//스토리지 멀터 컨피그

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
  
   cb(null, 'uploads/videos/')
  
   },
  
  filename: (req, file, cb) => {
  
   cb(null, `${Date.now()}_${file.originalname}`)
  
   }
  
  })

    
  
  
  const fileFilter = (req, file, cb) => {
  
   // mime type 체크하여 원하는 타입만 필터링
  
   if (file.mimetype === 'video/mp4') {
  
   cb(null, true);
  
   } else {
  
   cb({msg:'MP4.JPG 파일만 업로드 가능합니다.'}, false);

   }
  }



const upload = multer({ storage: storage, fileFilter: fileFilter}).single("file")

//=================================
//              Video
//=================================

router.post("/uploadfiles", (req, res) => {
  //비디오를 서버에 저장

  upload(req,res, err => {
    if(err) {
      return res.json({ success : false, err})
    }
    return res.json({ success : true, url : res.req.file.path, fileName : res.req.file.filename})
  })
})




router.post("/uploadVideo", (req, res) => {
  //비디오 정보를 저장한다.

  const video  = new Video(req.body)

  video.save((err, video) => {
    if(err) return res.json({ success :false, err})
    res.status(200).json({success: true})
  })
})

router.get("/getVideos", (req, res) => {
  //비디오를 디비에서 가져와 클라이언트에 보낸다

  Video.find()
    .populate('writer')
    .exec((err, videos) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({success:true, videos})
    })

})

router.post("/getVideoDetail", (req, res) => {
  Video.findOne({"_id" : req.body.videoId})
    .populate('writer')
    .exec((err, videoDetail) => {
      if(err) return res.status(400).send(err)
      return res.status(200).json({success :true, videoDetail})
    })

})

router.post("/getSubscriptionVideos", (req, res) => {
  // 자신의 아이디를 가지고 구독한 사람들을 찾는다.

  Subscriber.find({userFrom: req.body.userFrom})
    .exec((err, subscriberInfo)=> {
    if(err) return res.status(400).send(err);

    let subscribedUser = [];

    subscriberInfo.map((subscriber, i) => {
      subscribedUser.push(subscriber.userTo)
    })
    // 찾은 사람들의 비디오를 가져온다.

    Video.find({ writer : { $in : subscribedUser}})
      .populate('writer')
      .exec((err, videos) => {
        if(err) return res.status(400).send(err)
        res.status(200).json({success :true, videos})
      })
    })
})

router.post('/thumbnail', (req, res) => {
  //썸네일 생성 및 비디오 러닝타임

  let filePath = ""
  let fileDuration = "" 

  //비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.url, function (err, metadata) {
    console.dir(metadata);
    console.log(metadata.format.duration);
    fileDuration = metadata.format.duration
  })

  
  

  //썸네일 생성 
  ffmpeg(req.body.url)
  .on('filenames', function (filenames){
    console.log('Will generate' + filenames.join(', '))
    console.log(filenames)

    filePath = 'uploads/thumbnails/' + filenames[0]
  })
  .on('end', function () {
    console.log('Screenshots taken');
    return res.json({ success: true, url : filePath, fileDuration: fileDuration})
  })
  .on('error', function (err){
    console.error(err);
    return res.json({ success: false, err})
  })
  .screenshot({
    //Will take screenshots at 20%, 40%, 60% and 80% of videos

    count : 1,
    folder: 'uploads/thumbnails',
    size: '320x240',
    filename: '%b.jpg'
  })
})

//=================================
//              Image
//=================================

const storageImage = multer.diskStorage({

  destination: (req, file, cb) => {
  
   cb(null, 'uploads/thumbnails/')
  
   },
  
  filename: (req, file, cb) => {
  
   cb(null, `${Date.now()}_${file.originalname}`)
  
   }
  
  })


  const fileFilterImage = (req, file, cb) => {

    if(file.mimetype === 'image/jpg' ||  file.mimetype === 'image/jpeg' ){
        cb(null,true);

    } else {

        cb({message: 'JPG 파일만 업로드 가능합니다.'}, false)
  }
}
const uploadImage = multer({ storage: storageImage, limits: {fileSize: 4096 * 4096}, fileFilter: fileFilterImage}).single("file")

router.post("/uploadfilesImage", (req, res) => {
  //이미지를 서버에 저장

  uploadImage(req,res, err => {
    if(err) {
      return res.json({ success : false, err})
    }
    return res.json({ success : true, url : res.req.file.path, fileName : res.req.file.filename})
  })
})

module.exports = router;
