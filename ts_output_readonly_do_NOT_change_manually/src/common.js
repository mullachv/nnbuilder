var NNComponentType;
(function (NNComponentType) {
    NNComponentType[NNComponentType["ConvNet2D"] = 0] = "ConvNet2D";
    NNComponentType[NNComponentType["Pooling"] = 1] = "Pooling";
    NNComponentType[NNComponentType["FullyConnected"] = 2] = "FullyConnected";
    NNComponentType[NNComponentType["DropOut"] = 3] = "DropOut";
    NNComponentType[NNComponentType["ReLU"] = 4] = "ReLU";
    NNComponentType[NNComponentType["Softmax"] = 5] = "Softmax";
})(NNComponentType || (NNComponentType = {}));
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
    function init() {
        //use $http service
        availableComponentTypes = [
            {
                typename: NNComponentType[NNComponentType.ConvNet2D],
                btnclass: 'btn btn-warning btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            },
            {
                typename: NNComponentType[NNComponentType.Pooling],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            },
            {
                typename: NNComponentType[NNComponentType.FullyConnected],
                btnclass: 'btn btn-info btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            },
            {
                typename: NNComponentType[NNComponentType.DropOut],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            },
            {
                typename: NNComponentType[NNComponentType.ReLU],
                btnclass: 'btn btn-primary btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            },
            {
                typename: NNComponentType[NNComponentType.Softmax],
                btnclass: 'btn btn-success btn-large',
                spanclass: 'glyphicon glyphicon-question-sign'
            }
        ];
        availableFrameworks = ['PyTorch', 'Tensorflow', 'th-Lua'];
    }
    common.init = init;
    function getAvailableComponentTypes() {
        return availableComponentTypes;
    }
    common.getAvailableComponentTypes = getAvailableComponentTypes;
    function getAvailableFrameworks() {
        return availableFrameworks;
    }
    common.getAvailableFrameworks = getAvailableFrameworks;
})(common || (common = {}));
angular.module('myApp', [])
    .run(['$rootScope', function ($rootScope) {
        $rootScope['common'] = common;
        common.init();
    }]);
