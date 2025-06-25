const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/jwt');
const uploadController = require('../controllers/uploadController');

const railWayUrl = 'https://fotasystem10-production.up.railway.app';

const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            req.fileDestination = 'uploads';  // خليها uploads مش public/uploads
            cb(null, 'uploads');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/octet-stream' || file.mimetype === 'application/hex') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only .bin or .hex allowed!'), false);
        }
    }
});

// POST /api/upload/fw
router.post('/fw', 
    auth,
    upload.single('fw'), 
    (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded or invalid file type.'
            });
        }

        const fileUrl = `${railWayUrl}/uploads/${req.file.filename}`;
        req.fileUrl = fileUrl;
        req.fileId = req.file.filename;

        next();
    },
    uploadController.upload
);

// GET /api/upload
router.get('/', uploadController.getFiles);

module.exports = router;
