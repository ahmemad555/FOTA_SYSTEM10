const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { auth } = require('../middlewares/jwt');
const uploadController = require('../controllers/uploadController');

const railWayUrl = 'https://fotasystem10-production.up.railway.app';
const router = express.Router();

// Multer setup for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            req.fileDestination = 'uploads';
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

// ======= OTA Upload Route =======
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

// ======= OTA Firmware Download Route (For ESP32) =======
// GET /api/upload/firmware
router.get('/firmware', (req, res) => {
    const uploadDir = path.join(__dirname, '../uploads');

    // Get the latest uploaded .bin file
    const files = fs.readdirSync(uploadDir).filter(file => file.endsWith('.bin'));

    if (files.length === 0) {
        return res.status(404).send('No firmware file found.');
    }

    // Sort files by creation time (latest first)
    files.sort((a, b) => {
        const aTime = fs.statSync(path.join(uploadDir, a)).mtime;
        const bTime = fs.statSync(path.join(uploadDir, b)).mtime;
        return bTime - aTime;
    });

    const latestFirmware = path.join(uploadDir, files[0]);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(latestFirmware, (err) => {
        if (err) {
            console.error('Error sending firmware:', err);
            res.status(500).send('Error sending firmware file');
        }
    });
});

// ======= Existing Route: Get All Uploaded Files =======
// GET /api/upload
router.get('/', uploadController.getFiles);

module.exports = router;
