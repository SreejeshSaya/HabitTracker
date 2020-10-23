const admin = require("firebase-admin");
const serviceAccount = require("../senpai.json");
const fs = require("fs")
const path = require("path")

admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   storageBucket: "gs://habit-tracker-7ff5c.appspot.com",
});

const bucket = admin.storage().bucket();

async function getUrl(filename) {
   const file = bucket.file(filename);
   const signedUrls = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
   });
   console.log(signedUrls);
   return signedUrls[0];
}

async function uploadImage(file) {
   await bucket.upload(file.path);
   const url = getUrl(file.filename);
   return url;
}

async function deleteImage(filename){
   await bucket.file(filename).delete()
}

exports.uploadHandler = async (req, res, next) => {
   const file = req.file;
   if (!file) {
      return res.status(503).send("Image not found");
   }
   if (req.session.tempImage){
      await deleteImage(req.session.tempImage)
   }
   const url = await uploadImage(file);
   req.session.tempImage = file.filename
   await fs.promises.unlink(path.join('temp-image',file.filename))
   res.send({
      url,
   });
};
