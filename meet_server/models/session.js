const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: { type: String, required: true, unique: true },
  participants: [
    {
      userId: { type: String, default: "" },
      name: { type: String, default: "" },
      socketId: { type: String, default: "" },
      photo: { type: String, default: "" },
      micOn: { type: Boolean, default: false },
      videoOn: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now, expires: "1d" },
});

const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;
