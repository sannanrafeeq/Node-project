
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./db");

async function resetPassword() {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(
      "Shahrukh786",
      10
    );

    const user = await User.findOneAndUpdate(
      { email: "shahrukh789@gmail.com" },
      { password: hashedPassword },
      { new: true }
    );

    if (user) {
      console.log("Password reset successful!");
    } else {
      console.log("Shahrukh account nahi mila.");
    }
  } catch (error) {
    console.error("Reset error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

resetPassword();
