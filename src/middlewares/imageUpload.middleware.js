import multer from 'multer';

const fileFilter = (request, file, callback) => {
  const error = new Error('Only JPG/PNG images are allowed');
  error.status = 422;
  // accept only jpg or png images
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true);
  } else {
    /* istanbul ignore next */
    callback(error, false);
  }
};

const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, 'uploads/');
  },
  filename: (request, file, callback) => {
    callback(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
});

export default upload;
