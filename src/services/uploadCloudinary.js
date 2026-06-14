import cloudinary from '../config/cloudinary.js';

const cloudinaryUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'nov_cohort' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(buffer);
  });
};

export default cloudinaryUpload;
