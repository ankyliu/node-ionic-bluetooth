angular.module('starter')
    .controller('DeviceController', function($scope, $state, $stateParams, DeviceFactory, $ionicLoading) {

        var me = this;

        var service_id = '12ab';
        var characteristic_id = '34cd';

        $scope.init = function() {
            $scope.device = DeviceFactory.getDevice($stateParams.id);
        }

        //LED ON Event
        $scope.led_on = function() {
            ble.isEnabled(
                function() {
                    // alert("bluetooth is available");
                }
            );

            var buf = [111, 110]; // -> on
            var data = new Uint16Array(buf);

            $ionicLoading.show({
                template: 'Sending...'
            });

            ble.write($stateParams.id, service_id, characteristic_id, data.buffer,
                function(response) {
                    console.log(response, ab2str(response));
                    //response = ab2str(response);
                    // alert("response: " + response);
                    if (response == 'OK') {
                        // ble.disconnect($stateParams.id);
                        // $state.go('home');
                        // alert('Send Success');
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: 'Success. LED turned on',
                            duration: 2000
                        });
                    } else {
                        // alert("response NOT OK");
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: 'Failed. LED was not turned on',
                            duration: 2000
                        });
                    }
                },
                function(err) {
                    // alert("Error occured. Please try again.");
                }
            );

            ble.read($stateParams.id, service_id, characteristic_id,
                function(success) {
                    // alert("Success: " + ab2str(success));
                    console.log(success, ab2str(success));
                },
                function(err) {
                    console.log(err);
                    // alert("Error occured. Please try again.");
                }
            );
        }

        //LED Off Event
        $scope.led_off = function() {

            ble.isEnabled(
                function() {
                    // alert("bluetooth is available");
                }
            );

            var buf = [111, 102, 102]; // -> off
            var data = new Uint16Array(buf);

            $ionicLoading.show({
                template: 'Sending...'
            });

            ble.write($stateParams.id, service_id, characteristic_id, data.buffer,
                function(response) {
                    console.log(response, ab2str(response));
                    if (response == 'OK') {
                        // ble.disconnect($stateParams.id);
                        // $state.go('home');
                        // alert('Send Success');
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: 'Success. LED turned off',
                            duration: 2000
                        });
                    } else {
                        // alert("response NOT OK");
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: 'Failed. LED was not turned off',
                            duration: 2000
                        });
                    }
                },
                function(err) {
                    console.log(err);
                    // alert("Error occured. Please try again.");
                }
            );

            ble.read($stateParams.id, service_id, characteristic_id,
                function(success) {
                    // alert("Success: " + ab2str(success));
                    console.log(success);
                },
                function(err) {
                    console.log(err);
                    // alert("Error occured. Please try again.");
                }
            );

        }

        $scope.backToHome = function() {
            $state.go('home');
            ble.disconnect($stateParams.id);
        }
    });


function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint16Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}