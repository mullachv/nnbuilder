var FieldType;
(function (FieldType) {
    FieldType[FieldType["BOOL"] = 0] = "BOOL";
    FieldType[FieldType["INT"] = 1] = "INT";
    FieldType[FieldType["FLOAT"] = 2] = "FLOAT";
    FieldType[FieldType["STRING"] = 3] = "STRING";
    FieldType[FieldType["ENUMERATION"] = 4] = "ENUMERATION";
})(FieldType || (FieldType = {}));
var FieldSetting = (function () {
    function FieldSetting() {
    }
    return FieldSetting;
}());
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
function create_ConvNet2D_Settings() {
    var NumOutputField = new FieldSetting();
    NumOutputField.fieldlabel = 'Number of output';
    NumOutputField.fieldname = 'num_output';
    NumOutputField.fieldtype = FieldType.INT;
    NumOutputField.fieldrequired = true;
    var PadField = new FieldSetting();
    PadField.fieldlabel = 'Padding Size';
    PadField.fieldname = 'pad';
    PadField.fieldtype = FieldType.INT;
    PadField.fieldrequired = false;
    var KernelSizeField = new FieldSetting();
    KernelSizeField.fieldlabel = 'Kernel Size';
    KernelSizeField.fieldname = 'kernel_size';
    KernelSizeField.fieldtype = FieldType.INT;
    KernelSizeField.fieldrequired = true;
    var ConvNet2D_Settings = [];
    ConvNet2D_Settings.push(NumOutputField);
    ConvNet2D_Settings.push(PadField);
    ConvNet2D_Settings.push(KernelSizeField);
    return ConvNet2D_Settings;
}
function create_FullyConnected_Settings() {
    var NumOutputField = new FieldSetting();
    NumOutputField.fieldlabel = 'Number of output';
    NumOutputField.fieldname = 'num_output';
    NumOutputField.fieldtype = FieldType.INT;
    NumOutputField.fieldrequired = true;
    var FullyConnected_Settings = [];
    FullyConnected_Settings.push(NumOutputField);
    return FullyConnected_Settings;
}
function create_Dropout_Settings() {
    var DropoutField = new FieldSetting();
    DropoutField.fieldlabel = 'Dropout Fraction';
    DropoutField.fieldname = 'dropout_ratio';
    DropoutField.fieldtype = FieldType.FLOAT;
    DropoutField.fieldrequired = true;
    var Dropout_Settings = [];
    Dropout_Settings.push(DropoutField);
    return Dropout_Settings;
}
function create_ReLU_Settings() {
    var ReLU_Settings = [];
    return ReLU_Settings;
}
function create_Softmax_Settings() {
    var Softmax_Settings = [];
    return Softmax_Settings;
}
var PoolingType;
(function (PoolingType) {
    PoolingType[PoolingType["MAX"] = 0] = "MAX";
    PoolingType[PoolingType["MEAN"] = 1] = "MEAN";
    PoolingType[PoolingType["MIN"] = 2] = "MIN";
})(PoolingType || (PoolingType = {}));
function create_Pooling_Settings() {
    var PoolType = new FieldSetting();
    PoolType.fieldlabel = 'Pooling Type';
    PoolType.fieldname = 'pool_type';
    PoolType.fieldtype = FieldType.ENUMERATION;
    PoolType.fieldrequired = true;
    PoolType.fieldvaluechoices = [];
    PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MAX]);
    PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MIN]);
    PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MEAN]);
    var KernelSizeField = new FieldSetting();
    KernelSizeField.fieldlabel = 'Kernel Size';
    KernelSizeField.fieldname = 'kernel_size';
    KernelSizeField.fieldtype = FieldType.INT;
    KernelSizeField.fieldrequired = true;
    var StrideField = new FieldSetting();
    StrideField.fieldlabel = 'Stride Size';
    StrideField.fieldname = 'stride';
    StrideField.fieldtype = FieldType.INT;
    StrideField.fieldrequired = false;
    var Pooling_Settings = [];
    Pooling_Settings.push(PoolType);
    Pooling_Settings.push(KernelSizeField);
    Pooling_Settings.push(StrideField);
    return Pooling_Settings;
}
var common;
(function (common) {
    var availableComponentTypes = [];
    var availableFrameworks = [];
    var neuralNet = [];
    var nnSeqId = 1000;
    var scope;
    var helpTypeName = '';
    //export let screenvalues:any = [];
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
    function findItemIndex(ncid) {
        var index = 0;
        for (var _i = 0, neuralNet_1 = neuralNet; _i < neuralNet_1.length; _i++) {
            var nc = neuralNet_1[_i];
            if (nc.id == ncid) {
                return index;
            }
            index++;
        }
        return -1;
    }
    function getfielditems(ncid) {
        console.log('Looking for: ' + ncid);
        var index = findItemIndex(ncid);
        if (index == -1) {
            return null;
        }
        return neuralNet[index].settings;
    }
    common.getfielditems = getfielditems;
    function getfieldvaluesbyname(ncid) {
        console.log('Looking for: ' + ncid);
        var index = findItemIndex(ncid);
        if (index == -1) {
            return null;
        }
        var fvbyname = [{}];
        for (var _i = 0, _a = neuralNet[index].settings; _i < _a.length; _i++) {
            var it_1 = _a[_i];
            fvbyname[it_1.fieldname] = it_1.fieldvalue;
        }
        return fvbyname;
    }
    common.getfieldvaluesbyname = getfieldvaluesbyname;
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
        switch (NNComponentType[ct]) {
            case NNComponentType[NNComponentType.ConvNet2D]:
                nc.settings = create_ConvNet2D_Settings();
                break;
            case NNComponentType[NNComponentType.Pooling]:
                nc.settings = create_Pooling_Settings();
                break;
            case NNComponentType[NNComponentType.FullyConnected]:
                nc.settings = create_FullyConnected_Settings();
                break;
            case NNComponentType[NNComponentType.DropOut]:
                nc.settings = create_Dropout_Settings();
                break;
            case NNComponentType[NNComponentType.ReLU]:
                nc.settings = create_ReLU_Settings();
                break;
            case NNComponentType[NNComponentType.Softmax]:
                nc.settings = create_Softmax_Settings();
                break;
        }
        neuralNet.push(nc);
        nnSeqId++;
    }
    common.addToNN = addToNN;
    function removeFromNN(ncid) {
        var index = 0;
        for (var _i = 0, neuralNet_2 = neuralNet; _i < neuralNet_2.length; _i++) {
            var nc = neuralNet_2[_i];
            if (nc.id == ncid) {
                neuralNet.splice(index, 1);
                return;
            }
            index++;
        }
    }
    common.removeFromNN = removeFromNN;
    function saveNNCProps(ncid, userresponse) {
        var index = findItemIndex(ncid);
        if (index == -1) {
            return;
        }
        var nc = neuralNet[index];
        for (var key in userresponse) {
            setfieldvalue(nc, key, userresponse[key]);
        }
    }
    common.saveNNCProps = saveNNCProps;
    function setfieldvalue(nc, fieldname, fieldvalue) {
        for (var i = 0; i < nc.settings.length; i++) {
            if (nc.settings[i].fieldname == fieldname) {
                nc.settings[i].fieldvalue = fieldvalue;
                return;
            }
        }
    }
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
    }])
    .controller('EditDeleteCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.deleteComponent = function (ev, ncid) {
            //console.log('nncid: ' + ncid);
            $scope.common.removeFromNN(ncid);
        };
        $scope.editComponent = function ($event, ncid) {
            var pEl = angular.element(document.body);
            $mdDialog.show({
                parent: pEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '    <md-list>' +
                    '      <md-list-item ng-repeat="item in items">' +
                    '          <label>{{item.fieldlabel}}</label>' +
                    '            <input ng-model="CValues[item.fieldname]" size="10" placeholder="test..">' +
                    '      </md-list-item>' +
                    '    </md-list>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveDialog()" class="md-primary">' +
                    '      Save Dialog' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close Dialog' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    items: $scope.common.getfielditems(ncid),
                    fieldvalues: $scope.common.getfieldvaluesbyname(ncid)
                },
                controller: dlgController
            }).then(function (resp) {
                // console.log(resp);
                $scope.common.saveNNCProps(ncid, resp);
            }, function () {
                //otherwise -- close dialog
            });
            function dlgController($scope, $mdDialog, items, fieldvalues) {
                $scope.items = items;
                $scope.CValues = fieldvalues;
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.saveDialog = function () {
                    // console.log($scope.CValues);
                    $mdDialog.hide($scope.CValues);
                };
            }
        };
    }]);
