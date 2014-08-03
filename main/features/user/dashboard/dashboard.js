/**
 * Created by Fabio on 27/07/2014.
 */
'use strict';

/**
 * @ngdoc function
 * @name o.b.f.user.dashboard:dashboardCtrl
 * @description
 * # dashboardCtrl
 * Controller of the bonita.portal
 */
angular.module('org.bonita.features.user.dashboard', ['org.bonita.common.resources', 'ui.router', 'org.bonita.common.logged-user', 'ui.bootstrap']).config(
    [ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/user', '/user/dashboard');
        $stateProvider
            .state('userDashboard', {
                url: '/user/dashboard',
                templateUrl: 'features/user/dashboard/dashboard.html',
                controller: 'userDashboardCtrl'
            });
    }]).controller('userDashboardCtrl', [ '$scope', '$modal','loggedUser', 'User', 'Task', function ($scope, $modal, loggedUser, User, Task) {
        $scope.showRest = [];
        $scope.totalTasksToDo = null;

        loggedUser.getLoggedUser().then(function(loggedUser){
            $scope.users = User.search({
                p: 0,
                c: 10
            });
            Task.search({
                p:0,
                c:5,
                f:['user_id='+loggedUser.user_id, '&state=ready'],
                d:'rootContainerId'
            }).$promise.then(function(tasks) {
                $scope.tasks = tasks.result;
                $scope.totalTasksToDo = tasks.pagination.total;
            });
        });

        $scope.hover = function(element) {
            return $scope.showRest[element] = ! $scope.showRest[element];
        };

        $scope.getDate = function(date) {
            return new Date(date).toLocaleString();
        }

        $scope.openModal = function(size) {
            var modalInstance = $modal.open({
                templateUrl: 'features/user/dashboard/taskListModalContent.html',
                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                    $scope.ok = function () {
                        $modalInstance.close();
                    };

                }],
                size: size
            });
        };

    }]);