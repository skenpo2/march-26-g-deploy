import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
}); // Limit file size to 3MB

export default upload;
