const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(15, (err, name) => {
        const fn = name.toString("hex")+path.extname(file.originalname);
        cb(null, fn)
    })
  }
})

module.exports = multer({storage: storage});