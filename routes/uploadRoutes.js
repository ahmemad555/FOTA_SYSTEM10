const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const checkRole = require('../middlewares/checkRole');
const { upload } = require('../utils/fileUpload');
// 'application/octet-stream', 'application/hex
const uploadImage = upload(['application/octet-stream', 'application/hex','image/jpeg', 'image/png', 'image/jpg','image/webp','image/gif']);
// router.use(auth); // حماية جميع routes الكورسات

// routes للمدير والمحاضر
router.post('/fw', 
    // auth,
    // checkRole('manager', ''), 
    uploadImage.single('fw'), // middleware لرفع الصورة
    (req,res,next)=>{
        res.json({
            success:true,
            message:"file uploaded successfully",
            data:req.file
        })
    }
);

router.put('/:id', 
    auth,
    checkRole('manager'), 
    uploadImage.single('image'), // middleware لرفع الصورة
);

// routes للمدير فقط
router.delete('/:id', 
    auth,
    checkRole('manager'), 
);

// routes عامة (مع التحقق من تسجيل الدخول)
router.get('/', (req,res)=>{
    res.json({
        success:true,
        message:"file uploaded successfully",
        data:req.file
    })
});
// router.get('/:id', courseController.getCourse

// );


module.exports = router; 