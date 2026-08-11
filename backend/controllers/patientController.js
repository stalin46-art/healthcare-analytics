const Patient = require("../models/Patient");
const {
  predictRisk,
  parseBloodPressure,
} = require("../services/aiService");

exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      glucose,
      bloodPressure,
      bmi
    } = req.body;
    if (
      !name ||
      !age ||
      !gender ||
      !glucose ||
      !bloodPressure ||
      !bmi
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const { prediction,suggestion, source } = await predictRisk({
      name,
      age,
      gender,
      glucose,
      bloodPressure,
      bmi,
    });

    const patient = await Patient.create({
      name,
      age,
      gender,
      glucose,
      bloodPressure: parseBloodPressure(bloodPressure),
      bmi,
      prediction,
      suggestion,
    });
    res.status(201).json({ ...patient.toObject(), predictionSource: source });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients =
      await Patient.find()
      .sort({ createdAt: -1 });
    res.json(patients);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patient =
      await Patient.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }
    res.json(patient);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

exports.deletePatient = async (req, res) => {

  try {
    const patient =
      await Patient.findByIdAndDelete(
        req.params.id
      );

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }
    res.json({
      message: "Patient deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};