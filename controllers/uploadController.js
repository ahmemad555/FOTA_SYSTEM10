
const asyncHandler = require('../utils/asyncHandler');
const File = require('../models/files');

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


        res.status(200).json({
            success: true,
            file
        });




});




const getFiles= asyncHandler(async (req, res) => {
    const files = await File.find({});
    // get the last file 
    const lastFile = files[files.length - 1];

    res.status(200).json({
        success: true,
        fileUrl:lastFile.fileUrl,
    });
});



module.exports = {
    upload,
    getFiles
};
