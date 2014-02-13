emmetApp.directive('orderby', ['SymbolsService', 'LocationService', function(SymbolsService, LocationService) 
{
	return {
		restrict: 'E',
		replace: true,
		transclude: false,
		scope: 
		{
			
		},
		controller: 'OrderByController',
		template: function()
		{
			var label = "order by";
			
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
			
			var directiveTemplate;
			directiveTemplate  = '<div class="order-by-container">';
				directiveTemplate += '<div class="order-by active"><span ng-mousedown="displayOrderByList()">' + label + '</span><img src="img/chevron.png" width="15" style="margin-left: 10px;"></div>';
				
				directiveTemplate += '<div class="order-by-selection-list">'; 
					directiveTemplate += '<ul class="order-by-list">';						
						directiveTemplate += '<li class="order-by-item"><span class="' + authorYearElementClass + '"><a href="' + authorYearUrl + '">' + authorYearLabel + '</a></span></li>';
						directiveTemplate += '<li class="order-by-item"><span class="' + authorTotalElementClass + '"><a href="' + authorTotalUrl + '">' + authorTotalLabel + '</a></span></li>';
						directiveTemplate += '<li class="order-by-item"><span class="' + topicElementClass + '"><a href="' + topicUrl + '">' + topicLabel + '</a></span></li>';
					directiveTemplate += '</ul>';
				directiveTemplate += '</div>';
				
			directiveTemplate += '</div>';
			
			
			return directiveTemplate;
		},
		link: function (scope, element) 
		{
			
		}
	};
}]);