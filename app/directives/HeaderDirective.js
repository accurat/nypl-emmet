emmetApp.directive('header', ['SymbolsService', 'LocationService', '$routeParams', function(SymbolsService, LocationService, $routeParams) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		template: function()
		{
			var appTitle = 'Founding fathers\' correspondence';
			var appSubtitle = 'Visualizing the Emmet Collection';
			
			var directiveTemplate = '<div class="header">';
				directiveTemplate += '<popup></popup>';	
				directiveTemplate += '<div class="title">' + appTitle + '</div>';
				directiveTemplate += '<div class="subtitle">' + appSubtitle + '</div>';
				directiveTemplate += '<personselection></personselection>';
				directiveTemplate += '<dataselection></dataselection>';
				directiveTemplate += '<view></view>';
				directiveTemplate += '<topicselection></topicselection>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);