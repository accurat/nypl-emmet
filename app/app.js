var emmetApp = angular
	.module('emmet',['ngRoute'])
	.config(function($routeProvider) 
	{
		$routeProvider
			.when('/', {redirectTo:'/data/accurat/view/when/order/byAuthorYear'})
			.when('/data/:dataType/view/:viewType/order/:orderType',
			{
				controller: 'WhenController',
				templateUrl: 'app/templates/WhenTemplate.html'
			})
			.when('/data/:dataType/view/:viewType/person/:personId',
			{
				controller: 'WhoController',
				templateUrl: 'app/templates/WhoTemplate.html'
			})
			.otherwise({redirectTo:'/'});
	});
