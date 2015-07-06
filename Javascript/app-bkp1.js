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
        $scope.showresult=true;
        $scope.search = '';
        $scope.searchstat = false;
        $scope.mvln = 0;
        $scope.fetchResults = function(){
            $scope.showresult=true;
            $http.jsonp('http://api.rottentomatoes.com/api/public/v1.0/movies.json', {
                params: {
                    page_limit: '5',
                    page: '1',
                    q: $scope.search,
                    apikey: 'bzm7bkpkkm4wghg22xdbx4vy',
                    callback: 'JSON_CALLBACK'
                }
            })
                .success(function (data) {
                    $scope.results = data.movies;
                    if ($scope.results.length > 0)
                    {
                        $scope.searchstat = true;
                    }
                });
        };
        $scope.reset = function(){
            $scope.showresult=true;
            $scope.search = null;
            $scope.newlist = [];
            $scope.searchstat = false;
        };
        $scope.exists = function(existid){
            for(var i=0;i<$scope.movies.length;i++){
                if($scope.movies[i].id == existid){
                    return false;
                }
            }
            return true;
        };
        $scope.newlist = [];

        $scope.addmovie = function(addid, addtitle){
            var myurl= 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+addid+'.json';
            $scope.newlist.push({id:addid});
            $scope.movies.push({id:addid, title:addtitle});
        };
        $scope.isNewList = function(){
            if ($scope.newlist.length = 0) {
                return true;
            } else {
                return false;
            }
        };
    });
