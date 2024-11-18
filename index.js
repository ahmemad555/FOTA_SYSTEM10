const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Initialize app and middleware
const app = express();
// const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary
// cloudinary.config({ 
//     cloud_name:"dlxwpay7b",
//     secure:true,
//     api_key:"957197717412299",
//     api_secret:"Pv53x9A3EkgBa3b_1H7O1Wu_sWc"
// });
let file;
app.use("/",express.static("./public/"))
app.use("/get",express.static("/uploads/file.jpeg"))
// Placeholder for storing file URL
let storedFileUrl = '';
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
            cb(null, "uploads/");
           // console.log("file dest", file);
    },
    filename: (req, file, cb) => {
            const ext = file.mimetype.split("/")[1];

            const filename = `file.${ext}`;
           console.log("filename:", filename);
            req.fileName=filename;
            cb(null, filename);
    },
});const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split("/")[1];
    if (imageType == "jpg"||"jpeg") {
            return cb(null, true);
    } else {
            return cb("I don't have a clue!", false);
    }
};
const upload = multer({
    storage: diskStorage,
    fileFilter,
});

// POST route for receiving and processing the file
app.post('/upload', upload.single('hexacode'), async (req, res) => {
  try {
    // const filePath = path.resolve(req.file.path);

    // Upload the file to Cloudinary
    // const result = await cloudinary.uploader.upload(filePath, {
    //   resource_type: 'raw' // Use raw for non-image files
    // });

    // Store the file URL
    // storedFileUrl = result.secure_url;

    // Delete the file from the local server after upload
    // fs.unlinkSync(filePath);

    // Return ABI (simulated for example purposes)
    fs.writeFile("files.json", `
      {
        "filename":"${req.fileName}"
      }
      
      `, (err) => {
      if (err) console.log(err);
      else {
          console.log("File written successfully\n");
          console.log("The written file has the following contents:");
          console.log(fs.readFileSync("books.txt", "utf8"));
      }
    });
    const abi = { message: 'file  created successfully'};
    res.json(abi);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while processing the file');
  }
});



// GET route for retrieving the file URL
let name;
app.get('/abi', (req, res) => {
  fs.readFile('files.json', 'utf8', function (err, data) {
    // Display the file content
    name=JSON.parse(data).filename;
    console.log(jsData.filename)
});

let file;

fs.readFile(`/uploads/${name}`, 'utf8', function (err, data) {
  // Display the file content
 file=data;
});
res.file("/upload")
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});