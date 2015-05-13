(function(){
  "use strict";
  function CommitStreamAdminBoot(el) {
    var persistentOptions = {
      headers: { Bearer: '' }
    };

    var app = angular.module('commitStreamAdmin', ['commitStreamAdmin.config', 'angular-hal', 'ngRoute']);
    app.config(function($sceProvider) {
      $sceProvider.enabled(false);
    });

    app.factory('CommitStreamApi', ['serviceUrl', 'halClient', function(serviceUrl, halClient) {
      return {
        'load' : function() {
          return halClient.$get(serviceUrl + '/api/public', persistentOptions);
        },
      };
    }]);

    app.config(['serviceUrlProvider', '$routeProvider', function(serviceUrlProvider, $routeProvider) {
      var serviceUrl = serviceUrlProvider.$get();
      console.log(serviceUrl);
      $routeProvider.when('/', {templateUrl: serviceUrl + '/partials/instances.html', controller: 'InstancesController'});
      $routeProvider.when('/inboxes', {templateUrl: serviceUrl + '/partials/inboxes.html', controller: 'InboxesController'});
      $routeProvider.otherwise({redirectTo: serviceUrl + '/'});
    }]);

    app.controller('InstancesController',
      ['$rootScope', '$scope', '$location', 'CommitStreamApi',
      function($rootScope, $scope, $location, CommitStreamApi) {        
        CommitStreamApi
        .load()
        .then(function(resources) {
          $rootScope.resources = resources;
          return resources.$post('instances');
        })
        .then(function(instance) {
          persistentOptions.headers.Bearer = instance.apiKey;
          $rootScope.instance = instance;

          return instance.$post('digest-create', {}, {
            description: 'My new digest'
          });
        })
        .then(function(digest) {
          $rootScope.digest = digest;
          $location.path('/inboxes');
        })
        .catch(function(error) {
          console.error("Caught an error adding an instance or a repo list!");
          console.error(error);
        });
      }]
    );

    app.controller('InboxesController', ['$rootScope', '$scope', function($rootScope, $scope) {
      $scope.newInbox = {
        url: '',
        name: '',
        family: 'GitHub'
      };
      
      $scope.inboxes = [];

      $scope.inboxCreate = function() {
        var index = $scope.newInbox.url.lastIndexOf('/');
        $scope.newInbox.name = $scope.newInbox.url.substr(index + 1);

        $rootScope.digest.$post('inbox-create', {}, $scope.newInbox)
        .then(function(inbox) {
          var links = inbox.$links();
          inbox.addCommit = links['add-commit'].href + 'apiKey=' + persistentOptions.headers.Bearer;
          $scope.inboxes.push(inbox);
        })
        .catch(function(error) {
          console.error("Caught an error adding a repo!");
          console.error(error);
        });
      };

      $scope.inboxHighlight = function(evt) {
        var el = evt.currentTarget;
        el.focus();
        el.select();
      };
    }]);

    angular.bootstrap(el, ['commitStreamAdmin']);
  };
  window.CommitStreamAdminBoot = CommitStreamAdminBoot;
}());