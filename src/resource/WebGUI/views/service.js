angular.module('mrlapp.service', [])

        .directive('serviceBody', [function () {
                return {
                    scope: {
                        name: '=name',
                        inst: '=inst'
                    },
                    link: function (scope, elem, attr) {
                        scope.getContentUrl = function () {
                            return 'services/views/' + attr.type + 'gui.html';
                        };
                    },
                    template: '<div ng-include="getContentUrl()"></div>'
                };
            }])

        .controller('ServiceCtrl', ['$scope', '$modal', 'ServiceControllerService', function ($scope, $modal, ServiceControllerService) {
                $scope.name = $scope.list[$scope.index].name;
                $scope.drag = $scope.list[$scope.index].drag;
                $scope.type = $scope.list[$scope.index].type;

                //START_specific Service-Initialisation
                //"inst" is given to the specific service-UI
                $scope.inst = ServiceControllerService.getServiceInst($scope.name);
                if ($scope.inst == null) {
                    $scope.inst = {};
                    $scope.inst.fw = {}; //framework-section - DO NOT WRITE IN THERE!
                    $scope.inst.data = {}; //data-section
                    $scope.inst.methods = {}; //methods-section
                    ServiceControllerService.addService($scope.name, $scope.inst);
                }
                console.log("$scope,size", $scope.size);
                if ($scope.size != null && $scope.size.lastIndexOf("force", 0) == 0) {
                    $scope.inst.fw.oldsize = $scope.inst.fw.size;
                    $scope.inst.fw.size = $scope.size.substring(5, $scope.size.length);
                    $scope.inst.fw.forcesize = true;
                } else {
                    if ($scope.inst.fw.oldsize != null) {
                        $scope.inst.fw.size = $scope.inst.fw.oldsize;
                        $scope.inst.fw.oldsize = null;
                    }
                    $scope.inst.fw.forcesize = false;
                }
                if (!$scope.inst.fw.size) {
                    $scope.inst.fw.size = "medium";
                    $scope.inst.fw.oldsize = null;
                }
                //TODO: add whatever service-specific functions are needed (init, ...)
                //attachGUI(), detachGUI(), send(method, data), sendTo(name, method, data),
                //subscribe(inMethod, outMethod), subscribeTo(publisherName, inMethod, outMethod),
                //key(inStr), releaseService(), serviceGUIInit(), broadcastState()
                $scope.inst.fw.send = function (method, data) {
                    $scope.inst.fw.sendTo($scope.name, method, data);
                };
                $scope.inst.fw.sendTo = function (name, method, data) {
                    ServiceControllerService.sendTo(name, method, data);
                };
                $scope.inst.fw.subscribe = function (inMethod, outMethod) {
                    //TODO
                };
                $scope.inst.fw.subscribeTo = function (publisherName, inMethod, outMethod) {
                    //TODO
                };
                //END_specific Service-Initialisation

                //footer-size-change-buttons
                $scope.changesize = function (size) {
                    console.log("button clicked", size);
                    $scope.inst.fw.oldsize = $scope.inst.fw.size;
                    $scope.inst.fw.size = size;
                    if (size == "full") {
                        //launch the service as a modal ('full')
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'views/servicefulltemplate.html',
                            controller: 'ServiceFullCtrl',
                            size: 'lg',
                            resolve: {
                                name: function () {
                                    return $scope.name;
                                },
                                type: function () {
                                    return $scope.type;
                                },
                                inst: function () {
                                    return $scope.inst;
                                }
                            }
                        });
                        //modal closed -> recover to old size
                        modalInstance.result.then(function () {
                            $scope.inst.fw.size = $scope.inst.fw.oldsize;
                            $scope.inst.fw.oldsize = null;
                        });
                    }
                };
            }])

        .controller('ServiceFullCtrl', function ($scope, $modalInstance, name, type, inst) {
            //Controller for the modal (service-full)

            $scope.name = name;
            $scope.type = type;
            $scope.inst = inst;

            $scope.modal = true;

            console.log("servicefullctrl", $scope.name, $scope.type, $scope.inst);

            $scope.close = function () {
                $modalInstance.close();
            };
        });