const fs = require("fs");
const path = require("path");
const Trainee = require("../models/Trainee");

const buildImageUrl = (req, filename) => {
  if (!filename) return "";
  const configuredBaseUrl = process.env.BASE_URL?.trim();
  const baseUrl = configuredBaseUrl || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${filename}`;
};

const removeImageIfExists = (filename) => {
  if (!filename) return;

  const imagePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

const formatTrainee = (req, traineeDoc) => {
  const trainee = traineeDoc.toObject ? traineeDoc.toObject() : traineeDoc;
  return {
    ...trainee,
    imageUrl: buildImageUrl(req, trainee.image)
  };
};

exports.createTrainee = async (req, res, next) => {
  try {
    const { name, email, course, age } = req.body;

    if (!name || !email || !course || !age) {
      if (req.file) removeImageIfExists(req.file.filename);
      return res.status(400).json({
        success: false,
        message: "name, email, course, and age are required"
      });
    }

    const existingTrainee = await Trainee.findOne({ email: email.toLowerCase() });
    if (existingTrainee) {
      if (req.file) removeImageIfExists(req.file.filename);
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    const trainee = await Trainee.create({
      name,
      email,
      course,
      age,
      image: req.file ? req.file.filename : ""
    });

    return res.status(201).json({
      success: true,
      message: "Trainee created successfully",
      data: formatTrainee(req, trainee)
    });
  } catch (error) {
    if (req.file) removeImageIfExists(req.file.filename);
    next(error);
  }
};

exports.getAllTrainees = async (req, res, next) => {
  try {
    const trainees = await Trainee.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: trainees.length,
      data: trainees.map((item) => formatTrainee(req, item))
    });
  } catch (error) {
    next(error);
  }
};

exports.getSingleTrainee = async (req, res, next) => {
  try {
    const trainee = await Trainee.findById(req.params.id);

    if (!trainee) {
      return res.status(404).json({
        success: false,
        message: "Trainee not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: formatTrainee(req, trainee)
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTrainee = async (req, res, next) => {
  try {
    const existingTrainee = await Trainee.findById(req.params.id);

    if (!existingTrainee) {
      if (req.file) removeImageIfExists(req.file.filename);
      return res.status(404).json({
        success: false,
        message: "Trainee not found"
      });
    }

    if (req.body.email && req.body.email.toLowerCase() !== existingTrainee.email) {
      const duplicateEmail = await Trainee.findOne({ email: req.body.email.toLowerCase() });
      if (duplicateEmail) {
        if (req.file) removeImageIfExists(req.file.filename);
        return res.status(409).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    const updatedPayload = {
      name: req.body.name ?? existingTrainee.name,
      email: req.body.email ?? existingTrainee.email,
      course: req.body.course ?? existingTrainee.course,
      age: req.body.age ?? existingTrainee.age,
      image: req.file ? req.file.filename : existingTrainee.image
    };

    const updatedTrainee = await Trainee.findByIdAndUpdate(req.params.id, updatedPayload, {
      new: true,
      runValidators: true
    });

    if (req.file && existingTrainee.image) {
      removeImageIfExists(existingTrainee.image);
    }

    return res.status(200).json({
      success: true,
      message: "Trainee updated successfully",
      data: formatTrainee(req, updatedTrainee)
    });
  } catch (error) {
    if (req.file) removeImageIfExists(req.file.filename);
    next(error);
  }
};

exports.deleteTrainee = async (req, res, next) => {
  try {
    const trainee = await Trainee.findById(req.params.id);

    if (!trainee) {
      return res.status(404).json({
        success: false,
        message: "Trainee not found"
      });
    }

    if (trainee.image) {
      removeImageIfExists(trainee.image);
    }

    await Trainee.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Trainee deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
