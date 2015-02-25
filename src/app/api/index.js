(function (api) {
	api.init = function (app) {
		var controllers = [
			'instances',
			'import', 
			'query', 
			'settings',
			'digests',
			'inboxes'
		];
		controllers.forEach(function(controllerPrefix) {
			var controller = require('./' + controllerPrefix + 'Controller');
			controller.init(app);
		});
	};
})(module.exports);