/** This code implemented from Transversy Media */

const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

/** Init express */
const app = express();

/** Using EJS Template Engine */
app.set('view engine', 'ejs');

/** Set storage engine with Multer */
const storage = multer.diskStorage({
  destination: './public/img/',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname.toLowerCase() +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    );
  }
});

/** Init Upload */
const upload = multer({
  storage: storage,
  limits: { filesize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('imgFile');

/** Check File Type */
checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|gif}/; // Check file extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
  const mimetype = filetypes.test(file.mimetype); // Check mimetype
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
};

/** Using public foler */
app.use(express.static('./public'));

/** Rendering default root */
app.get('/', (req, res) => res.render('index'));

/** Save uploaded file */
app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render('index', { msg: err });
    } else {
      if (req.file == 'undefined') {
        res.render('index', { msg: 'Error: No File Selected' });
      } else {
        res.render('index', {
          msg: 'File Uploaded',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

/** Define port */
const port = 3000;

/** Run server */
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
