/**
 * Created by Jac-MacPro on 3/15/15.
 */
var app = angular.module('movieReviews',['ui.bootstrap'])
    .controller('movieCtrl', function($scope, $rootScope, $http, $modal, $log){
        $rootScope.showheader=true;
        $rootScope.movdet=[];
        $http.get('Resource/Data/movies.json').success(function(resp){
            $scope.movies = resp.allMovies;
        });
        $scope.movdet = [];
        $scope.open = function (size, myid) {
            var myurl= 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+myid+'.json';
            $http.jsonp(myurl, {
                params: {
                    apikey: 'bzm7bkpkkm4wghg22xdbx4vy',
                    callback: 'JSON_CALLBACK'
                }
            }).success(function (data){
                $scope.movdet = data;
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

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    })
    .controller('MovieInstanceCtrl', function ($scope, $modalInstance, movdet) {
        $scope.movdet = movdet;
        $scope.selected = {
            movdet: $scope.movdet[0]
        };
        $scope.ok = function () {
            $modalInstance.close($scope.selected.movdet);
        };
});
/*
$scope.movieDetails = function(addid){
    var myurl= 'http://api.rottentomatoes.com/api/public/v1.0/movies/'+addid+'.json';

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
*/

