// const Image = require('../models/image');
const { uploadFileS3, deleteFileS3 } = require("../../lib/s3");
const { compressImage } = require("../../lib/sharp");

const Product = require("../../model/product/main");
Product.image = require("../../model/product/image");

const fs = require("fs");

const imageController = {};

imageController.upload = async (file, product_id) => {
	try {
		let newPath = await compressImage(file, 425);
		let imageData = await uploadFileS3(newPath, file.filename.split('.')[0] + '.png');

		fs.promises.unlink(newPath);
		file.mimetype != 'image/png' && fs.promises.unlink(file.path);

		let image = new Product.image();
		image.product_id = product_id;
		image.etag = imageData.ETag.replaceAll(`"`, "");
		image.url = imageData.Location;
		image.keycode = imageData.Key;
		await image.save();
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

imageController.delete = async (req, res) => {
	try {
		const image = (await Product.image.findById(req.params.id))[0];

		await Product.image.delete(image.id);
		await deleteFileS3(image.keycode);

		res.send({ done: 'Imagem deletada com sucesso!' });
	} catch (err) {
		console.log(err);
		res.send({ msg: 'Ocorreu um erro ao excluir a imagem.' });
	}
};

module.exports = imageController;