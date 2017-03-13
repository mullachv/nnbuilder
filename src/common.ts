
interface ComponentSettings {

}

enum NNComponentType {
  ConvNet2D,
  Pooling,
  FullyConnected,
  DropOut,
  ReLU,
  Softmax
}

interface NNComponent {
  name: string;
  type: NNComponentType;
  description?: string;
  external_link?: string;
  external_image?: string;
  settings? : ComponentSettings;
}

interface ConvNet2D_Settings extends ComponentSettings {
  num_output: number;
  pad: number;
  kernel_size: number;
}

interface FullyConnected_Settings extends ComponentSettings {
  num_output: number;
}

interface Dropout_Settings extends ComponentSettings {
  dropout_ratio: number;
}

interface ReLU_Settings extends ComponentSettings {

}
interface Softmax_Settings extends ComponentSettings {

}

enum PoolType {
  MAX,
  MEAN
}

interface Pooling_Settings extends ComponentSettings {
  pool: PoolType;
  kernel_size: number;
  stride: number;
}

module common {
  let availableComponentTypes:any = [];
  let availableFrameworks:any = [];
  let neuralNet:NNComponent[] = [];

  export function init() {

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

  export function getAvailableComponentTypes() {
    return availableComponentTypes;
  }

  export function getAvailableFrameworks() {
    return availableFrameworks;
  }

}

angular.module('myApp', [])
  .run(['$rootScope', function($rootScope:angular.IScope) {
    $rootScope['common'] = common;
    common.init();
}]);
