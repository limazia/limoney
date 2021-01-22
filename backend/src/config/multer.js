const multer = require("multer");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");

const imageFolder = path.resolve(__dirname, '..', '..', 'images/');

const storage = multer.diskStorage({
  directory: imageFolder,

  destination: async function (request, file, callback) {
    callback(null, imageFolder);
  },

  filename(request, file, callback) {
    const hash = cryptoRandomString({ length: 45 });
    const filename = `${hash}.jpg`;

    callback(null, filename);
  },
});

const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  storage,
  fileFilter: function (request, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
      request.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;