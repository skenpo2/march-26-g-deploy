import express from 'express';
import upload from '../middlewares/upload.js';
import cloudinaryUpload from '../services/uploadCloudinary.js';
import User from '../models/user.model.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('User route');
});

router.post('/uploads/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('Received file:', req.file.buffer);
    const result = await cloudinaryUpload(req.file.buffer);

    const user = await User.findById(req.params.id);

    user.profileImage = result.secure_url;
    await user.save();

    res.json({
      message: 'File uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
