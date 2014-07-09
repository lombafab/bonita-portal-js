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
        .controller('overviewCtrl', ['$scope', '$stateParams', 'Case', 'FlowNode', 'ArchivedFlowNode', function ($scope, $stateParams, Case, FlowNode, ArchivedFlowNode) {
            $scope.context = $stateParams;
            $scope.case = Case.get({ id: $scope.context.instanceId, d: 'processDefinitionId' });
            $scope.updateDetails = function(shape) {
                return function(event) {
                    event.target.classList.add('highlight');
                    $scope.flownode = shape.name;
                    $scope.journal = FlowNode.search({
                        p: 0,
                        c: 10,
                        f: ["name=" + shape.name, "processId=" + $scope.context.definitionId],
                        d: ['actorId', 'assigned_id', 'executedBy']
                    });
                    $scope.archives = ArchivedFlowNode.search({
                        p: 0,
                        c: 10,
                        f: ["name=" + shape.name, "processId=" + $scope.context.definitionId],
                        d: ['actorId', 'assigned_id', 'executedBy']
                    });
                };
            };
        }])
        .directive('bpmn', function () {
            return {
                restrict: 'E',
                scope: {
                    definitionId: '=',
                    instanceId: '=',
                    name: '=',
                    onClick: '='
                },
                template: '<svg id="bpmn-diagram" style="height:100%;width:100%"><defs><marker id="markerArrow" markerWidth="13" markerHeight="13" refx="10" refy="6" orient="auto"><path d="M2,2 L2,11 L10,6 L2,2" style="fill: #000000;" /></marker></defs></svg>',
                link: function (scope) {
                    new bonitasoft.BBPMN("assets/process-tracking/app/assets/studioFigures/").bootstrap(scope.definitionId, scope.instanceId, scope.name, scope.onClick);
                }
            };
        })
        .filter('alt', function() {
            return function(input, alt) {
                return input || alt;
            };
        });
})();