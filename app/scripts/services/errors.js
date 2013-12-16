'use strict';

angular.module('ipv6App')
     .service('Errors', function Errors() {
     var errors = [];

     function addError(error) {
          errors.push(error);
     }

     function resetErrors() {
          errors = [];
     }

     return {
          getErrors: function() {
               return errors;
          },
          addError: addError,
          resetErrors: resetErrors
     };

});
