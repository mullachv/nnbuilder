let app = angular.module('mdtestApp', ['ngMaterial', 'ngAria', 'ngMessages', 'material.svgAssetsCache', 'ngSanitize', 'ngResource']);
app.controller('mdDataCtrl', ['$scope', '$mdDialog', function($scope:any, $mdDialog:any) {
  $scope.specifyDataset = function ($event:any) {
    var pEl = angular.element(document.body);
     $mdDialog.show({
       parent: pEl,
       targetEvent: $event,
       template:
         '<md-dialog aria-label="List dialog">' +
         '  <md-dialog-content>'+

         '  <ul style="list-style:none">'+
         '  <li>'+
         '    &nbsp;' +
         '  </li>'+
         '  <li>'+
         '    <input type=radio name=datasourcetype value=popular ng-model=dstype><label>&nbsp;Popular Datasets:</label> '+
         '    <select ng-model="pdset" ng-options="choice for choice in dsnames"></select>' +
         '  </li>'+
         '  <li>'+
         '    <input type=radio name=datasourcetype value=custom ng-model=dstype /><label>&nbsp;Custom Dataset</label>'+
         '    <ul style="list-style:none; margin:10px">'+
         '      <li>'+
         '        <label>Name:</label><input type=text name=cdsname size=10 placeholder="my Dataset" ng-model=cdsname /> '+
         '      </li>'+
         '      <li>'+
         '        <label>Input Shape</label><input type=text name=cdsdimensions size=5 placeholder="28x28" ng-model=cdsdimensions /> '+
         '      </li>'+
         '    </ul>'+
         '  </li>'+
         '  </ul>'+

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
         items: getNames()
       },
       controller: dsController
    }).then(
      function(resp:any) {
          // console.log(resp);
          saveDatasetChoice(resp);
      }, function() {
        //otherwise -- close dialog
    });

    function getNames() {
      return ["MNIST", "CIFAR-10"];
    }

    function saveDatasetChoice(resp:any) {
      console.log('resp: ' + JSON.stringify(resp));
    }

    function dsController($scope:any, $mdDialog:any, items:any) {
      $scope.dsnames = items;
      console.log('dsnames: ' + $scope.dsnames[0]);

      $scope.closeDialog = function() {
        $mdDialog.hide();
      }
      $scope.saveDialog = function() {
        console.log('scope.dstype: ' + $scope.dstype);
        console.log('scope.pdset: ' + $scope.pdset);
        console.log('scope.cdsname: ' + $scope.cdsname);
        console.log('scope.cdsdimensions: ' + $scope.cdsdimensions);
        let savedObj = {
          dstype: $scope.dstype,
          dsname: $scope.dstype == 'popular' ? $scope.pdset : $scope.cdsname,
          dsdimensions: $scope.dstype == 'popular' ? '' : $scope.cdsdimensions
        };
        $mdDialog.hide(savedObj);
      }
    }
  }

}])
;
