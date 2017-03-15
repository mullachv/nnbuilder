
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

interface INNComponent {
  getNNCButtonClass():string;
  getNNCSpanClass(ix:number):string;
  getTypeName():string;
}

class NNComponent implements INNComponent {
  id: number;
  name: string;
  type: NNComponentType;
  description?: string;
  external_link?: string;
  external_image?: string;
  settings? : ComponentSettings;

  getTypeName() {
    return NNComponentType[this.type];
  }

  getNNCButtonClass() {
    let ctype = NNComponentType[this.type];
    for (let ct of common.getAvailableComponentTypes()) {
      if ( ctype == ct.typename) {
        return ct.btnclass;
      }
    }
    return '';
  }

  getNNCSpanClass(ix:number) {
    if (ix == 0 ) {
      return 'glyphicon glyphicon-wrench';
    }
    return 'glyphicon glyphicon-remove-sign';
  }

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
  let nnSeqId = 1000;
  let scope:angular.IScope;
  let helpTypeName = '';

  export function init(rootScope:angular.IScope) {
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

  export function getCurrentComponents():NNComponent[] {
    return neuralNet;
  }

  export function addToNN(ct:NNComponentType) {
    console.log('Adding ct: ' + NNComponentType[ct]);
    //create a new NNComponent
    let nc:NNComponent = new NNComponent();
    nc.type = ct;
    nc.id = nnSeqId;
    nc.name = NNComponentType[ct] + "_" + nc.id;

    neuralNet.push(nc);
    nnSeqId++;
  }

  export function updateUI() {
    scope.$apply();
  }

  export function describeComponent(typename:string) {
    helpTypeName = typename;
  }

  export function showHelp(typename:string) {
    if (helpTypeName == typename) {
      return true;
    }
    return false;
  }

  export function getAvailableComponentTypes() {
    return availableComponentTypes;
  }

  export function getAvailableFrameworks() {
    return availableFrameworks;
  }

}

angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngSanitize'])
  .run(['$rootScope', '$templateCache', function($rootScope:angular.IScope, $templateCache:any) {
    $templateCache.put('myApp', 'myApp');
    $rootScope['common'] = common;
    common.init($rootScope);
  }])
  .directive('draggable', function() {
    return function(scope:any, element:any, attrs:any) {
        var el = element[0];
        el.draggable = true;
        el.addEventListener('dragstart', function(e:any) {
          e.dataTransfer.effectAllowed = 'move';
          //data-nnctype attribute of the <button> element
          e.dataTransfer.setData('NNComponentType', this.dataset.nnctype);
          this.classList.add('dragging');
          return false;
        }, false);
        el.addEventListener('dragend', function(e:any) {
          this.classList.remove('dragging');
          return false;
        }, false);
    };
  })
  .directive('droppable', function() {
    return function(scope:any, element:any, attrs:any) {
        var el = element[0];
        el.addEventListener(
          'dragover',
          function(e:any){
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('dragover');
            return false;
          }, false
        );

        el.addEventListener(
          'dragenter',
          function(e:any) {
            this.classList.add('dragover');
            return false;
          }, false
        );

        el.addEventListener(
          'dragleave',
          function(e:any) {
            this.classList.remove('dragover');
            return false;
          }, false
        );

        el.addEventListener('drop', function(e:any){
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
  .controller('DialogCtrl', ['$scope', '$mdDialog', function($scope:any, $mdDialog:any) {
    $scope.status = '  ';
    $scope.customFullscreen = false;

    $scope.showAlert = function(ev:any, typename:string, typedescription:string, typeurl:string) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(true)
          .title(typename)
          .htmlContent(typedescription + ' <a href="' + typeurl + '" target="_blank">More Info</a>')
          .ok('Got it!')
          .targetEvent(ev)
      );
    };

    $scope.showAdvanced = function(ev:any, typename:string) {
      let templateUrl = 'dialog1.' + typename + '.tmpl.html';
      $mdDialog.show({
        controller: DialogController,
        templateUrl: templateUrl,
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
      .then(function(answer:any) {
        $scope.status = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });
    };

    function DialogController($scope:any, $mdDialog:any) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer:any) {
        $mdDialog.hide(answer);
      };
    }

  }])
;
