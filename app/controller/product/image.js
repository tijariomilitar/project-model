// const Image = require('../models/image');
const { uploadFileS3, deleteFileS3 } = require("../../lib/s3");
const { compressImage } = require("../../lib/sharp");

const Product = require("../../model/product/main");
Product.image = require("../../model/product/image");

const fs = require("fs");

const imageController = {};

imageController.upload = async (req, res) => {
	for(let i in req.files){
		let newPath = await compressImage(req.files[i], 425);
		let imageData = await uploadFileS3(newPath, req.files[i].filename.split('.')[0] + '.png');

		fs.promises.unlink(newPath);
		req.files[i].mimetype != 'image/png' && fs.promises.unlink(req.files[i].path);

		let image = new Image();
		image.etag = imageData.ETag.replaceAll(`"`, "");
		image.url = imageData.Location;
		image.keycode = imageData.Key;
		await image.save();
	};

	res.send({ done: 'upload realizado com sucesso' });
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