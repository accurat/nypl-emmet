var emmetApp = angular
	.module('emmet',['ngRoute'])
	.config(function($routeProvider) 
	{
		$routeProvider
			.when('/', {redirectTo:'/data/accurat/view/when/order/byAuthorYear'})
			.when('/data/:dataType/view/:viewType/order/:orderType',
			{
				controller: 'WhenController',
				templateUrl: 'app/templates/When.tpl.html'
			})
			.when('/data/:dataType/view/:viewType/person/:personId',
			{
				controller: 'WhoController',
				templateUrl: 'app/templates/Who.tpl.html'
			})
			.otherwise({redirectTo:'/'});
	});
