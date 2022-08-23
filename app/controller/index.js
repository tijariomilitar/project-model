const homeController = {};

homeController.index = async (req, res) => {
	res.render('index');
};

module.exports = homeController;