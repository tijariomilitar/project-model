const router = require("express").Router();
const lib = require('jarmlib');
const multer = require('../lib/multer');

const productController = require('../controller/product/main');
productController.image = require('../controller/product/image');

router.get('/', lib.route.toHttps, productController.index);
router.get('/manage', lib.route.toHttps, productController.manage);
router.post('/create', lib.route.toHttps, multer.any('files'), productController.create);
router.post('/filter', lib.route.toHttps, productController.filter);
router.get('/id/:id', lib.route.toHttps, productController.findById);

router.delete('/image/id/:id', lib.route.toHttps, productController.image.delete);

module.exports = router;