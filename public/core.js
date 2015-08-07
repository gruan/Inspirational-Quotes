var georgeInspirationalQuotes = angular.module('georgeInspirationalQuotes', []);

georgeInspirationalQuotes.controller('mainController', ['$scope', '$http', '$interval', function($scope, $http, $interval) {

  $scope.formData = {};
  $scope.quotes = [];                 // Array of quotes objects
  $scope.quoteDisplay = {             // Actual quote string is in quoteDisplay.text
    text: ''
  };

  /**
   * Gets a random quote from the list of quotes in the quote array
   * @return {void}
   */
  $scope.getAnotherRandomQuote = function() {
    var maxRand = $scope.quotes.length;
    var index = Math.floor(Math.random() * maxRand);
    $scope.quoteDisplay = $scope.quotes[index];
  };


  // When landing on the page, get all quotes and show them
  $http.get('/api/quotes')
    .success(function(data) {
      $scope.quotes = data;
      console.log($scope.quotes);

      // Get the initial quote
      $scope.getAnotherRandomQuote();
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // When submitting the add form, send the text to the node API
  $scope.createQuote = function() {
    $http.post('/api/quotes', $scope.formData)
      .success(function(data) {
        $scope.formData = {};
        $scope.quotes = data;
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Delete a quote after checking it
  $scope.deleteQuote = function(id) {
    $http.delete('/api/quotes/' + id)
      .success(function(data) {
        $scope.quotes = data;
        console.log(data);
        $scope.getAnotherRandomQuote();
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // Get a random quote every timeDelay ms.
  var timeDelay = 5000;
  $interval($scope.getAnotherRandomQuote, timeDelay, 0);
}])
