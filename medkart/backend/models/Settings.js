const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    pharmacyName: { type: String, default: "MedKart" },
    contactEmail: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
