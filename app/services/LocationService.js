emmetApp.factory('LocationService', ['SymbolsService', '$routeParams', function(SymbolsService, $routeParams)
{
	var dataType = null;
	var viewType = null;
	var orderType = null;
	var personId = null;
	
	
	return {
		
		setUrlParameter: function(parameter, value)
		{
			if (parameter == SymbolsService.urlTokenData)
			{
				dataType = value;
				viewType = $routeParams.viewType;
				orderType = $routeParams.orderType;
				personId = $routeParams.personId;
			}
			else if (parameter == SymbolsService.urlTokenView)
			{
				dataType = $routeParams.dataType;
				viewType = value;
				orderType = null;
				personId = null;
				
				// default order for when
				if (value == SymbolsService.viewWhen) orderType = SymbolsService.orderAuthorYear;
				
			}
			else if (parameter == SymbolsService.urlTokenOrder)
			{
				dataType = $routeParams.dataType;
				viewType = $routeParams.viewType;
				orderType = value;
				personId = null;
			}
			else if (parameter == SymbolsService.urlTokenPerson)
			{
				dataType = $routeParams.dataType;
				viewType = SymbolsService.viewWho;
				orderType = null;
				personId = value;
			}
			
			return this.getUrl();
		},
		
		getUrl: function()
		{
			var url = '#';
			
			if (dataType) url += this.getDataToken();
			if (viewType) url += this.getViewToken();
			if (orderType) url += this.getOrderToken();
			if (personId) url += this.getPersonToken();
			
			return url;
		},
		
		getUrlToToken: function(urlToken)
		{
			var url = '#';
			
			if (urlToken == SymbolsService.urlTokenData)
			{
				if (dataType) url += this.getDataToken();
			}
			else if (urlToken == SymbolsService.urlTokenView)
			{
				if (dataType) url += this.getDataToken();
				if (viewType) url += this.getViewToken();
			}
			else if (urlToken == SymbolsService.urlTokenOrder)
			{
				if (dataType) url += this.getDataToken();
				if (viewType) url += this.getViewToken();
				if (orderType) url += this.getOrderToken();
			}
			else if (urlToken == SymbolsService.urlTokenPerson)
			{
				if (dataType) url += this.getDataToken();
				if (viewType) url += this.getViewToken();
				if (personId) url += this.getPersonToken();
			}
			
			return url;
		},
		
		getDataToken: function()
		{
			if (!dataType) return '';
			else return '/' + SymbolsService.urlTokenData + '/' + dataType;
		},
		
		getViewToken: function()
		{
			if (!viewType) return '';
			else return '/' + SymbolsService.urlTokenView + '/' + viewType;
		},
		
		getOrderToken: function()
		{
			if (!orderType) return '';
			else return '/' + SymbolsService.urlTokenOrder + '/' + orderType;
		},
		
		getPersonToken: function()
		{
			if (!personId) return '';
			else return '/' + SymbolsService.urlTokenPerson + '/' + personId;
		}
		
		
	};
}]);