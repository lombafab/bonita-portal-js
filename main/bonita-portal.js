(function (global) {
    'use strict';

    angular
        .module('org.bonita.portal', [
            'ngCookies',
            'ngResource',
            'ui.router',
            'org.bonita.common.resources',
            'org.bonita.features.admin',
            'org.bonita.features.user'
        ]);
})(this);

