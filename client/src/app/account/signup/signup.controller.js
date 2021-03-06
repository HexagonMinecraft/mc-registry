'use strict';

angular.module('app')
    .controller('SignupCtrl', function ($scope, $http, auth, $state, $window) {
        $scope.user = {};
        $scope.signup = function (user, isValid) {
            if (isValid) {
                auth.signup(user)
                    .then(function (res) {
                        Materialize.toast('Signup success!', 4000);
                        $scope.success = true;
                    })
                    .catch(function (err) {
                        if (err.status === 409) {
                            return Materialize.toast(err.data.message, 4000);
                        }
                        return Materialize.toast(err.statusText, 4000);
                    });
            }
        }
    });
