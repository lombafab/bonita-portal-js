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
    }]).controller('userDashboardCtrl', [ '$scope', '$modal','loggedUser', 'User', 'Task', 'Process', 'Case', function ($scope, $modal, loggedUser, User, Task, Process, Case) {
        $scope.showRest = [];
        $scope.totalTasksToDo = null;
        $scope.totalAppsAvailable = null;
        $scope.totalCasesOpen = null;
        $scope.firstname = null;
        $scope.lastname = null;

        loggedUser.getLoggedUser().then(function(loggedUser){
            User.get({
                id:loggedUser.user_id
            }).$promise.then(function(user) {
                $scope.firstname = user.firstname;
                $scope.lastname = user.lastname;
            });
            Task.search({
                p:0,
                c:5,
                f:['user_id='+loggedUser.user_id, 'state=ready'],
                d:'rootContainerId'
            }).$promise.then(function(tasks) {
                $scope.tasks = tasks.result;
                $scope.totalTasksToDo = tasks.pagination.total;
            });
            Process.search({
                p:0,
                c:5,
                f:'user_id='+loggedUser.user_id,
                d:'deployedBy'
            }).$promise.then(function(apps) {
                $scope.apps = apps.result;
                $scope.totalAppsAvailable = apps.pagination.total;
            });
            Case.search({
                p:0,
                c:5,
                f:'started_by='+loggedUser.user_id,
                d:'processDefinitionId'
            }).$promise.then(function(cases) {
                    $scope.cases = cases.result;
                    $scope.totalCasesOpen = cases.pagination.total;
                });
        });

        $scope.hover = function(element) {
            return $scope.showRest[element] = ! $scope.showRest[element];
        };

        $scope.getDate = function(date) {
            return new Date(date).toLocaleString();
        }

        $scope.openRestModal = function(size) {
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

        $scope.openDoTask = function (name, version, processId) {
            var dialog = $modal.open({
                templateUrl: 'features/teamManager/users/start-process.html',
                controller:  ['$scope', '$modalInstance', '$stateParams', '$sce', function ($scope, $modalInstance, $stateParams, $sce) {
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.getUrl = function () {
                        var url = $sce.trustAsResourceUrl('../portal/homepage?ui=form&locale=en&tenant=1#form=' + name + '--' + version + '$entry&process=' + processId + '&autoInstantiate=false&mode=form&userId=' + $stateParams.userId);
                        return url;
                    };
                }],
                size: 'lg'
            });
            dialog.result.finally(function() {
                $scope.quickdetails.teamtasksPagination.refresh = !$scope.quickdetails.teamtasksPagination.refresh;
            });
        };

    }]);