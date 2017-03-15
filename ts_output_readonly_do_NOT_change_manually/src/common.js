var NNComponentType;
(function (NNComponentType) {
    NNComponentType[NNComponentType["ConvNet2D"] = 0] = "ConvNet2D";
    NNComponentType[NNComponentType["Pooling"] = 1] = "Pooling";
    NNComponentType[NNComponentType["FullyConnected"] = 2] = "FullyConnected";
    NNComponentType[NNComponentType["DropOut"] = 3] = "DropOut";
    NNComponentType[NNComponentType["ReLU"] = 4] = "ReLU";
    NNComponentType[NNComponentType["Softmax"] = 5] = "Softmax";
})(NNComponentType || (NNComponentType = {}));
var NNComponent = (function () {
    function NNComponent() {
    }
    NNComponent.prototype.getTypeName = function () {
        return NNComponentType[this.type];
    };
    NNComponent.prototype.getNNCButtonClass = function () {
        var ctype = NNComponentType[this.type];
        for (var _i = 0, _a = common.getAvailableComponentTypes(); _i < _a.length; _i++) {
            var ct = _a[_i];
            if (ctype == ct.typename) {
                return ct.btnclass;
            }
        }
        return '';
    };
    NNComponent.prototype.getNNCSpanClass = function (ix) {
        if (ix == 0) {
            return 'glyphicon glyphicon-wrench';
        }
        return 'glyphicon glyphicon-remove-sign';
    };
    return NNComponent;
}());
var PoolType;
(function (PoolType) {
    PoolType[PoolType["MAX"] = 0] = "MAX";
    PoolType[PoolType["MEAN"] = 1] = "MEAN";
})(PoolType || (PoolType = {}));
var common;
(function (common) {
    var availableComponentTypes = [];
    var availableFrameworks = [];
    var neuralNet = [];
    var nnSeqId = 1000;
    var scope;
    var helpTypeName = '';
    function init(rootScope) {
        scope = rootScope;
        //use $http service
        availableComponentTypes = [
            {
                typename: NNComponentType[NNComponentType.ConvNet2D],
                btnclass: 'btn btn-warning btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'A convolution operation applies a matrix dot product to the input matrix using a kernel matrix. \r\nThe kernel matrix is then shifted horizontal along the input matrix by stride pixels to compute the next overlapping matrix dot product.',
                typeurl: 'http://cs231n.github.io/convolutional-networks/#conv'
            },
            {
                typename: NNComponentType[NNComponentType.Pooling],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'Pooling simply returns a scalar value within typically a square area of a particular size \r\n from the input. This causes the size of the output to be scaled down by a factor. For instance, a maxpool over a \r\n size of 4x4 reduces the output by a factor of 4, with respect to the input.',
                typeurl: 'http://cs231n.github.io/convolutional-networks/#pool'
            },
            {
                typename: NNComponentType[NNComponentType.FullyConnected],
                btnclass: 'btn btn-info btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'Fully Connected layer connects all the input units from one layer to each of the units of the next layer.\r\nThis can be used to scale from certain number of units say 1024 at one layer to 256 units at the next layer.',
                typeurl: 'http://cs231n.github.io/convolutional-networks/#fc'
            },
            {
                typename: NNComponentType[NNComponentType.DropOut],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'Drop out layer affords the appearance of training on an ensemble of networks, by simply choosing to omit \r\n a certain fraction of outputs. Usually specified as a fraction, which is akin to eliminating that \r\n  unit from the network as many times, during forward and backward propagation.',
                typeurl: 'https://en.wikipedia.org/wiki/Convolutional_neural_network#Dropout'
            },
            {
                typename: NNComponentType[NNComponentType.ReLU],
                btnclass: 'btn btn-primary btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'ReLU is a rectified linear unit and it works on a real scalar by returning zero when negative, \r\n otherwise the scalar\'s value.',
                typeurl: 'http://cs231n.github.io/convolutional-networks/#conv'
            },
            {
                typename: NNComponentType[NNComponentType.Softmax],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'Softmax layer computes probability distribution of across each of the inputs using softmax function \r\n',
                typeurl: 'https://en.wikipedia.org/wiki/Softmax_function'
            }
        ];
        availableFrameworks = ['PyTorch', 'Torch', 'Tensorflow'];
    }
    common.init = init;
    function getCurrentComponents() {
        return neuralNet;
    }
    common.getCurrentComponents = getCurrentComponents;
    function addToNN(ct) {
        console.log('Adding ct: ' + NNComponentType[ct]);
        //create a new NNComponent
        var nc = new NNComponent();
        nc.type = ct;
        nc.id = nnSeqId;
        nc.name = NNComponentType[ct] + "_" + nc.id;
        neuralNet.push(nc);
        nnSeqId++;
    }
    common.addToNN = addToNN;
    function updateUI() {
        scope.$apply();
    }
    common.updateUI = updateUI;
    function describeComponent(typename) {
        helpTypeName = typename;
    }
    common.describeComponent = describeComponent;
    function showHelp(typename) {
        if (helpTypeName == typename) {
            return true;
        }
        return false;
    }
    common.showHelp = showHelp;
    function getAvailableComponentTypes() {
        return availableComponentTypes;
    }
    common.getAvailableComponentTypes = getAvailableComponentTypes;
    function getAvailableFrameworks() {
        return availableFrameworks;
    }
    common.getAvailableFrameworks = getAvailableFrameworks;
})(common || (common = {}));
angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngSanitize'])
    .run(['$rootScope', '$templateCache', function ($rootScope, $templateCache) {
        $templateCache.put('myApp', 'myApp');
        $rootScope['common'] = common;
        common.init($rootScope);
    }])
    .directive('draggable', function () {
    return function (scope, element, attrs) {
        var el = element[0];
        el.draggable = true;
        el.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'move';
            //data-nnctype attribute of the <button> element
            e.dataTransfer.setData('NNComponentType', this.dataset.nnctype);
            this.classList.add('dragging');
            return false;
        }, false);
        el.addEventListener('dragend', function (e) {
            this.classList.remove('dragging');
            return false;
        }, false);
    };
})
    .directive('droppable', function () {
    return function (scope, element, attrs) {
        var el = element[0];
        el.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('dragover');
            return false;
        }, false);
        el.addEventListener('dragenter', function (e) {
            this.classList.add('dragover');
            return false;
        }, false);
        el.addEventListener('dragleave', function (e) {
            this.classList.remove('dragover');
            return false;
        }, false);
        el.addEventListener('drop', function (e) {
            this.classList.remove('dragover');
            //Add to Neural Net
            var ct = NNComponentType[e.dataTransfer.getData('NNComponentType')];
            //console.log(ct);
            scope.common.addToNN(ct);
            scope.common.updateUI();
            //
            return false;
        }, false);
    };
})
    .controller('DialogCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.status = '  ';
        $scope.customFullscreen = false;
        $scope.showAlert = function (ev, typename, typedescription, typeurl) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show($mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(typename)
                .htmlContent(typedescription + ' <a href="' + typeurl + '" target="_blank">More Info</a>')
                .ok('Got it!')
                .targetEvent(ev));
        };
        $scope.showAdvanced = function (ev, typename) {
            var templateUrl = 'dialog1.' + typename + '.tmpl.html';
            $mdDialog.show({
                controller: DialogController,
                templateUrl: templateUrl,
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        };
        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
    }]);
