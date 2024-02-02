const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

app.use(cors());

// Configure multer with a more specific storage location and filename handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    // Send back only the filename for security reasons
    res.json({ fileName: req.file.filename }); // Use filename instead of path
});

app.get('/download/:fileName', (req, res) => {
    const { fileName } = req.params;
    const fileLocation = path.join(__dirname, 'uploads', fileName);
    const downloadName = 'data.xlsx'; // New file name

    fs.access(fileLocation, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File does not exist:', fileLocation);
            return res.status(404).send('File not found');
        }
        res.download(fileLocation, downloadName);
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
