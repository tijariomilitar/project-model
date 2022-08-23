const db = require('../../../config/connection');
const lib = require("jarmlib");

const Product = function () {
	this.id;
	this.code;
	this.name;

	this.create = () => {
		if(!this.code) { return { err: "É necessário informar o código do produto" } };
		if(!this.name) { return { err: "É necessário informar o nome do produto" } };

		let obj = lib.convertTo.object(this);
		let query = lib.Query.save(obj, 'project_model.product');

		return db(query);
	};

	this.update = () => {
		if(!this.id) { return { err: "O id do modelo é inválido" }; }

		let obj = lib.convertTo.object(this);
		let query = lib.Query.update(obj, 'project_model.product', 'id');

    return db(query);
	};
};

Product.filter = (props, inners, params, strictParams, orderParams) => {
	let query = new lib.Query().select().props(props).table("project_model.product product")
	.inners(inners).params(params).strictParams(strictParams).order(orderParams).build().query;
	return db(query);
};

Product.findById = (id) => {
	let query = `SELECT * FROM project_model.product WHERE id='${id}';`;
	return db(query);
};

Product.delete = async (id) => {
	let query = `DELETE FROM project_model.product WHERE id='${id}';`;
	return db(query);
};

module.exports = Product;