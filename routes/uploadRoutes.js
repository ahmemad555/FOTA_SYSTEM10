const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
// const { upload } = require('../utils/fileUpload');
const uploadFileToGoogleDrive = require('../utils/googleDrive');
const uploadController = require('../controllers/uploadController');
// 'application/octet-stream', 'application/hex
// const uploadImage = upload(['application/octet-stream', 'application/hex']);
// router.use(auth); // حماية جميع routes الكورسات

const railWayUrl='https://fotasystem10-production.up.railway.app';
// upload firmware
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            req.fileDestination='public/uploads';
            cb(null, 'public/uploads');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/octet-stream' || file.mimetype === 'application/hex' || file.mimetype === 'text/plain' || file.mimetype === 'text/html') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// routes للمدير والمحاضر
router.post('/fw', 
    auth,
    // checkRole('manager', ''), 
    upload.single('fw'), // middleware لرفع الصورة
    // uploadFileToGoogleDrive,

    (req,res,next)=>{
        console.log(req.fileDestination);
        const fileUrl=`${railWayUrl}/uploads/${req.file.filename}`;
        req.fileUrl=fileUrl;
        req.fileId=req.file.filename;
       // res.send('file uploaded successfully');
       next();
    },
    uploadController.upload
);

// router.put('/:id', 
//     auth,
//     checkRole('manager'), 
//     uploadImage.single('image'), // middleware لرفع الصورة
// );

// routes للمدير فقط
// router.delete('/:id', 
//     auth,
//     checkRole('manager'), 
// );

// routes عامة (مع التحقق من تسجيل الدخول)
router.get('/', uploadController.getFiles);
// router.get('/:id', courseController.getCourse

// );


module.exports = router; 