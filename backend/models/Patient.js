const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    glucose: {
      type: Number,
      required: true,
    },

    bloodPressure: {
      type: Number,
      required: true,
    },

    bmi: {
      type: Number,
      required: true,
    },

    prediction: {
      type: String,
      default: "Low Risk",
    },
    suggestion: {
    type: String,
    default: ""
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Patient", patientSchema);