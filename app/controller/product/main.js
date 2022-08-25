const fs = require("fs");
const lib = require("jarmlib");

const { uploadFileS3, deleteFileS3 } = require("../../lib/s3");
const { compressImage } = require("../../lib/sharp");

const Product = require("../../model/product/main");
Product.image = require("../../model/product/image");

const imageController = require("./image");

const productController = {};

productController.index = async (req, res) => {
	res.render("product/catalog/index");
};

productController.manage = async (req, res) => {
	res.render("product/manage/index");
};

productController.create = async (req, res) => {
	const product = new Product();
	product.id = req.body.id;
	product.code = req.body.code;
	product.name = req.body.name;

	try {
		let response;

		if(!product.id) {
			response = await product.create();
			product.id = response.insertId;
		} else {
			response = await product.update();
		}

		if(response.err) { return res.send({ msg: response.err }); }

		for(let i in req.files){
			let uploadResponse = await imageController.upload(req.files[i], product.id);
		};

		res.send({ done: "Produto cadastrado com sucesso!" });
	} catch (err) {
		console.log(err);
		if(err.code == "ER_DUP_ENTRY") { return res.send({ msg: "Duplicidade para: "+err.sqlMessage.split("'")[1] }); } 
		res.send({ msg: "Ocorreu um erro ao cadastrar o Produto, favor contate o suporte!" });
	}
};

productController.filter = async (req, res) => {
	let props = [];
	let inners = [];

	const params = { keys: [], values: [] };
	const strict_params = { keys: [], values: [] };

	lib.Query.fillParam("product.code", req.body.code, strict_params);
	lib.Query.fillParam("product.name", req.body.name, params);

	let order_params = [ ["product.code","ASC"] ];

	try {
		const products = await Product.filter([], [], params, strict_params, order_params);
		res.send({ products });
	} catch (err) {
		console.log(err);
		res.send({ msg: "Ocorreu um erro ao filtrar os produtos, favor contatar o suporte." });
	}
};

productController.findById = async (req, res) => {
	try {
		const product = (await Product.findById(req.params.id))[0];
		product.images = await Product.image.list(req.params.id);

		res.send({ product });
	} catch (err) {
		console.log(err);
		res.send({ msg: "Ocorreu um erro ao encontrar o produto." });
	}
};

module.exports = productController;