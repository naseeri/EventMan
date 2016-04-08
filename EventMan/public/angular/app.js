angular.module('eventman', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])

.controller('event', function($scope, $http, $mdDialog, $mdMedia) {
	$scope.appTitle = 'Event Manager';
	
	var eventsLoad = [];
	$http({
        method : "GET",
        url : "/events"
    }).then(function mySucces(response) {
		response.data.forEach(function(i) {
			eventsLoad.push(i);
		});
		$scope.loadEvents();
    }, function myError(response) {
        alert("Server Error");
    });
	
	$scope.loadEvents = function() {
		$('#calendar').fullCalendar({
			defaultDate: '2016-04-12',
			
			eventRender: function(event, element) {//Right click option
				element.bind('mousedown', function (e) {
					if (e.which == 3) {
						alert('Right mouse button pressed');
					}
				});
            },
			dayClick: function(date, jsEvent, view) {
				$scope.addDate = date.format();
				$scope.showTabDialog();
			},
			eventClick: function(calEvent, jsEvent, view) {
				$('#delModal').modal({
					show: 'true'
				});
				$scope.delName = calEvent.title;
				$scope.delID = calEvent.id;
				$scope.delCalendarID = calEvent._id;
			},
			eventDrop: function(event, delta, revertFunc) {
				$scope.editDate = event.start.format();
				$scope.editID = event.id;
				if (!confirm("Are you sure you would like to move "+event.title+" to "+$scope.editDate+"?")) {
					revertFunc();
				} else {
					$scope.editEvent();
				}
			},

			editable: true,
			eventLimit: true,
			events: eventsLoad
		});
	}

	$scope.addName = "";
	$scope.addEvent = function() {
		$http({
        method : "POST",
        url : "/events/"+$scope.addName+"/"+$scope.addDate
		}).then(function mySucces(response) {
			console.log(response.data);
			alert("Event Added!");
			$('#calendar').fullCalendar( 'renderEvent', {id:response.data, title:$scope.addName, start:$scope.addDate} );
		}, function myError(response) {
			alert("Server Error");
		});
	};

	$scope.delName = "";
	$scope.delEvent = function() {
		$http({
        method : "POST",
        url : "/events/"+$scope.delID
		}).then(function mySucces(response) {
			console.log(response.data);
			alert("Event Deleted!");
			$('#calendar').fullCalendar('removeEvents',$scope.delCalendarID);
		}, function myError(response) {
			alert("Server Error");
		});
	};
	
	$scope.editEvent = function() {
		$http({
        method : "POST",
        url : "/events/"+$scope.editID+"/"+$scope.editDate+"/update"
		}).then(function mySucces(response) {
			console.log(response.data);
			alert("Event Edited!");
		}, function myError(response) {
			alert("Server Error");
		});
	};
	
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	$scope.showTabDialog = function(ev) {
		$mdDialog.show({
		  controller: DialogController,
		  templateUrl: 'tabDialog.tmpl.html',
		  parent: angular.element(document.body),
		  clickOutsideToClose:true
		})
		.then(function(answer) {
		  $scope.addName = answer;
		  $scope.addEvent();
        }, function() {
          
        });
	};

});

function DialogController($scope, $mdDialog) {
	$scope.addName = "";

	$scope.hide = function() {
		$mdDialog.hide();
	};

	$scope.cancel = function() {
		$mdDialog.cancel();
	};

	$scope.answer = function() {
		$mdDialog.hide($scope.addName);
	};
}