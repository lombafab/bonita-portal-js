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
angular.module('org.bonita.features.user.dashboard', ['org.bonita.common.resources', 'ui.router', 'org.bonita.common.logged-user']).config(
    [ '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('/user', '/user/dashboard');
        $stateProvider
            .state('userDashboard', {
                url: '/user/dashboard',
                templateUrl: 'features/user/dashboard/dashboard.html',
                controller: 'userDashboardCtrl'
            });
    }]).controller('userDashboardCtrl', [ '$scope', 'loggedUser', 'User', function ($scope, loggedUser, User) {
        loggedUser.getLoggedUser().then(function(){
            $scope.users = User.search({
                p: 0,
                c: 10
            });
        });
    }]);