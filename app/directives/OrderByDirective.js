emmetApp.directive('orderby', ['SymbolsService', 'LocationService', function(SymbolsService, LocationService) 
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
			var authorYearUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
			    authorYearUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderAuthorYear);
			var authorYearLabel = 'author volumes per year';
			var authorYearElementClass = 'order-by-author-year'; 
			
			var authorTotalUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen); 
			    authorTotalUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderAuthorTotal);
			var authorTotalLabel = 'author volumes in timeline';
			var authorTotalElementClass = 'order-by-author-total'; 
			
			var topicUrl = LocationService.setUrlParameter(SymbolsService.urlTokenView, SymbolsService.viewWhen);
			    topicUrl = LocationService.setUrlParameter(SymbolsService.urlTokenOrder, SymbolsService.orderTopic);
			var topicLabel = 'topic';
			var topicElementClass = 'order-by-topic'; 
			
			var directiveTemplate = '<div class="order-by-container">';
			directiveTemplate += '<span class="' + authorYearElementClass + '"><a href="' + authorYearUrl + '">' + authorYearLabel + '</a></span>';
			directiveTemplate += '<span> &#47; </span>';
			directiveTemplate += '<span class="' + authorTotalElementClass + '"><a href="' + authorTotalUrl + '">' + authorTotalLabel + '</a></span>';
			directiveTemplate += '<span> &#47; </span>';
			directiveTemplate += '<span class="' + topicElementClass + '"><a href="' + topicUrl + '">' + topicLabel + '</a></span>';
			directiveTemplate += '</div>';
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);