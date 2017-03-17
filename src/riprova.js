angular.module('questApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])

  .controller('DemoCtrl', function($scope, $mdDialog, $mdMedia) {
    $scope.status = '  ';
    var questList = this;
    questList.allsQ = [];
    questList.openDialog = function($event) {
      $mdDialog.show({
        controller:
          function ($timeout, $q, $scope, $mdDialog) {
                $scope.cancel = function($event) {
                  $mdDialog.cancel();
                };
                // $scope.finish = function($event) {
                //   $mdDialog.hide();
                // };
                $scope.answer = function(alist, m) {
                  console.log('alist:' + alist);
                  $mdDialog.hide(alist, m);
                };
          },
        //controllerAs: 'casCtrl',
        // templateUrl: 'dialog.tmpl.html',
        template:
        '' +
        '<md-dialog aria-label="Autocomplete Dialog Example" ng-cloak>' +
        ' <md-toolbar>' +
        '   <div class="md-toolbar-tools">' +
        '     <h2>Autocomplete Dialog Example</h2>' +
        '<span flex></span>' +
        '<md-button class="md-icon-button" ng-click="cancel()">' +
        '    <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
        '  </md-button>' +
        '</div>' +
        '</md-toolbar>' +
        '' +
        '<md-dialog-content>' +
        '<div class="md-dialog-content">' +
        '  <form role="form">' +
        '            <div layout-gt-xs="row">' +
        '            <md-input-container class="md-block" flex-gt-xs="">'+
        '                <label>Titolo</label>'+
        '               <input ng-model="titolo"  size="30" placeholder="inserisci il titolo">'+
        '              </md-input-container>'+
        '              <md-datepicker ng-model="mylist.data" md-placeholder="Inserisci data">'+
        '              </md-datepicker>'+
        '              <md-input-container class="md-block" flex-gt-xs="">'+
        '                <label>Capitolo</label>'+
        '                <input ng-model="mylist.capitolo"  size="30" placeholder="inserisci il capitolo">'+
        '              </md-input-container>'+
        '              <md-input-container class="md-block">'+
        '                <label>Descrizione</label>'+
        '                <textarea ng-model="mylist.descrizione" md-maxlength="150" rows="5" md-select-on-focus placeholder="inserisci la descrizione"></textarea>'+
        '              </md-input-container>'+
        '              <md-input-container class="md-icon-float md-icon-right md-block">'+
        '                <label>Importo</label>'+
        '                <input ng-model="mylist.importo"  size="30" placeholder="inserisci l" type="number" step="0.01">'+
        '               <md-icon md-svg-src="img/icons/ic_euro_24px.svg"></md-icon>'+
        '              </md-input-container>'+
        '    <md-list>'+
        '      <md-list-item ng-repeat="item in [5,7,9]">'+
        '          <label>{{item}}</label>' +
        '            <input ng-model="mo[$index]" size="10" placeholder="test..">' +
        '      </md-list-item>' +
        '    </md-list>' +
        '              <md-button ng-click="answer(mylist, mo[0])" class="md-raised md-primary">Salva</md-button>'+
        '            </div>'+
        '          </form>'+
        '</div>'+
        '</md-dialog-content>'+
        '</md-dialog>'+
        '',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose:true,
        locals: {parent: $scope},
      })
     .then(
       function(answer, mo) {
        console.log("answer");
        console.log(answer);
        console.log("mo");
        console.log(mo);
        questList.allsQ.push({
           titolo: answer.titolo ,
           capitolo: answer.capitolo,
           descrizione: answer.descrizione,
           importo: answer.importo,
           data: answer.data
        });
        // questList.titolo = '';
        // questList.capitolo = '';
        // questList.descrizione = '';
        // questList.importo = '';
        // questList.data = '';
        console.log(questList.allsQ);
        console.log(questList.allsQ.length);
      }
    );
  };
  });
