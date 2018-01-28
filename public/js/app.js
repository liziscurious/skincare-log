const app = angular.module('SkincareLog', []);

app.controller('MainController', ['$http', function($http){

  this.message = 'How many steps are in your routine?';
  this.url = 'http://localhost:3000/';
  // this.url = 'https://skincare-log-api.herokuapp.com/'
  this.user = {};
  this.categories = [];
  this.user = {};
  this.currentLogEntries = {};
  this.userLogs = {};
  this.newProduct = {};

  this.showLogInForm = false;
  this.showCategories = false;
  this.showOneCategory = false;
  this.showRegisterForm = false;
  this.loggedIn = false;
  this.landing = true;
  this.addLog = false;
  this.showUserLogs = false;
  this.showAddProductForm = false;
  this.showAddedProduct = false;
  this.showEditProductForm = false;
  this.showEditedProduct = false;
  this.updatedProduct = [];
  this.allProducts = {};

  this.createUser = (userRegister) => {
    $http({
      method: 'POST',
      url: this.url + 'users',
      data: { user: { username: userRegister.username, password: userRegister.password }}
    }).then(response => {
      if (response.data.status === 401){
        this.error = "Username or Password Incorrect";
      } else {
        this.user = response.data.user;
        console.log('Logged in user is ', this.user.username, '. User ID is ', this.user.id);
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.loggedIn = true;
        this.showRegisterForm = false;
      };
    });
  };

  this.login = (userPass) => {
    $http({
      method: 'POST',
      url: this.url + 'users/login',
      data: { user: { username: userPass.username, password: userPass.password }}
    }).then(response => {
      if (response.data.status === 401) {
        this.error = "Unauthorized";
      } else {
        this.user = response.data.user;
        console.log('Logged in user is ', this.user.username, '. User ID is ', this.user.id);
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
    this.user = {};
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
  };

  this.getAllProducts = () => {
    $http({
      method: 'GET',
      url: this.url + 'products'
    }).then(response => {
      // console.log(response.data);
      this.allProducts = response.data;
      console.log(this.allProducts);
    })
  };

  this.addNewProduct = (formData) => {
    this.newProduct = formData;
    $http({
      method: 'POST',
      url: this.url + 'products/',
      data: {
        brand: this.newProduct.brand,
        name: this.newProduct.name,
        category_id: this.newProduct.category_id
      }
    }).then(response => {
      this.addedProduct = response.data;
      console.log('New product added is: ', this.addedProduct);
      this.showAddedProduct = true;
      this.formData = {};
      this.getAllProducts();
    }).catch(err => console.log(err));
  };

  this.editOneProduct = (formData) => {
    // console.log(this.prodToEdit);
    this.editedProduct = formData;
    $http({
      method: 'PUT',
      url: this.url + 'products/' + this.prodToEdit.id,
      data: {
        brand: this.editedProduct.brand,
        name: this.editedProduct.name
      }
    }).then(response => {
      this.showEditedProduct = true;
      this.updatedProduct = response.data;
      console.log('Updated product is: ', this.updatedProduct);
      this.getAllProducts();
    }).catch(err => console.log(err));
  };

  this.getLogs = () => {
    $http({
      method: 'GET',
      url: this.url + 'users/' + this.user.id + '/logs'
    }).then(response => {
      this.userLogs = response.data;
      this.showUserLogs = true;
      console.log(this.userLogs);
    }).catch(err => console.log(err));
  };

  this.getOneLog = (log) => {
    $http({
      method: 'GET',
      url: this.url + 'users/' + this.user.id + '/logs/' + log.id
    }).then(response => {
      this.oneLog = response.data;
      console.log(this.oneLog);
    }).catch(err => console.log(err));
  };

  this.addNewLog = () => {
    console.log(this.user.id);
    $http({
      method: 'POST',
      url: this.url + 'users/' + this.user.id + '/logs',
      data: {
        name: this.newLog.name,
        user_id: this.user.id
      }
    }).then(response => {
      this.currentLog = response.data;
      console.log(this.currentLog);
      this.showCategories = true;
    }).catch(err => console.log(err));
  };

  this.addNewEntry = (prod) => {
    console.log('Adding to this log ', this.currentLog);
    this.newEntry = prod;
    console.log(this.newEntry);
    $http({
      method: 'POST',
      url: this.url + 'users/' + this.user.id + '/logs/' + this.currentLog.id + '/entries',
      data: {
        log_id: this.currentLog.id,
        product_id: this.newEntry
      }
    }).then(response => {
      console.log('New entry has been posted!');
      // this.newProductEntry = response.data;
      // this.currentLogEntries.push(this.newProductEntry);
      // console.log(this.currentLogEntries);
      // posting properly, not pushing into front end yet
    }).catch(err => console.log(err));
  };

}]);
