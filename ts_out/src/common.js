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
    NNComponent.prototype.defaultNum = function (item) {
        if (item) {
            if (isNumeric(item))
                return item;
        }
        return 0;
    };
    NNComponent.prototype.defaultAlpha = function (item) {
        if (item) {
            return "'" + item + "'";
        }
        return "''";
    };
    //["convv", 32, 5, False, ""], ["maxpool", 0, 2, True, "lrelu"], ["convv", 64, 3, True, "lrelu"], ["convv", 64, 3, False, ""],
    //         ["maxpool", 0, 2, True, "lrelu"], ["convv", 128, 3, True, "lrelu"]]
    NNComponent.prototype.convertToListItem = function () {
        var arritems = [];
        var scvalues = common.getfieldvaluesbyname(this.id);
        switch (NNComponentType[this.type]) {
            case NNComponentType[NNComponentType.Convolution]:
                arritems.push("'convv'");
                arritems.push(this.defaultNum(scvalues['num_output']));
                arritems.push(this.defaultNum(scvalues['kernel_size']));
                arritems.push('False');
                arritems.push(this.defaultAlpha(scvalues['activation']));
                break;
            case NNComponentType[NNComponentType.Pooling]:
                arritems.push("'maxpool'");
                arritems.push(this.defaultNum(scvalues['num_output']));
                arritems.push(this.defaultNum(scvalues['kernel_size']));
                arritems.push('False');
                arritems.push(this.defaultAlpha(scvalues['activation']));
                break;
            case NNComponentType[NNComponentType.FullyConnected]:
                arritems.push("'fc'");
                arritems.push(this.defaultNum(scvalues['num_output']));
                arritems.push(0);
                arritems.push('False');
                arritems.push("''");
                break;
        }
        return arritems;
    };
    return NNComponent;
}());
//http://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
function isNumeric(item) {
    return !isNaN(parseFloat(item)) && isFinite(item);
}
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
    var selectedFramework = '';
    var neuralNet = [];
    var nnSeqId = 1000;
    var scope;
    var helpTypeName = '';
    var net_name = "";
    var net_dataset;
    var net_solver;
    var net_scheduler;
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
        availableFrameworks = ['PyTorch', 'Tensorflow'];
        selectedFramework = availableFrameworks[0];
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
            return net_dataset.dsdimensions.trim().split('x');
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
    function getSelectedFramework() {
        return selectedFramework;
    }
    common.getSelectedFramework = getSelectedFramework;
    function isfocused(current) {
        if (current == selectedFramework) {
            return 'focus';
        }
    }
    common.isfocused = isfocused;
    function generateLayersList() {
        var llist = [];
        for (var _i = 0, neuralNet_4 = neuralNet; _i < neuralNet_4.length; _i++) {
            var comp = neuralNet_4[_i];
            llist.push("[" + comp.convertToListItem().toString() + "]");
        }
        return "[" + llist + "]";
    }
    common.generateLayersList = generateLayersList;
    function getPopularDatasetNames() {
        return ["MNIST", "CIFAR-10", "SVHN", "LSUN"].map(function (ds) {
            return { name: ds };
        });
    }
    common.getPopularDatasetNames = getPopularDatasetNames;
    function saveDatasetChoice(choice) {
        console.log('dataset: ' + JSON.stringify(choice));
        net_dataset = choice;
        // let savedObj = {
        //   dstype: $scope.dstype,
        //   dsname: $scope.dstype == 'popular' ? $scope.pdset : $scope.cdsname,
        //   dsdimensions: $scope.dstype == 'popular' ? '' : $scope.cdsdimensions
        // };
    }
    common.saveDatasetChoice = saveDatasetChoice;
    function getSolvers() {
        return ["SGD", "Adam", "Adagrad", "RMSProp"].map(function (ss) {
            return { name: ss };
        });
    }
    common.getSolvers = getSolvers;
    function getLossFunctions() {
        return ["MSELoss", "Neg Log Likelihood", "Cross-Entropy", "Hinge", "Logistic"].map(function (ls) {
            return { name: ls };
        });
    }
    common.getLossFunctions = getLossFunctions;
    function saveSolverSettings(solver) {
        console.log('solver: ' + JSON.stringify(solver));
        net_solver = solver;
    }
    common.saveSolverSettings = saveSolverSettings;
    function populate_ds_solver(instr) {
        var layersArr = generateLayersList();
        //console.log('layers' + layersArr.toString());
        var generated = instr.replace(/###LAYERS###/g, layersArr.toString());
        generated = generated.replace(/###DIMENSION###/g, net_dataset.dsdimensions.trim().split('x')[0]);
        generated = generated.replace(/###EPOCHS###/g, net_solver.epochs);
        generated = generated.replace(/###LR###/g, net_solver.lr);
        generated = generated.replace(/###WEIGHT_DECAY###/g, net_solver.weight_decay);
        return generated;
    }
    common.populate_ds_solver = populate_ds_solver;
    function saveScheduler(stt) {
        net_scheduler = stt;
        //call the backend REST service
    }
    common.saveScheduler = saveScheduler;
    function getModelZooTemplates() {
        return ["VGG_CNN_S", "Yearbook", "GoogLeNet_Cars"];
    }
    common.getModelZooTemplates = getModelZooTemplates;
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
                    '      Save' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    fielditems: $scope.common.getfielditems(ncid),
                    fieldvalues: $scope.common.getfieldvaluesbyname(ncid)
                },
                controller: dlgController
            }).then(function (resp) {
                // console.log(resp);
                $scope.common.saveNNCProps(ncid, resp);
            }, function () {
                //otherwise -- close dialog
            });
            function dlgController($scope, $mdDialog, fielditems, fieldvalues) {
                $scope.items = fielditems;
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
                    //console.log(generated);
                    var encoded = encodeURIComponent(generated);
                    var unescaped = unescape(encoded);
                    var filedata = btoa(unescaped);
                    $scope.$emit('downloaded', filedata);
                };
            }]
    };
})
    .directive('generateCode', function () {
    var dataController = ['$scope', '$attrs', 'codeTemplateService',
        function getDataController($scope, $attrs, codeTemplateService) {
            var codegenerator = function () {
                $scope.$emit('start-codegeneration');
                codeTemplateService.getTemplate('PyTorch').then(function (data) {
                    var generated = common.populate_ds_solver(data);
                    var filedata = btoa(unescape(encodeURIComponent(generated)));
                    var precode = document.querySelector('.src-code-inner>pre>code');
                    precode.innerHTML = generated.replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;');
                    //console.log('pre: ' + precode.context.innerText + '');
                    $scope.$emit('end-codegeneration', filedata);
                });
            };
            $scope.downloadCode = codegenerator;
            $scope.$on('reset-generatecode-button', function (event, anchor) {
                $(anchor)
                    .text('Generate Code')
                    .removeClass('btn-success')
                    .addClass('btn-primary');
                $scope.downloadCode = codegenerator;
            });
        }];
    return {
        restrict: 'E',
        template: '<a href="" class="btn btn-primary btn-lg" ng-click="downloadCode()">Generate Code</a>',
        scope: true,
        link: function (scope, element, attr) {
            var anchor = element.children()[0];
            // When the download starts, disable the link
            scope.$on('start-codegeneration', function () {
                $(anchor).attr('disabled', 'disabled');
            });
            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('end-codegeneration', function (event, data) {
                $(anchor).attr({
                    href: 'data:application/test;base64,' + data,
                    download: attr.filename
                })
                    .removeAttr('disabled')
                    .text('Save Code')
                    .removeClass('btn-primary')
                    .addClass('btn-success');
                //Also overwrite the download code function to do nothing.
                scope.downloadCode = function () {
                    scope.$emit('reset-generatecode-button', anchor);
                };
            });
        },
        controller: dataController
    };
})
    .factory('codeTemplateService', ['$http', function ($http) {
        return {
            getTemplate: function (framework) {
                var promise = $http.get('/templates/' + framework + '.templ.py')
                    .then(function (response) {
                    return response.data;
                }, function (reason) {
                    console.log('Error#' + reason + ' fetching ' + framework + ' template');
                });
                return promise;
            }
        };
    }])
    .controller('DatasetCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.specifyDataset = function ($event) {
            var pEl = angular.element(document.body);
            $mdDialog.show({
                parent: pEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '  <ul style="list-style:none">' +
                    '  <li>' +
                    '    &nbsp;' +
                    '  </li>' +
                    '  <li>' +
                    '    <input type=radio name=dstype value=popular ng-model=dstype ><label>&nbsp;Popular Datasets:</label> ' +
                    '    <select ng-model="sel_ds.dsname" ng-options="choice.name as choice.name for choice in dsnames"></select>' +
                    '  </li>' +
                    '  <li>' +
                    '    <input type=radio name=dstype value=custom ng-model=dstype /><label>&nbsp;Custom Dataset</label>' +
                    '    <ul style="list-style:none; margin:3px" ng-show="dstype==\'custom\'">' +
                    '      <li>' +
                    '        <label>Name:</label><input type=text size=15 placeholder="mydataset" ng-model=sel_ds.dsname /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Input Shape</label><input type=text size=7 placeholder="28x28" ng-model=sel_ds.dsdimensions /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>URL</label><input type=text size=25 placeholder="http://yann.lecun.com/exdb/mnist/" ng-model=sel_ds.dsurl /> ' +
                    '      </li>' +
                    '    </ul>' +
                    '  </li>' +
                    '  </ul>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveDialog()" class="md-primary">' +
                    '      Save' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    items: $scope.common.getPopularDatasetNames()
                },
                controller: dsController
            }).then(function (resp) {
                // console.log(resp);
                $scope.common.saveDatasetChoice(resp);
            }, function () {
                //otherwise -- close dialog
            });
            function dsController($scope, $mdDialog, items) {
                $scope.dsnames = items;
                //default
                $scope.sel_ds = {
                    dstype: 'popular',
                    dsname: 'MNIST',
                    dsdimensions: '28x28',
                    dsurl: 'http://yann.lecun.com/exdb/mnist/'
                };
                $scope.dstype = 'popular'; //default checkbox
                // $scope.cdsname = 'mydataset';
                // $scope.cdsdimensions = '28x28';
                // $scope.cdsurl = 'http://yann.lecun.com/exdb/mnist/';
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.saveDialog = function () {
                    $scope.sel_ds.dstype = $scope.dstype;
                    $mdDialog.hide($scope.sel_ds);
                };
            }
        };
    }])
    .controller('SolverCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.specifySolver = function ($event) {
            var pEl = angular.element(document.body);
            $mdDialog.show({
                parent: pEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '    <ul style="list-style:none">' +
                    '      <li>' +
                    '        &nbsp;' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>&nbsp;Loss Function:</label> ' +
                    '        <select ng-model="selsolver.lossfunction" ng-options="loss.name as loss.name for loss in lossfunctions"></select>' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>&nbsp;Solver:</label> ' +
                    '        <select ng-model="selsolver.name" ng-options="solver.name as solver.name for solver in solverList"></select>' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Learning Rate:</label><input type=text size=5 ng-model=selsolver.lr /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Weight Decay:</label><input type=text size=7 ng-model=selsolver.weight_decay /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Momentum:</label><input type=text size=7 ng-model=selsolver.momentum /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Training Epochs:</label><input type=text size=7 ng-model=selsolver.epochs /> ' +
                    '      </li>' +
                    '    </ul>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveDialog()" class="md-primary">' +
                    '      Save' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    items: $scope.common.getSolvers(),
                    lf: $scope.common.getLossFunctions()
                },
                controller: srController
            }).then(function (resp) {
                // console.log(resp);
                $scope.common.saveSolverSettings(resp);
            }, function () {
                //otherwise -- close dialog
            });
            function srController($scope, $mdDialog, items, lf) {
                $scope.solverList = items;
                $scope.lossfunctions = lf;
                //defaults
                $scope.selsolver = {
                    name: 'Adam',
                    lr: 0.007,
                    weight_decay: 0.001,
                    momentum: 0.5,
                    epochs: 7,
                    lossfunction: 'MSELoss'
                };
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.saveDialog = function () {
                    $mdDialog.hide($scope.selsolver);
                };
            }
        };
    }])
    .controller('TrainTestCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.specifyTTSchedule = function ($event) {
            var pEl = angular.element(document.body);
            $mdDialog.show({
                parent: pEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '    <ul style="list-style:none">' +
                    '      <li>' +
                    '        &nbsp;' +
                    '      </li>' +
                    //  '      <li>'+
                    //  '        <label>Job Start Date/Time:</label> '+
                    //  '        <input type=text size=5 ng-model=ttctrl.starttime />'+
                    //  '      </li>'+
                    '      <li>' +
                    '        <label>Max Run Time (Hours):</label><input type=text size=5 ng-model=ttctrl.maxruntime /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Number of CPUs:</label><input type=number min=1 max=8 ng-model=ttctrl.ncpus /> ' +
                    '      </li>' +
                    '      <li>' +
                    '        <label>Use GPUs, if available:</label><input type=checkbox ng-model=ttctrl.usegpu /> ' +
                    '      </li>' +
                    '    </ul>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveDialog()" class="md-primary">' +
                    '      Start Training' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {},
                controller: ttController
            }).then(function (resp) {
                $scope.common.saveScheduler(resp);
            }, function () {
            });
            function ttController($scope, $mdDialog) {
                //defaults
                $scope.ttctrl = {
                    starttime: Math.floor(new Date().getTime() / 1000),
                    maxruntime: 12,
                    ncpus: 1,
                    usegpu: false
                };
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.saveDialog = function () {
                    console.log(JSON.stringify($scope.ttctrl));
                    $mdDialog.hide($scope.ttctrl);
                };
            }
        };
    }])
    .controller('ModelZooTemplateCtrl', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        $scope.specifyTemplate = function ($event) {
            var pEl = angular.element(document.body);
            $mdDialog.show({
                parent: pEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="List dialog">' +
                    '  <md-dialog-content>' +
                    '  <ul style="list-style:none">' +
                    '  <li>' +
                    '    &nbsp;' +
                    '  </li>' +
                    '  <li>' +
                    '    <input type=radio name=tetype ng-model=tetype ><label>&nbsp;Model Zoo Item:</label> ' +
                    '    <select ng-model="modelitem.name" ng-options="choice as choice for choice in modelszoo"></select>' +
                    '  </li>' +
                    '  </ul>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveDialog()" class="md-primary">' +
                    '      Save' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                locals: {
                    items: $scope.common.getModelZooTemplates()
                },
                controller: mzController
            }).then(function (resp) {
                // console.log(resp);
                $scope.common.saveSolverSettings(resp);
            }, function () {
                //otherwise -- close dialog
            });
            function mzController($scope, $mdDialog, items) {
                $scope.modelszoo = items;
                //defaults
                $scope.modelitem = {
                    name: 'VGG_CNN_S'
                };
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.saveDialog = function () {
                    $mdDialog.hide($scope.selsolver);
                };
            }
        };
    }])
    .factory('ModelTemplateService', ['$http', function ($http) {
        return {
            getTemplate: function () {
                var promise = $http.get('/modeltemplates/models')
                    .then(function (response) {
                    return response.data;
                }, function (reason) {
                    console.log('Error#' + reason + ' fetching template ' + '/modeltemplates/models');
                });
                return promise;
            }
        };
    }]);
