import '../../css/index.scss';
import './login.scss';

import 'angular-ui-router';
import 'angular-formly';
import 'angular-formly-templates-bootstrap';

import angular from 'angular';

import home from '../login/index';

import http from '../shared/http';
import api from '../shared/api';

if (process.env.NODE_ENV === 'development') Error.stackTraceLimit = Infinity;

const app = angular.module('login', ['ui.router', 'formly', 'formlyBootstrap']);

function run () {
  console.log('angular-login is running');
}

function performance ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}
performance.$inject = ['$compileProvider'];

function config ($stateProvider) {
  $stateProvider
    .state('home', home);
}
config.$inject = ['$stateProvider'];

app
  .factory('http', http)
  .factory('api', api)
  .config(formlyConfig)
  .config(config)
  .run(formlyRun)
  .run(run);

function formlyConfig (formly) {
  function showErrors ($viewValue, $modelValue, scope) {
    return (scope.fc.$invalid && scope.form.$submitted);
  }
  formly.extras.errorExistsAndShouldBeVisibleExpression = showErrors;

  formly.setWrapper({
    name: 'errors',
    template: `
      <div>
        <formly-transclude></formly-transclude>
        <div ng-if="showError" ng-messages="options.formControl.$error">
          <div class="control-label" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">
            {{ message(options.formControl.$viewValue, options.formControl.$modelValue, this) }}
          </div>
        </div>
      </div>
    `
  });
}
formlyConfig.$inject = ['formlyConfigProvider'];

function formlyRun (messages) {
  const addTemplate = messages.addTemplateOptionValueMessage;
  const addString = messages.addStringMessage;
  addTemplate('minlength', 'minlength', 'The minimum length for this field is ', '', 'Too short');
  addString('required', 'This field is required');
}
formlyRun.$inject = ['formlyValidationMessages'];

if (process.env.NODE_ENV === 'production') app.config(performance);
