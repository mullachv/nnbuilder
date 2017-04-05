
enum FieldType {
  BOOL,
  INT,
  FLOAT,
  STRING,
  ENUMERATION
}

class FieldSetting {
  fieldlabel: string;
  fieldname: string;
  fieldtype: FieldType;
  fieldrequired?: boolean;
  fieldvaluechoices?:string[];
  fieldvalue:any;
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
  convertToJSON():any;
}

class NNComponent implements INNComponent {
  id: number;
  name: string;
  type: NNComponentType;
  description?: string;
  external_link?: string;
  external_image?: string;
  settings? : FieldSetting[];

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

  convertToJSON():any {
    let layer:any = {};
    layer.name = this.name;
    layer.top = this.name;

    let scvalues:any = common.getfieldvaluesbyname(this.id);
    switch(NNComponentType[this.type]) {
      case NNComponentType[NNComponentType.ConvNet2D]:
          layer.type = "CONVOLUTION";
          layer.convolution_param = {
            num_output: scvalues['num_output'],
            pad: scvalues['pad'],
            kernel_size: scvalues['kernel_size']
          };
          break;
      case NNComponentType[NNComponentType.Pooling]:
        layer.type = "POOLING";
        layer.pooling_param = {
          pool: scvalues['pool_type'],
          kernel_size: scvalues['kernel_size'],
          stride: scvalues['stride']
        };
        break;
      case NNComponentType[NNComponentType.FullyConnected]:
        layer.type = "INNER_PRODUCT";
        layer.pooling_param = {
          num_output: scvalues['num_output']
        };
        break;
      case NNComponentType[NNComponentType.DropOut]:
        layer.type = "DROPOUT";
        layer.dropout_param = {
          dropout_ratio: scvalues['dropout_ratio']
        };
        break;
      case NNComponentType[NNComponentType.ReLU]:
        layer.type = "RELU";
        break;
      case NNComponentType[NNComponentType.Softmax]:
        layer.type = "SOFTMAX";
        break;
    }
    return layer;
    // let str = JSON.stringify(layer);
    // return 'layers  ' + str ;
  }

}

function get_user_response_for_type(ctype:NNComponentType):any {
  switch(NNComponentType[ctype]) {
    case NNComponentType[NNComponentType.ConvNet2D]:
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
    case NNComponentType[NNComponentType.DropOut]:
      return {
        dropout_ratio: 0
      };
    case NNComponentType[NNComponentType.ReLU]:
      return {};
    case NNComponentType[NNComponentType.Softmax]:
      return {};
  }

}

function create_ConvNet2D_Settings() {
  let NumOutputField:FieldSetting = new FieldSetting();
  NumOutputField.fieldlabel = 'Number of output';
  NumOutputField.fieldname = 'num_output';
  NumOutputField.fieldtype = FieldType.INT;
  NumOutputField.fieldrequired = true;

  let PadField:FieldSetting = new FieldSetting();
  PadField.fieldlabel = 'Padding Size';
  PadField.fieldname = 'pad';
  PadField.fieldtype = FieldType.INT;
  PadField.fieldrequired = false;

  let KernelSizeField:FieldSetting = new FieldSetting();
  KernelSizeField.fieldlabel = 'Kernel Size';
  KernelSizeField.fieldname = 'kernel_size';
  KernelSizeField.fieldtype = FieldType.INT;
  KernelSizeField.fieldrequired = true;

  let ConvNet2D_Settings:FieldSetting[] = [];
  ConvNet2D_Settings.push(NumOutputField);
  ConvNet2D_Settings.push(PadField);
  ConvNet2D_Settings.push(KernelSizeField);

  return ConvNet2D_Settings;
}

function create_FullyConnected_Settings() {
  let NumOutputField:FieldSetting = new FieldSetting();
  NumOutputField.fieldlabel = 'Number of output';
  NumOutputField.fieldname = 'num_output';
  NumOutputField.fieldtype = FieldType.INT;
  NumOutputField.fieldrequired = true;

  let FullyConnected_Settings:FieldSetting[] = [];
  FullyConnected_Settings.push(NumOutputField);

  return FullyConnected_Settings;
}

function create_Dropout_Settings() {
  let DropoutField:FieldSetting = new FieldSetting();
  DropoutField.fieldlabel = 'Dropout Fraction';
  DropoutField.fieldname = 'dropout_ratio';
  DropoutField.fieldtype = FieldType.FLOAT;
  DropoutField.fieldrequired = true;

  let Dropout_Settings:FieldSetting[] = [];
  Dropout_Settings.push(DropoutField);

  return Dropout_Settings;
}

function create_ReLU_Settings() {
  let ReLU_Settings:FieldSetting[] = [];
  return ReLU_Settings;
}

function create_Softmax_Settings() {
  let Softmax_Settings:FieldSetting[]= [];
  return Softmax_Settings;
}

