const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Initialize app and middleware
const app = express();
const upload = multer({ dest: 'uploads/' });

// Configure Cloudinary
cloudinary.config({ 
    cloud_name:"d",
    secure:true,
    api_key:"95",
    api_secret:"Pv"
});

// Placeholder for storing file URL
let storedFileUrl = '';

// POST route for receiving and processing the file
app.post('/upload', upload.single('hexacode'), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw' // Use raw for non-image files
    });

    // Store the file URL
    storedFileUrl = result.secure_url;

    // Delete the file from the local server after upload
    //fs.unlinkSync(filePath);

    // Return ABI (simulated for example purposes)
    const abi = { message: 'ABI created successfully', fileUrl: storedFileUrl };
    res.json(abi);
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('An error occurred while processing the file');
  }
});

// GET route for retrieving the file URL
app.get('/abi', (req, res) => {
  if (storedFileUrl) {
    res.json({ fileUrl: storedFileUrl });
  } else {
    res.status(404).send('No file found');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});