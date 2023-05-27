const express = require("express");
const { sentMailWithOtp, verifyOtp } = require("../controllers/userControllers");
const router = express.Router();

router.route("/create").post(sentMailWithOtp)

router.route("/verifyOtp").post(verifyOtp)


module.exports = router;