
interface NNCtrlScope extends ng.IScope {

  addComponent();
  removeComponent(comp: NNComponent);
  editComponent(comp: NNComponent);

}

interface NNCtrlRouteParams {
  //
}

nnmvc.controller('NNCtrl', function NNCtrl($scope:NNCtrlScope, $routeParams:NNCtrlRouteParams, nnStorage:NNStorage, filterFilter) {

})
