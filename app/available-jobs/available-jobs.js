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
	    $routeProvider.when('/available-jobs', {
    	    controller: 'ApplicationCtrl',
    	    templateUrl: 'available-jobs/available-jobs.html'
    	});

	}])
	//Definition of the controller
	.controller("ApplicationCtrl", ["$scope", "$routeParams", "$location", "ApplicationAPI", "$http",
		function ($scope, $routeParams, $location, ApplicationAPI, $http) {
			//Communicating with rest API @See ApplicationAPI
		    ApplicationAPI.latestApplications.get(function (data) {
		        // console.log("Response from ApplicationAPI.latestApplictions:", data);
				//Object containing the jobs from arbets database (Array)
		        var matchedJobs = data.matchningslista.matchningdata;
		        // console.log("Mathcningdata", matchedJobs);
				//Empty the add list
		        $scope.ads = [];

				//Populate the Add list with retrieved data
		        for (var i = 0; i < matchedJobs.length; i++) {
		        	$scope.ads.push({
								company_name: matchedJobs[i].arbetsplatsnamn,
								company_logo: "/img/logo_black.png",
								// company_logo: matchedJobs[i].arbetsplats.logotypurl,
								job_header: matchedJobs[i].annonsrubrik,
								job_id: matchedJobs[i].annonsid,
								job_title: matchedJobs[i].yrkesbenamning,
								job_city: matchedJobs[i].kommunnamn,
								job_posted: matchedJobs[i].publiceraddatum.substring(0,10)
		        	})
		        };

		    }, function (data) { //Catching error
		        console.log("There was an error");
		        //alert("There was an error loading the data");
		    });

			 $scope.search = function(query) {
			   $scope.status = "Searching...";
			   ApplicationAPI.jobSearch.get({nyckelord:query},function(data){
			     $scope.ads = [];
  				var matchedJobs = data.matchningslista.matchningdata;
			    
			     $scope.status = "Showing " + data.matchningslista.matchningdata.length + " results";
			
			  	//Populate the Add list with retrieved data
		        for (var i = 0; i < matchedJobs.length; i++) {
		        	$scope.ads.push({
								company_name: matchedJobs[i].arbetsplatsnamn,
								company_logo: "/img/logo_black.png",
								// company_logo: matchedJobs[i].arbetsplats.logotypurl,
								job_header: matchedJobs[i].annonsrubrik,
								job_id: matchedJobs[i].annonsid,
								job_title: matchedJobs[i].yrkesbenamning,
								job_city: matchedJobs[i].kommunnamn,
								job_posted: matchedJobs[i].publiceraddatum.substring(0,10)
		        	})
		        };

		       //$location.path('/available-jobs').search({query});
			     console.log(data);
			   },function(data){
			     $scope.status = "There was an error";
			   });
			 };





		     $scope.date = new Date();
		   /* $http.get('data/persons.json').success(function (data) {
		        $scope.persons = data;
		    });*/

			//Function attached to apply button
			//
			//@Param id the id of the job
			$scope.applyForJob = function (id) {
	        	// console.log("Apply for job: " + id);
				//Redirect to the job specific detailed information
	        	$location.path("/apply/" + id);
	    	}
			//Logout funtionnality.
		    $scope.logout = function () {
		        console.log("Log out user!");
		        Auth.$unauth();
		    }
		}]);