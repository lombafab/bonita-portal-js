'use strict';

/**
 * @ngdoc function
 * @name bonitaPortalJsApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the bonitaPortalJsApp
 */
angular.module('bonita.admin.users.list', ['bonita.common.resources']).config(
    [ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/admin/users/', '/admin/users');
        $stateProvider
        .state('adminUserList', {
            url: '/admin/users',
            templateUrl: 'features/admin/users/list.html',
            controller: 'AdminListCtrl'
        });
    }]).controller('AdminListCtrl', [ '$scope', 'User', function ($scope, User) {
    $scope.searchParams = {
        p: 0,
        c: 10
    };
    User.search($scope.searchParams).$promise.then(function(users){
        $scope.users = users.result;
    });
}]);