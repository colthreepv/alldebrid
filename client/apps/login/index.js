import '../../../css/index.scss';
import './login.scss';
import angular from 'angular';

const app = angular.module('login', []);

function run () {
  console.log('angular-login is running');
}

app.run(run);
