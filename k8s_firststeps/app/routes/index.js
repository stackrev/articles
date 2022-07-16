var express = require("express");
var router = express.Router();
var ip = require("ip");

const hostIp = ip.address();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Hello World", host: hostIp });
});

module.exports = router;
