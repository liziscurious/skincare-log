const app = angular.module('SkincareLog', []);

app.controller('MainController', ['$http', function($http){

  this.message = 'How many steps are in your routine?';
  this.url = 'http://localhost:3000/';
  this.user = {};
  this.showLogInForm = false;
  this.showCategories = false;
  this.showOneCategory = false;
  this.categories = [];
  this.showRegisterForm = false;
  this.loggedIn = false;
  this.landing = true;
  this.addLog = false;
  this.tempLog = [];
  this.tempProduct = null;

  this.createUser = (userRegister) => {
    console.log(userRegister);
    $http({
      method: 'POST',
      url: this.url + 'users',
      data: { user: { username: userRegister.username, password: userRegister.password }}
    }).then(response => {
      if (response.data.status === 401){
        this.error = "Username or Password Incorrect";
      } else {
        this.user = response.data.user;
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.loggedIn = true;
        this.showRegisterForm = false;
        console.log('It works!');
      };
    });
  };

  this.login = (userPass) => {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + 'users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(response => {
      console.log(response);
      if (response.data.status === 401) {
        this.error = "Unauthorized";
      } else {
        this.user = response.data.user;
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.loggedIn = true;
        this.showLogInForm = false;
      };
    });
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
    }).catch(err => console.log(err));
  };

  this.getCategories();

  this.getOneCategory = (category) => {
    this.oneCategoryId = category.id
    $http({
      method: 'GET',
      url: this.url + 'categories/' + this.oneCategoryId
    }).then (response => {
      this.oneCategory = response.data;
      this.showOneCategory = true;
    }).catch(err => console.log(err));
  }

  this.addToTempLog = (productId) => {
    this.tempProduct = productId;
    console.log(this.tempProduct);
    this.tempLog.push(this.tempProduct);
    console.log(this.tempLog);
  };

}]);
