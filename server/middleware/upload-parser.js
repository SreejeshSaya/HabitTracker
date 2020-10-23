const multer = require("multer");

function getExtension(type){
   if (type=='image/jpeg'){
      return '.jpeg'
   }
   else if (type=='image/png'){
      return '.png'
   }
}

const storage = multer.diskStorage({
   destination: "temp-image/",
   filename: function (req, file, cb) {
      const filename = req.session.userId + Date.now() + file.originalname;
      cb(null, filename);
   },
});

const upload = multer({ storage });

exports.uploadParser = upload.single("file");


