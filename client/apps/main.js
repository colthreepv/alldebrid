import '../../css/index.scss';
import angular from 'angular';
import 'angular-ui-router';

const app = angular.module('main', ['ui.router']);

function run () {
  console.log('angular-main is running');
}

app.run(run);
