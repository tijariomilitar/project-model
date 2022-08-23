const router = require("express").Router();
const lib = require('jarmlib');

const homeController = require("../controller/index");

router.get("/", lib.route.toHttps, homeController.index);

router.use("/product", require("./product"));

module.exports = router;