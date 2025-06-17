
const express = require('express');
const router = express.Router();

const { upload } = require('../utils/fileUpload');
const uploadFileToGoogleDrive = require('../utils/googleDrive');

const controller = require('../controllers/userController');
router.post('/view', controller.viewUser);
router.get('/views', controller.getViews);

const uploadVideo = upload(['video/mp4', 'video/mov', 'video/avi']);
router.post('/uploadVideo', uploadVideo.single('video'), controller.uploadVideoToYoutube);



module.exports = router;
