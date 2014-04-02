emmetApp.directive('popup', ['PopupService', 'HighlightService', '$window', function (PopupService, HighlightService, $window) {
	return {
		restrict: 'E',
		replace: true,
		scope: false,
		controller: 'PopupController',
		templateUrl: 'app/templates/Popup.tpl.html',
		link: function (scope, element) 
		{

			scope.$watch(
				function () {return HighlightService.getLetterId();},
				function (newValue, oldValue) 
				{
					if (newValue) {scope.show(newValue);}
					else {scope.hide();}
				}, true);


			scope.show = function (newValue) {
				PopupService.showPopup();
			};

			scope.hide = function () {				
				if (!PopupService.isPersistent()) PopupService.hidePopup();
			};

		}
	};
}]);