const app = angular.module('SkincareLog', []);

app.controller('MainController', ['$http', function($http){

  this.message = 'How many steps are in your routine?';
  this.url = 'http://localhost:3000/';
  this.user = {};
  this.showLogInForm = false;
  this.showCategories = false;
  this.categories = [];

  this.login = function(userPass) {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }},
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    }.bind(this));
  };

  this.getUsers = function() {
    $http({
      url: this.url + '/users',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
      console.log(response);
      if (response.data.status == 401) {
          this.error = "Unauthorized";
      } else {
        this.users = response.data;
      }
    }.bind(this));
  };

  this.logout = function () {
    localStorage.clear('token');
    location.reload();
  };

  // Show All Categories Route
  this.getCategories = () => {
    $http({
      method: 'GET',
      url: this.url + 'categories'
    }).then(response => {
      this.categories = response.data;
      console.log(this.categories);
    }).catch(err => console.log(err));
  };

  this.getCategories();

}]);
