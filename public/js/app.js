const app = angular.module('SkincareLog', []);

app.controller('MainController', ['$http', function($http){

  this.url = 'http://localhost:3000/';
  // this.url = 'https://skincare-log-api.herokuapp.com/'
  this.user = {};
  this.error = null;
  this.categories = [];
  this.user = {};
  this.currentLog = {};
  this.currentLogEntries = {};
  this.userLogs = {};
  this.newProduct = {};
  this.updatedProduct = [];
  this.allProducts = {};
  this.logToEdit = {};
  this.deleteLogId = null;

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
  this.showEditLogName = false;
  this.showDeletePrompt = false;


  this.createUser = (userRegister) => {
    $http({
      method: 'POST',
      url: this.url + 'users',
      data: { user: { username: userRegister.username, password: userRegister.password }}
    }).then(response => {
      if (response.data.status === 401){
        this.error = "Oops try again!"
      } else {
        this.user = response.data.user;
        console.log('Logged in user is ', this.user.username, '. User ID is ', this.user.id);
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.loggedIn = true;
        this.showRegisterForm = false;
        this.error = null;
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
        this.error = "Username or Password Incorrect";
      } else {
        this.user = response.data.user;
        console.log('Logged in user is ', this.user.username, '. User ID is ', this.user.id);
        localStorage.setItem('token', JSON.stringify(response.data.token));
        this.loggedIn = true;
        this.showLogInForm = false;
        this.error = null;
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
    }).catch(err => console.log(err));
  };

  this.getOneLog = (log) => {
    $http({
      method: 'GET',
      url: this.url + 'users/' + this.user.id + '/logs/' + log.id
    }).then(response => {
      this.oneLog = response.data;
    }).catch(err => console.log(err));
  };

  this.addNewLog = () => {
    $http({
      method: 'POST',
      url: this.url + 'users/' + this.user.id + '/logs',
      data: {
        name: this.newLog.name,
        user_id: this.user.id
      }
    }).then(response => {
      this.currentLog = response.data;
      this.showCategories = true;
    }).catch(err => console.log(err));
  };

  this.editLogName = (formData) => {
    $http({
      method: 'PUT',
      url: this.url + 'users/' + this.user.id + '/logs/' + this.currentLog.id,
      data: { name: formData.name }
    }).then(response => {
      this.currentLog = response.data;
      this.getOneLog(this.currentLog);
      this.formData = {};
    }).catch(err => console.log(err));
  };

  this.deleteLog = (formData) => {
    this.deleteLogId = formData;
    $http({
      method: 'DELETE',
      url: this.url +'users/' + this.user.id + '/logs/' + this.deleteLogId,
    }).then(response => {
      this.showDeletePrompt = false;
      this.deleteLogId = null;
      this.getLogs();
    }).catch(err => console.log(err));
  };

  this.addNewEntry = (prod) => {
    this.newEntry = prod;
    $http({
      method: 'POST',
      url: this.url + 'users/' + this.user.id + '/logs/' + this.currentLog.id + '/entries',
      data: {
        log_id: this.currentLog.id,
        product_id: this.newEntry
      }
    }).then(response => {
      this.getLogs();
      this.getOneLog(this.currentLog);
    }).catch(err => console.log(err));
  };

  // this.deleteEntry = (log, entry) => {
  //   this.deleteOneEntry = entry;
  //   console.log(this.deleteOneEntry);
  //   console.log(log);
  //   console.log(this.currentLog);
  // };

}]);
