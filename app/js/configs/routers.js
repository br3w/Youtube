angular.module('youtube')

  .config([' $stateProvider', '$locationProvider',

    function( $stateProvider, $locationProvider ) {

        // States
        $stateProvider

            .state('home', {
                url: '/',
                views: {
                    '': { templateUrl: 'html/pages/home.tmpl.html' }
                    //'content@home': {templateUrl: 'views/pages/login/index.html' }
                    // 'list@home': {templateUrl: 'views/pages/login/index.html' }
                }
            })

            // .state('first', {
            //     url: '/first/:token',
            //     views: {
            //         '': { templateUrl: 'views/templates/login.tmpl.html' },
            //         'content@first': {templateUrl: 'views/pages/first/index.html' }
            //     }
            // })
            //
            // .state('medic', {
            //     url: '/medic',
            //     views: {
            //         '': { templateUrl: 'views/templates/login.tmpl.html' },
            //         'content@medic': {templateUrl: 'views/pages/medic/index.html' }
            //     }
            // })

            $urlRouterProvider.otherwise('/');
            $locationProvider.html5Mode(false);

}]);
