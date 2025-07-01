
const asyncHandler = require('../utils/asyncHandler');
const File = require('../models/files');


const railWayUrl='https://fotasystem10-production.up.railway.app';
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


        // res.redirect(fileUrl);

        res.status(201).json({
            success: true,
            fileUrl,
            fileId
        });


});



const getFiles = asyncHandler(async (req, res) => {
    const files = await File.find({});
    // get the last file 
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


module.exports = {
    upload,
    getFiles
};
