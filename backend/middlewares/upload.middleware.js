const multer = require('multer');

// Fayllarni diskka emas, RAM xotirada ushlab turamiz
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Faqat rasm fayllari yuklanishi mumkin!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Maksimal 5MB
});

module.exports = upload;