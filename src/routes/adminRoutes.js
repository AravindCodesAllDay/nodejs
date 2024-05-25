const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const SubAdmin = require("../models/subadmin");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { mail, pswd } = req.body;
    if (!mail || !pswd) {
      return res
        .status(400)
        .json({ message: "Email and password must be provided." });
    }

    const admin = await Admin.findOne({ mail });
    if (!admin) {
      return res.status(400).json({ message: "Email not found." });
    }

    const passwordMatch = await bcrypt.compare(pswd, admin.pswd);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Password doesn't match." });
    }

    const token = jwt.sign({ username: "admin" }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/subadminlogin", async (req, res) => {
  try {
    const { mail, pswd } = req.body;
    if (!mail || !pswd) {
      return res
        .status(400)
        .json({ message: "Email and password must be provided." });
    }

    const subAdmin = await SubAdmin.findOne({ mail });
    if (!subAdmin) {
      return res.status(400).json({ message: "Email not found." });
    }

    const passwordMatch = await bcrypt.compare(pswd, subAdmin.pswd);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Password doesn't match." });
    }

    const token = jwt.sign({ username: "subadmin" }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/subadmins", async (req, res) => {
  try {
    const subAdmins = await SubAdmin.find({});
    return res.status(200).json(subAdmins);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/addsubadmin", async (req, res) => {
  try {
    const { mail } = req.body;
    if (!mail) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingSubAdmin = await SubAdmin.findOne({ mail });
    if (existingSubAdmin) {
      return res
        .status(400)
        .json({ message: "Email is already present in sub-users list." });
    }

    const hashedPassword = await bcrypt.hash("subadmin", 10);
    await SubAdmin.create({ mail, pswd: hashedPassword });
    return res.status(200).send("Subadmin added");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/removesubadmin", async (req, res) => {
  try {
    const { mail } = req.body;
    if (!mail) {
      return res.status(400).json({ message: "Email must be provided." });
    }

    const subAdmin = await SubAdmin.findOneAndDelete({ mail });
    if (!subAdmin) {
      return res.status(404).json({ message: "Sub-admin not found." });
    }

    return res.status(200).json({ message: "Sub-admin removed successfully." });
  } catch (error) {
    console.error("Error removing sub-admin:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/updatepswd", async (req, res) => {
  try {
    const { mail, pswd } = req.body;
    if (!mail || !pswd) {
      return res
        .status(400)
        .json({ message: "Email and password must be provided." });
    }

    const hashedPassword = await bcrypt.hash(pswd, 10);
    const updatedSubAdmin = await SubAdmin.findOneAndUpdate(
      { mail },
      { pswd: hashedPassword },
      { new: true }
    );

    if (!updatedSubAdmin) {
      return res.status(404).json({ message: "Sub-admin not found." });
    }

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (
      decodedToken.username === "admin" ||
      decodedToken.username === "subadmin"
    ) {
      return res
        .status(200)
        .json({ valid: true, message: "User is authorized" });
    } else {
      return res
        .status(403)
        .json({ valid: false, message: "User is not authorized" });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
});

module.exports = router;
