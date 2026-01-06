const Student = require('../models/Student');
const cloudinary = require('../config/cloudinary');

exports.createStudent = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      courseOrDepartment,
      batchOrYear,
      address
    } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Full name and email are required'
      });
    }

    let profileImageUrl = null;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'student-profiles',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      profileImageUrl = result.secure_url;
    }

    const student = await Student.create({
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      courseOrDepartment,
      batchOrYear,
      address,
      profileImageUrl,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    next(error);
  }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      courseOrDepartment,
      batchOrYear,
      address
    } = req.body;

    let student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    let profileImageUrl = student.profileImageUrl;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'student-profiles',
            resource_type: 'image'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      profileImageUrl = result.secure_url;
    }

    student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
        phone,
        dateOfBirth,
        gender,
        courseOrDepartment,
        batchOrYear,
        address,
        profileImageUrl
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'student-profiles',
          resource_type: 'image'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({
      success: true,
      url: result.secure_url
    });
  } catch (error) {
    next(error);
  }
};
