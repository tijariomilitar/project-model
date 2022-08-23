const Product = {}; 

Product.create = async (product) => {
	let response = await fetch("/product/create", {
		method: "POST",
	  body: product
	});
	response = await response.json();

	if(API.verifyResponse(response)){ return false };
	alert(response.done);

	return response;
};

Product.findById = async (id) => {
	let response = await fetch(`/product/id/${id}`);
	response = await response.json();
	
	if(API.verifyResponse(response)){ return false };
	
	return response.product;
};

Product.filter = async product => {
	let response = await fetch("/product/filter", {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
	    body: JSON.stringify(product)
	});
	response = await response.json();

	if(API.verifyResponse(response)){ return false };

	return response.products;
};

Product.delete = async (id) => {
	let response = await fetch(`/product/delete/${id}`, { method: 'DELETE' });
	response = await response.json();

	if(API.verifyResponse(response)){ return false };
	
	alert(response.done);
	
	return true;
};