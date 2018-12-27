const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');

const app = express();

const environment = 'production'; // this will be an env var
let assetsFolder;
if (environment === 'production') {
  assetsFolder = 'dist';
} else {
  assetsFolder = 'public';
}

const createWaveform = (fileName, filePath) => new Promise(resolve => {
  const fileJSONPath = path.join(__dirname, '..', '..', assetsFolder, 'audio-files', `${fileName.split('.')[0]}.json`);
  const child = spawn('audiowaveform', ['-i', filePath, '-o', fileJSONPath, '-b', '8', '-z', '128']);
  child.on('exit', () => resolve(fileName.split('.')[0]));
});

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, next) {
      next(null, path.join(__dirname, '..', '..', assetsFolder, 'audio-files'));
    },
    filename: function (req, file, next) {
      next(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: function (req, file, next) {
    if (file.mimetype.split('/')[1] !== 'wav') {
      return next(new Error('Please upload a wav file'));
    }
    next(null, true);
  }
});

app.use(express.static('dist'));
app.use((error, req, res, next) => {
  res.status(400).json({ error: error.message }).send();
});

app.post('/api/file', upload.single('file'), async (req, res, next) => {
  const fileName = await createWaveform(req.file.filename, req.file.path);
  res.status(201).json({ fileName }).send();
  return next();
});

app.listen(8080, () => console.log('Listening on port 8080!'));
