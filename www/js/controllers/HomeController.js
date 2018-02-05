angular.module('starter')
    .controller('HomeController', function($scope, $state, DeviceFactory, $ionicPlatform, $ionicLoading) {

        $scope.devices = []; // the devices listed in the page

        $scope.scan = function() {
            $scope.devices = [];
            DeviceFactory.reset();
            $ionicLoading.show({
                template: 'Scanning...'
            });
            ble.startScan(
                [],
                function(device) {
                    if (device.name) {
                        DeviceFactory.addDevice({ 'id': device.id, 'name': device.name });
                    }
                },
                function(err) {
                    alert('Scanning failed. Please try again.');
                    $ionicLoading.hide();
                }
            );

            setTimeout(
                ble.stopScan,
                1500,
                function() {
                    $scope.$apply(function() {
                        $scope.devices = DeviceFactory.getDevices();
                        $ionicLoading.hide();
                    });
                },
                function() {
                    alert('Stop Scanning failed. Please try again.');
                    $ionicLoading.hide();
                }
            );

        }

        $scope.connect = function(device_id) {
            ble.connect(
                device_id,
                function(res) {
                    console.log(res);
                    $state.go('device', { 'id': device_id });
                },
                function(err) {
                    console.log(err);
                    alert(err.errorMessage || 'Something went wrong while trying to connect. Please try again');
                }
            );
        }

        $ionicPlatform.ready(function() {
            $scope.scan();
        });
    });