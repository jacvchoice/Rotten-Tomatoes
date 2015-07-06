/**
 * Created by Jacob on 3/15/15.
 */
var app = angular.module('movieReviews',['ui.bootstrap'])
    .controller('movieCtrl', function($scope, $rootScope, $http, $modal, $log){
        $rootScope.showheader=true;
        $scope.format = 'MM/dd/yyyy h:mm:ss a';
        $http.get('Resource/Data/movies.json').success(function(resp){
            $scope.movies = resp.allMovies;
        });
        $scope.fresh = "Resource/Images/critic-tomato.jpg";
        $scope.certfresh = "Resource/Images/critic-tomato-certified.jpg";
        $scope.rotten = "Resource/Images/critic-rotten.jpg";
        $scope.notratedyet = "Resource/Images/no-score-yet.png";
        $scope.criticsrating = function(rating) {
            if (rating == "Fresh"){
                return $scope.fresh;
            } else if (rating == "Certified Fresh"){
                    return $scope.certfresh;
                } else if (rating == "Rotten"){
                        return $scope.rotten;
                    } else {
                        return $scope.notratedyet;
            }
        };
        $scope.upright = "Resource/Images/audience-upright.png";
        $scope.spilled = "Resource/Images/audience-spilled.png";
        $scope.audiencerating = function(rating) {
            if (rating == "Upright"){
                return $scope.upright;
            } else if (rating == "Spilled") {
                    return $scope.spilled;
                } else {
                    return $scope.notratedyet;
                }
        };
        $scope.movdet = [];
        $scope.open = function (size, myid) {
            if ($rootScope.showheader) {
                $rootScope.showheader=false;
                var myurl = 'http://api.rottentomatoes.com/api/public/v1.0/movies/' + myid + '.json';
                $http.jsonp(myurl, {
                    params: {
                        apikey: 'bzm7bkpkkm4wghg22xdbx4vy',
                        callback: 'JSON_CALLBACK'
                    }
                }).success(function (data) {
                    $scope.movdet = data;
                    $scope.movdet.cast = $scope.movdet.abridged_cast;
                    $scope.counter++;
                    var modalInstance = $modal.open({
                        templateUrl: 'myMovieContent.html',
                        controller: 'MovieInstanceCtrl',
                        size: size,
                        resolve: {
                            movdet: function () {
                                return $scope.movdet;
                            }
                        }
                    });
                });
            }
        };
        $scope.showresult=false;
        $scope.search = '';
        $scope.searchstat = false;
        $scope.mvln = 0;
        $scope.fetchResults = function(){
            $scope.showresult=true;
            $http.jsonp('http://api.rottentomatoes.com/api/public/v1.0/movies.json', {
                params: {
                    page_limit: '50',
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
                })
                .error(function(data, status){
                    alert($scope.search);
                });
        };
        $scope.reset = function(){
            $scope.showresult = false;
            $scope.search = null;
            $scope.results = [];
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
        $scope.addmovie = function(addid, addtitle, criticsrating, criticsscore, audiencerating, audiencesscore){
            var myurl= 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+addid+'.json';
            $scope.movies.push({id:addid, title:addtitle, critics_rating:criticsrating, critics_score:criticsscore, audience_rating:audiencerating, audience_score:audiencesscore});
        };
    })
    .controller('MovieInstanceCtrl', function ($scope, $rootScope, $modalInstance, movdet) {
        $scope.movdet = movdet;
        $scope.ok = function () {
            $rootScope.showheader=true;
            $modalInstance.close();
        };
        $scope.checkempty = function(castname){
            if(castname == null){
                return false;
            } else{
                return true;
            }
        };
    })
    .directive('myCurrentTime', ['$interval', 'dateFilter',
        function($interval, dateFilter) {
            return function(scope, element, attrs) {
                var format,
                    stopTime;
                function updateTime() {
                    element.text(dateFilter(new Date(), format));
                }
                scope.$watch(attrs.myCurrentTime, function(value) {
                    format = value;
                    updateTime();
                });
                stopTime = $interval(updateTime, 1000);
                element.on('$destroy', function() {
                    $interval.cancel(stopTime);
                });
            }
        }]);

