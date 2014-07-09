(function () {

    angular.module('org.bonita.features.user.case.overview', ['ui.router'])
        .config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
            $urlRouterProvider.when(/_p=caseoverview/, ['$match', function ($match) {
                var query = {};
                angular.forEach($match.input.substring(1).split("&"), function (parameter) {
                    var property = parameter.split("=");
                    query[property[0]] = property[1];
                });
                return '/user/case/overview/' + query._processDefinitionId + "/" + query._id;
            }]);
            $stateProvider.state('user/case/overview', {
                url: '/user/case/overview/:definitionId/:instanceId',
                templateUrl: 'features/user/case/overview/overview.html',
                controller: 'overviewCtrl'
            });
        }])
        .controller('overviewCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {
            $scope.case = $stateParams;
        }])
        .directive('bpmn', function() {
            return {
                restrict: 'E',
                scope: {
                    definitionId: '=',
                    instanceId: '=',
                    name: '='
                },
                template: '<svg id="bpmn-diagram" style="height:100%;width:100%"><defs></defs></svg>',
                link: function(scope) {
                    new bonitasoft.BBPMN("assets/process-tracking/app/assets/studioFigures/").bootstrap(scope.definitionId, scope.instanceId, scope.name);
                }
            };
        });
})();