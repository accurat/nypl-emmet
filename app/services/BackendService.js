emmetApp.factory('BackendService', function($http, $q)
{
	return {

		loadData: function()
		{
			var deferred = $q.defer();
			$http.get("data/letters.json")
				.success(function(data)
				{
					deferred.resolve(data);
				})
				.error(function(data) 
				{
					deferred.reject('no data available');
				});
			return deferred.promise;
		}
	};
});