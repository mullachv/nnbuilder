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
    NNComponentType[NNComponentType["Convolution"] = 0] = "Convolution";
    NNComponentType[NNComponentType["Pooling"] = 1] = "Pooling";
    NNComponentType[NNComponentType["FullyConnected"] = 2] = "FullyConnected";
    // DropOut,
    // ReLU,
    NNComponentType[NNComponentType["Softmax"] = 3] = "Softmax";
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
    //create sublayer from super's props
    NNComponent.prototype.getSubLayer = function (n, y) {
        var layer = {};
        layer.name = y + n.substring(n.lastIndexOf("_"));
        layer.top = n;
        layer.bottom = n;
        layer.type = y;
        //console.log('sublayer:' + JSON.stringify(layer));
        return layer;
    };
    NNComponent.prototype.convertToJSON = function () {
        var layers = [];
        var layer = {};
        layer.name = this.name;
        layer.top = this.name;
        var scvalues = common.getfieldvaluesbyname(this.id);
        switch (NNComponentType[this.type]) {
            case NNComponentType[NNComponentType.Convolution]:
                layer.type = "CONVOLUTION";
                layer.convolution_param = {
                    num_output: scvalues['num_output'],
                    pad: scvalues['pad'],
                    kernel_size: scvalues['kernel_size']
                };
                var sublayer = this.getSubLayer(layer.name, scvalues['activation']);
                layers.push(layer);
                layers.push(sublayer);
                break;
            case NNComponentType[NNComponentType.Pooling]:
                layer.type = "POOLING";
                layer.pooling_param = {
                    pool: scvalues['pool_type'],
                    kernel_size: scvalues['kernel_size'],
                    stride: scvalues['stride']
                };
                layers.push(layer);
                break;
            case NNComponentType[NNComponentType.FullyConnected]:
                layer.type = "INNER_PRODUCT";
                layer.inner_product_param = {
                    num_output: scvalues['num_output']
                };
                layers.push(layer);
                break;
            // case NNComponentType[NNComponentType.DropOut]:
            //   layer.type = "DROPOUT";
            //   layer.dropout_param = {
            //     dropout_ratio: scvalues['dropout_ratio']
            //   };
            //   layers.push(layer);
            //   break;
            // case NNComponentType[NNComponentType.ReLU]:
            //   layer.type = "RELU";
            //   layers.push(layer);
            //   break;
            case NNComponentType[NNComponentType.Softmax]:
                layer.type = "SOFTMAX";
                layers.push(layer);
                break;
        }
        return layers;
    };
    return NNComponent;
}());
function get_user_response_for_type(ctype) {
    switch (NNComponentType[ctype]) {
        case NNComponentType[NNComponentType.Convolution]:
            return {
                num_output: 0,
                pad: 0,
                kernel_size: 0
            };
        case NNComponentType[NNComponentType.Pooling]:
            return {
                pool: '',
                kernel_size: 0,
                stride: 0
            };
        case NNComponentType[NNComponentType.FullyConnected]:
            return {
                num_output: 0
            };
        // case NNComponentType[NNComponentType.DropOut]:
        //   return {
        //     dropout_ratio: 0
        //   };
        // case NNComponentType[NNComponentType.ReLU]:
        //   return {};
        case NNComponentType[NNComponentType.Softmax]:
            return {};
    }
}
var ActivationType;
(function (ActivationType) {
    ActivationType[ActivationType["RELU"] = 0] = "RELU";
    ActivationType[ActivationType["SIGMOID"] = 1] = "SIGMOID";
    ActivationType[ActivationType["TANH"] = 2] = "TANH";
    ActivationType[ActivationType["LEAKYRELU"] = 3] = "LEAKYRELU";
})(ActivationType || (ActivationType = {}));
function create_Convolution_Settings() {
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
    var ActivationField = new FieldSetting();
    ActivationField.fieldlabel = 'Activation Type';
    ActivationField.fieldname = 'activation';
    ActivationField.fieldtype = FieldType.ENUMERATION;
    ActivationField.fieldvaluechoices = [];
    ActivationField.fieldvaluechoices.push(ActivationType[ActivationType.RELU]);
    ActivationField.fieldvaluechoices.push(ActivationType[ActivationType.SIGMOID]);
    ActivationField.fieldvaluechoices.push(ActivationType[ActivationType.TANH]);
    ActivationField.fieldvaluechoices.push(ActivationType[ActivationType.LEAKYRELU]);
    ActivationField.fieldrequired = true;
    var Convolution_Settings = [];
    Convolution_Settings.push(NumOutputField);
    Convolution_Settings.push(PadField);
    Convolution_Settings.push(KernelSizeField);
    Convolution_Settings.push(ActivationField);
    return Convolution_Settings;
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
// function create_Dropout_Settings() {
//   let DropoutField:FieldSetting = new FieldSetting();
//   DropoutField.fieldlabel = 'Dropout Fraction';
//   DropoutField.fieldname = 'dropout_ratio';
//   DropoutField.fieldtype = FieldType.FLOAT;
//   DropoutField.fieldrequired = true;
//
//   let Dropout_Settings:FieldSetting[] = [];
//   Dropout_Settings.push(DropoutField);
//
//   return Dropout_Settings;
// }
// function create_ReLU_Settings() {
//   let ReLU_Settings:FieldSetting[] = [];
//   return ReLU_Settings;
// }
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
    var net_name = "";
    var net_dataset;
    function init(rootScope) {
        scope = rootScope;
        //use $http service
        availableComponentTypes = [
            {
                typename: NNComponentType[NNComponentType.Convolution],
                btnclass: 'btn btn-warning btn-large',
                spanclass: 'glyphicon glyphicon-question-sign',
                typedescription: 'A convolution operation applies a matrix dot product to the input matrix using a kernel matrix. \r\nThe kernel matrix is then shifted horizontal along the input matrix by stride pixels to compute the next overlapping matrix dot product.',
                typeurl: 'http://cs231n.github.io/convolutional-networks/#conv'
            },
            {
                typename: NNComponentType[NNComponentType.Pooling],
                btnclass: 'btn btn-primary btn-large',
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
            // {
            //   typename: NNComponentType[NNComponentType.DropOut],
            //   btnclass: 'btn btn-success btn-large',
            //   spanclass: 'glyphicon glyphicon-question-sign',
            //   typedescription: 'Drop out layer affords the appearance of training on an ensemble of networks, by simply choosing to omit \r\n a certain fraction of outputs. Usually specified as a fraction, which is akin to eliminating that \r\n  unit from the network as many times, during forward and backward propagation.',
            //   typeurl: 'https://en.wikipedia.org/wiki/Convolutional_neural_network#Dropout'
            // },
            // {
            //   typename: NNComponentType[NNComponentType.ReLU],
            //   btnclass: 'btn btn-primary btn-large',
            //   spanclass: 'glyphicon glyphicon-question-sign',
            //   typedescription: 'ReLU is a rectified linear unit and it works on a real scalar by returning zero when negative, \r\n otherwise the scalar\'s value.',
            //   typeurl: 'http://cs231n.github.io/convolutional-networks/#conv'
            // },
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
        var index = findItemIndex(ncid);
        if (index == -1) {
            return null;
        }
        return neuralNet[index].settings;
    }
    common.getfielditems = getfielditems;
    function getfieldvaluesbyname(ncid) {
        var index = findItemIndex(ncid);
        if (index == -1) {
            return null;
        }
        // let fvbyname = [];
        // for (let it of neuralNet[index].settings) {
        //   fvbyname[<any>it.fieldname] = it.fieldvalue;
        // }
        var fvbyname = {};
        for (var _i = 0, _a = neuralNet[index].settings; _i < _a.length; _i++) {
            var it_1 = _a[_i];
            fvbyname[it_1.fieldname] = it_1.fieldvalue;
        }
        // console.log(fvbyname);
        // console.log(JSON.stringify(fvbyname));
        return fvbyname;
    }
    common.getfieldvaluesbyname = getfieldvaluesbyname;
    function getCurrentComponents() {
        return neuralNet;
    }
    common.getCurrentComponents = getCurrentComponents;
    function addToNN(ct) {
        //console.log('Adding ct: ' + NNComponentType[ct]);
        //create a new NNComponent
        var nc = new NNComponent();
        nc.type = ct;
        nc.id = nnSeqId;
        nc.name = NNComponentType[ct] + "_" + nc.id;
        switch (NNComponentType[ct]) {
            case NNComponentType[NNComponentType.Convolution]:
                nc.settings = create_Convolution_Settings();
                break;
            case NNComponentType[NNComponentType.Pooling]:
                nc.settings = create_Pooling_Settings();
                break;
            case NNComponentType[NNComponentType.FullyConnected]:
                nc.settings = create_FullyConnected_Settings();
                break;
            // case NNComponentType[NNComponentType.DropOut]: nc.settings = create_Dropout_Settings(); break;
            // case NNComponentType[NNComponentType.ReLU]: nc.settings = create_ReLU_Settings(); break;
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
    function removeAllComponents() {
        neuralNet = [];
    }
    common.removeAllComponents = removeAllComponents;
    function reset() {
        removeAllComponents();
        nnSeqId = 1000;
    }
    common.reset = reset;
    // export function getNNComponentAsString(ncid:number) {
    //   let index = findItemIndex(ncid);
    //   if (index == -1) {
    //       return '';
    //   }
    //   return JSON.stringify(neuralNet[index]);
    // }
    function saveNNCProps(ncid, userresponse) {
        //console.log(userresponse);
        var index = findItemIndex(ncid);
        if (index == -1) {
            return;
        }
        var nc = neuralNet[index];
        for (var key in userresponse) {
            //console.log('setting k: ' + key + ' v: ' + JSON.stringify(userresponse[key]));
            setfieldvalue(nc, key, userresponse[key]);
        }
    }
    common.saveNNCProps = saveNNCProps;
    function setfieldvalue(nc, fieldname, fieldvalue) {
        for (var i = 0; i < nc.settings.length; i++) {
            if (nc.settings[i].fieldname == fieldname) {
                nc.settings[i].fieldvalue = fieldvalue;
                //console.log('Value set: ' + nc.settings[i].fieldname + ' to: ' + nc.settings[i].fieldvalue);
                return;
            }
        }
    }
    function updateUI() {
        scope.$apply();
    }
    common.updateUI = updateUI;
    function setDataSet() {
        //NN dataset
    }
    common.setDataSet = setDataSet;
    function getinputdims() {
        if (net_dataset) {
            //dataset input dimensions
            return [1, 2, 3];
        }
        return [];
    }
    function prepadZero(pp) {
        if (pp < 10) {
            return '0' + pp;
        }
        return '' + pp;
    }
    function nnProtoHeaders() {
        var d = new Date();
        var header = "name:" + "NN_" + d.getFullYear() + prepadZero(d.getMonth() + 1)
            + prepadZero(d.getDate()) + "_" + prepadZero(d.getHours())
            + prepadZero(d.getMinutes()) + prepadZero(d.getSeconds()) + "_" + net_name + "_"
            + neuralNet.length + "_layers\n";
        header += "input: \"data\"\n";
        for (var _i = 0, _a = getinputdims(); _i < _a.length; _i++) {
            var dim = _a[_i];
            header += "input_dim: " + dim + "\n";
        }
        return header;
    }
    function generateProto() {
        var comps = [];
        var prevlayer;
        var prototxt = nnProtoHeaders();
        for (var _i = 0, neuralNet_3 = neuralNet; _i < neuralNet_3.length; _i++) {
            var comp = neuralNet_3[_i];
            var layers = comp.convertToJSON();
            if (!prevlayer) {
                layers[0].bottom = "data";
            }
            else {
                layers[0].bottom = prevlayer.name;
            }
            prototxt += "layers " + JSON.stringify(layers[0]) + "\n";
            if (layers[1]) {
                prototxt += "layers " + JSON.stringify(layers[1]) + "\n";
            }
            prevlayer = layers[0];
        }
        return prototxt;
    }
    common.generateProto = generateProto;
    function getAvailableComponentTypes() {
        return availableComponentTypes;
    }
    common.getAvailableComponentTypes = getAvailableComponentTypes;
    function getAvailableFrameworks() {
        return availableFrameworks;
    }
    common.getAvailableFrameworks = getAvailableFrameworks;
})(common || (common = {}));
angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngSanitize', 'ngResource'])
    .run(['$rootScope', '$templateCache', '$log', function ($rootScope, $templateCache, $log) {
        $templateCache.put('myApp', 'myApp');
        $rootScope['common'] = common;
        common.init($rootScope);
        $log.info("myApp Started");
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
        $scope.showInfo = function (ev, typename, typedescription, typeurl) {
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
                    '            <div ng-if="!isEnumType(item.fieldtype)">  ' +
                    '              <input ng-model="CValues[item.fieldname]" size="10" placeholder="test..">' +
                    '            </div>' +
                    '            <div ng-if="isEnumType(item.fieldtype)">  ' +
                    '              <select ng-model="CValues[item.fieldname]" ng-options="choice for choice in item.fieldvaluechoices"></select>' +
                    '            </div>' +
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
                    $mdDialog.hide($scope.CValues);
                };
                $scope.isEnumType = function (fieldtype) {
                    if (fieldtype == FieldType.ENUMERATION)
                        return true;
                    return false;
                };
            }
        };
    }])
    .directive('generateProto', function () {
    return {
        restrict: 'E',
        template: '<a href="" class="btn btn-primary btn-lg" ng-click="downloadJson()">Download Prototxt</a>',
        scope: true,
        link: function (scope, element, attr) {
            var anchor = element.children()[0];
            // When the download starts, disable the link
            scope.$on('download-start', function () {
                console.log('download-start event');
                $(anchor).attr('disabled', 'disabled');
            });
            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('downloaded', function (event, data) {
                console.log('on downloaded');
                $(anchor).attr({
                    href: 'data:application/test;base64,' + data,
                    download: attr.filename
                })
                    .removeAttr('disabled');
                // .text('Save')
                // .removeClass('btn-primary')
                // .addClass('btn-success');
                //Also overwrite the download pdf function to do nothing.
                // scope.downloadJson = function() {
                //
                // };
            });
        },
        controller: ['$scope', '$attrs', function getDataController($scope, $attrs) {
                $scope.downloadJson = function () {
                    $scope.$emit('download-start');
                    var generated = $scope.common.generateProto();
                    console.log(generated);
                    var encoded = encodeURIComponent(generated);
                    var unescaped = unescape(encoded);
                    var filedata = btoa(unescaped);
                    $scope.$emit('downloaded', filedata);
                };
            }]
    };
});
