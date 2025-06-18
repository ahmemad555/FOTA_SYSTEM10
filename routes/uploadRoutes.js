const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const { upload } = require('../utils/fileUpload');
const uploadFileToGoogleDrive = require('../utils/googleDrive');
const uploadController = require('../controllers/uploadController');
// 'application/octet-stream', 'application/hex
const uploadImage = upload(['application/octet-stream', 'application/hex']);
// router.use(auth); // حماية جميع routes الكورسات

// routes للمدير والمحاضر
router.post('/fw', 
    auth,
    // checkRole('manager', ''), 
    uploadImage.single('fw'), // middleware لرفع الصورة
    uploadFileToGoogleDrive,

    uploadController.upload
);

router.put('/:id', 
    auth,
    checkRole('manager'), 
    uploadImage.single('image'), // middleware لرفع الصورة
);

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