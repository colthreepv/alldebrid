import angular from 'angular';

const app = angular.module('main', []);

function run () {
  console.log('angular-main is running');
}

app.run(run);
