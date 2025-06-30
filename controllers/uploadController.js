const asyncHandler = require('../utils/asyncHandler');
const File = require('../models/files');
const fs = require('fs');
const path = require('path');

const railWayUrl = 'https://fotasystem10-production.up.railway.app';
const uploadsDir = path.join(__dirname, '../uploads');

const upload = asyncHandler(async (req, res) => {
    const fileId = req.fileId;
    const fileUrl = req.fileUrl;
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
    }
    const file = new File({
        name,
        fileUrl,
        fileId
    });
    await file.save();

    res.status(201).json({
        success: true,
        fileUrl,
        fileId
    });
});

const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find({});
    const lastFile = files[files.length - 1];

    if (lastFile) {
        res.status(200).json({
            success: true,
            fileUrl: lastFile.fileUrl
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'No files found'
        });
    }
});

const getLatestFirmware = (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading upload folder' });
        }

        const binFiles = files.filter(file => file.endsWith('.bin'));

        if (binFiles.length === 0) {
            return res.status(404).json({ success: false, message: 'No firmware files found' });
        }

        const sortedFiles = binFiles.sort((a, b) => {
            const aTime = fs.statSync(path.join(uploadsDir, a)).mtime.getTime();
            const bTime = fs.statSync(path.join(uploadsDir, b)).mtime.getTime();
            return bTime - aTime;
        });

        const latestFile = sortedFiles[0];
        const fileUrl = `${railWayUrl}/uploads/${latestFile}`;

        res.json({
            success: true,
            url: fileUrl
        });
    });
};

module.exports = {
    upload,
    getFiles,
    getLatestFirmware
};
