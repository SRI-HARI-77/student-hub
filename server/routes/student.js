const express = require('express');
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  uploadImage
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect);
router.use(authorize('authority'));

router.route('/')
  .get(getStudents)
  .post(upload.single('profileImage'), createStudent);

router.post('/upload-image', upload.single('image'), uploadImage);

router.route('/:id')
  .get(getStudent)
  .put(upload.single('profileImage'), updateStudent)
  .delete(deleteStudent);

module.exports = router;
