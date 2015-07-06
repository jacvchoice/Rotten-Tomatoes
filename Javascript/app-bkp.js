/**
 * Created by Jac-MacPro on 3/15/15.
 */
var app = angular.module('movieReviews',['ui.bootstrap'])
    .controller('movieCtrl', function($scope, $rootScope, $http){
        $rootScope.showheader=true;
        $http.get('Resource/Data/movies.json').success(function(resp){
            $scope.movies = resp.allMovies;
        });
        $scope.isCollapsed = true;
        $scope.movieDetails = function(addid){
            var myurl= 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+addid+'.json';
            $scope.isCollapsed = !$scope.isCollapsed;
            $http.jsonp(myurl, {
                params: {
                    apikey: 'bzm7bkpkkm4wghg22xdbx4vy',
                    callback: 'JSON_CALLBACK'
                }
            })
                .success(function (data) {
                    $scope.movdet = data;
                });
        };

    });
