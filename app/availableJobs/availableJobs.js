/* Module containing controller for availableJobs
*  It's main functionality is to link the arbets REST API to our model and view by fetching recent job adds.
*  @See ApplicationAPI
*  @See firebase.auth
*  @See firebase.utils
*/

"use strict";
angular.module('goodJob.availableJobs', ['firebase.auth', 'firebase.utils', 'ngRoute'])
	//Routing
	.config(['$routeProvider', function ($routeProvider) {
	    $routeProvider.when('/availableJobs', {
    	    controller: 'AvailableJobsCtrl',
    	    templateUrl: 'availableJobs/availableJobsView.html'
    	});

	}])
	//Definition of the controller
	.controller("AvailableJobsCtrl", ["$scope", "$routeParams", "$route","$location", "ApplicationAPI",
		function ($scope, $routeParams, $route, $location, ApplicationAPI) {
			//Communicating with rest API @See ApplicationAPI
		    $scope.latestJobs = function(){
			    	ApplicationAPI.latestApplications.get(function (data) {
			        
					//Object containing the jobs from arbets database (Array)
			        var matchedJobs = data.matchningslista.matchningdata;
			        
					//Empty the add list
			        $scope.ads = [];

					//Populate the Add list with retrieved data
			        for (var i = 0; i < matchedJobs.length; i++) {
			        	$scope.ads.push({
									company_name: matchedJobs[i].arbetsplatsnamn,
									company_logo: "/img/logo_black.png",
									job_header: matchedJobs[i].annonsrubrik,
									job_id: matchedJobs[i].annonsid,
									job_title: matchedJobs[i].yrkesbenamning,
									job_city: matchedJobs[i].kommunnamn,
									job_posted: matchedJobs[i].publiceraddatum.substring(0,10)
			        	})
			        };

			    }, function (data) { //Catching error
			        console.log("There was an error");
			        
			    });
			 }

			 $scope.search = function(query) {
				if(query){
				   $scope.status = "Searching...";
				   ApplicationAPI.jobSearch.get({nyckelord:query},function(data){
				   	console.log("Job search",data);
					$scope.ads = [];
				   	if(data.matchningslista.matchningdata){
		  				 var matchedJobs = data.matchningslista.matchningdata;
					     console.log("MatchedJobs", matchedJobs);
					     $scope.status = "Showing " + matchedJobs.length + " results";
					
					  	//Populate the Add list with retrieved data
				        for (var i = 0; i < matchedJobs.length; i++) {
				        	$scope.ads.push({
										company_name: matchedJobs[i].arbetsplatsnamn,
										company_logo: "/img/logo_black.png",
										job_header: matchedJobs[i].annonsrubrik,
										job_id: matchedJobs[i].annonsid,
										job_title: matchedJobs[i].yrkesbenamning,
										job_city: matchedJobs[i].kommunnamn,
										job_posted: matchedJobs[i].publiceraddatum.substring(0,10)
				        	})
				        };
				   	}
				   	else{
				   		$scope.status = "No results!";
				   	}

				   },function(err){
				   		if(err.statusText === 'Bad Request'){
				     		$scope.status = "Error... try another keyword!";
				   		}
				   });
				}
				else{
					//If no query i sent, reload page with 10 latest available jobs
					$route.reload();
				}
			 };





		     $scope.date = new Date();
		   

			//Function attached to apply button
			//
			//@Param id the id of the job
			$scope.applyForJob = function (id) {
	        	
				//Redirect to the job specific detailed information
	        	$location.path("/apply/" + id);
	    	}
			//Logout funtionnality.
		    $scope.logout = function () {
		        console.log("Log out user!");
		        Auth.$unauth();
		    }
		}]);