enum PoolingType {
  MAX,
  MEAN,
  MIN
}

function create_Pooling_Settings() {
  let PoolType:FieldSetting = new FieldSetting();
  PoolType.fieldlabel = 'Pooling Type';
  PoolType.fieldname = 'pool_type';
  PoolType.fieldtype = FieldType.ENUMERATION;
  PoolType.fieldrequired = true;
  PoolType.fieldvaluechoices = [];
  PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MAX]);
  PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MIN]);
  PoolType.fieldvaluechoices.push(PoolingType[PoolingType.MEAN]);

  let KernelSizeField:FieldSetting = new FieldSetting();
  KernelSizeField.fieldlabel = 'Kernel Size';
  KernelSizeField.fieldname = 'kernel_size';
  KernelSizeField.fieldtype = FieldType.INT;
  KernelSizeField.fieldrequired = true;

  let StrideField:FieldSetting = new FieldSetting();
  StrideField.fieldlabel = 'Stride Size';
  StrideField.fieldname = 'stride';
  StrideField.fieldtype = FieldType.INT;
  StrideField.fieldrequired = false;


  let Pooling_Settings:FieldSetting[] = [];
  Pooling_Settings.push(PoolType);
  Pooling_Settings.push(KernelSizeField);
  Pooling_Settings.push(StrideField);

  return Pooling_Settings;

}


module common {
  let availableComponentTypes:any = [];
  let availableFrameworks:any = [];
  let neuralNet:NNComponent[] = [];
  let nnSeqId = 1000;
  let scope:angular.IScope;
  let helpTypeName = '';
  let net_name = "";
  let net_dataset:any;

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

  function findItemIndex(ncid: number):number {
    let index = 0;
    for(let nc of neuralNet) {
      if (nc.id == ncid) {
        return index;
      }
      index++;
    }
    return -1;
  }

  export function getfielditems(ncid:number):any {
    let index = findItemIndex(ncid);
    if (index == -1) {
        return null;
    }
    return neuralNet[index].settings;
  }

  export function getfieldvaluesbyname(ncid: number):any {
    let index = findItemIndex(ncid);
    if (index == -1) {
        return null;
    }
    // let fvbyname = [];
    // for (let it of neuralNet[index].settings) {
    //   fvbyname[<any>it.fieldname] = it.fieldvalue;
    // }
    let fvbyname:any = {};
    for (let it of neuralNet[index].settings) {
      fvbyname[<any>it.fieldname] = it.fieldvalue;
    }
    // console.log(fvbyname);
    // console.log(JSON.stringify(fvbyname));
    return fvbyname;
  }

  export function getCurrentComponents():NNComponent[] {
    return neuralNet;
  }

  export function addToNN(ct:NNComponentType) {
    //console.log('Adding ct: ' + NNComponentType[ct]);
    //create a new NNComponent
    let nc:NNComponent = new NNComponent();
    nc.type = ct;
    nc.id = nnSeqId;
    nc.name = NNComponentType[ct] + "_" + nc.id;
    switch(NNComponentType[ct]) {
      case NNComponentType[NNComponentType.ConvNet2D]: nc.settings = create_ConvNet2D_Settings(); break;
      case NNComponentType[NNComponentType.Pooling]: nc.settings = create_Pooling_Settings(); break;
      case NNComponentType[NNComponentType.FullyConnected]: nc.settings = create_FullyConnected_Settings(); break;
      case NNComponentType[NNComponentType.DropOut]: nc.settings = create_Dropout_Settings(); break;
      case NNComponentType[NNComponentType.ReLU]: nc.settings = create_ReLU_Settings(); break;
      case NNComponentType[NNComponentType.Softmax]: nc.settings = create_Softmax_Settings(); break;
    }
    neuralNet.push(nc);
    nnSeqId++;
  }

  export function removeFromNN(ncid:number) {
    let index = 0;
    for(let nc of neuralNet) {
      if (nc.id == ncid) {
        neuralNet.splice(index, 1);
        return;
      }
      index++;
    }
  }

  export function removeAllComponents() {
    neuralNet = [];
  }

  export function reset() {
    removeAllComponents();
    nnSeqId = 1000;
  }

  export function getNNComponentAsString(ncid:number) {
    let index = findItemIndex(ncid);
    if (index == -1) {
        return '';
    }
    return JSON.stringify(neuralNet[index]);
  }

  export function saveNNCProps(ncid:number, userresponse:any):void {
    //console.log(userresponse);
    let index = findItemIndex(ncid);
    if (index == -1) {
        return;
    }
    let nc:NNComponent = neuralNet[index];
    for (var key in userresponse) {
      //console.log('setting k: ' + key + ' v: ' + JSON.stringify(userresponse[key]));
      setfieldvalue(nc, key, userresponse[key]);
    }
  }

  function setfieldvalue(nc: NNComponent, fieldname:string, fieldvalue:any) {
    for (var i = 0; i < nc.settings.length; i++) {
      if (nc.settings[i].fieldname == fieldname) {
        nc.settings[i].fieldvalue = fieldvalue;
        //console.log('Value set: ' + nc.settings[i].fieldname + ' to: ' + nc.settings[i].fieldvalue);
        return;
      }
    }
  }

  export function updateUI() {
    scope.$apply();
  }

  export function setDataSet() {
    //NN dataset
  }

  function getinputdims() {
    if (net_dataset) {
      //dataset input dimensions
      return [1,2,3];
    }
    return [];
  }

  function prepadZero(pp:number):string {
    if(pp<10) {
      return '0'+pp;
    }
    return ''+pp;
  }

  function nnProtoHeaders():any {
    let d = new Date();

    let header = "name:" + "NN_" + d.getFullYear() + prepadZero(d.getMonth()+1)
      + prepadZero(d.getDate()) + "_" + prepadZero(d.getHours())
      + prepadZero(d.getMinutes()) + prepadZero(d.getSeconds()) + "_" + net_name + "_"
      + neuralNet.length + "_layers\n";

    header += "input: \"data\"\n";
    for(let dim of getinputdims()) {
      header += "input_dim: " + dim + "\n";
    }
    return header;
  }

  export function generateProto() {
    let comps = [];
    let prevlayer;
    let prototxt = nnProtoHeaders();
    for(let comp of neuralNet) {
      let layer = comp.convertToJSON();
      if(!prevlayer) {
        layer.bottom = "data";
      } else {
        layer.bottom = prevlayer.name;
      }
      prototxt += "layers " + JSON.stringify(layer) + "\n";
      prevlayer = layer;
    }
    return prototxt;
  }

  export function getAvailableComponentTypes() {
    return availableComponentTypes;
  }

  export function getAvailableFrameworks() {
    return availableFrameworks;
  }

}

//eliminates typescript transpile error 'cannot find name unescape'
declare function unescape(s: string):string;

angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ngSanitize', 'ngResource'])
  .run(['$rootScope', '$templateCache', '$log', function($rootScope:angular.IScope, $templateCache:any, $log:any) {
    $templateCache.put('myApp', 'myApp');
    $rootScope['common'] = common;
    common.init($rootScope);
    $log.info("myApp Started");
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
    $scope.customFullscreen = false;

    $scope.showInfo = function(ev:any, typename:string, typedescription:string, typeurl:string) {
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


  }])
  .controller('EditDeleteCtrl', ['$scope', '$mdDialog', function($scope:any, $mdDialog:any) {
    $scope.deleteComponent = function(ev:any, ncid:any) {
      //console.log('nncid: ' + ncid);
      $scope.common.removeFromNN(ncid);
    }

    $scope.editComponent = function ($event:any, ncid:number) {
      var pEl = angular.element(document.body);
       $mdDialog.show({
         parent: pEl,
         targetEvent: $event,
         template:
           '<md-dialog aria-label="List dialog">' +
           '  <md-dialog-content>'+
           '    <md-list>'+
           '      <md-list-item ng-repeat="item in items">'+
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
           fieldvalues : $scope.common.getfieldvaluesbyname(ncid)
         },
         controller: dlgController
      }).then(
        function(resp:any) {
            // console.log(resp);
            $scope.common.saveNNCProps(ncid, resp);
        }, function() {
          //otherwise -- close dialog
      });

      function dlgController($scope:any, $mdDialog:any, items:any, fieldvalues:any) {
        $scope.items = items;
        $scope.CValues = fieldvalues;

        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
        $scope.saveDialog = function() {
          // console.log($scope.CValues);
          $mdDialog.hide($scope.CValues);
        }
      }
    }

  }])
  .directive('generateProto', function() {
    return {
        restrict: 'E',
        template: '<a href="" class="btn btn-primary btn-lg" ng-click="downloadJson()">Download Prototxt</a>',
        scope: true,
        link: function(scope, element, attr) {
            var anchor:any = element.children()[0];
            // When the download starts, disable the link
            scope.$on('download-start', function() {
                console.log('download-start event');
                (<any>$(anchor)).attr('disabled', 'disabled');
            });

            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('downloaded', function(event, data) {
              console.log('on downloaded');
                (<any>$(anchor)).attr({
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
        controller: [ '$scope', '$attrs', function getDataController($scope:any, $attrs:any) {
          $scope.downloadJson = function() {
              $scope.$emit('download-start');
              let generated = $scope.common.generateProto();
              console.log("generated");
              console.log(generated);
              let encoded = encodeURIComponent(generated);
              let unescaped = unescape(encoded);
              console.log('emitted download start event');
              var filedata = btoa(unescaped);
              $scope.$emit('downloaded', filedata);
          };
        }]
      };

})
;
