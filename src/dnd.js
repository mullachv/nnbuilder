var app = angular.module('dragDrop', []);

// Create a simple data model
var dataModel = {
  'reds': [{
    'id': 'red1',
    'text': 'This is red 1'
  }, {
    'id': 'red2',
    'text': 'This is red 2'
  }],
  'greens': [{
    'id': 'green1',
    'text': 'This is green 1'
  }, {
    'id': 'green2',
    'text': 'This is green 2'
  }]
}

app.controller('DragDropCtrl', function($scope) {
  $scope.data = dataModel;

  $scope.MoveItem = function(origin, dest, item_id) {
    // Check if dropped in origin
    if (origin == dest) return;

    // Find item in origin array
    for (i = 0; i < $scope.data[origin].length; i++) {
      if ($scope.data[origin][i].id == item_id) {
        // Splice the item from the origin array
        var item = $scope.data[origin].splice(i, 1);
        // Push to the destination array
        $scope.data[dest].push(item[0]);
        // End loop
        break;
      }
    }

    // Update UI
    $scope.$apply();
  }
});

app.directive('draggable', function() {
  return function(scope, element, attrs) {
    // Get the native element
    var el = element[0];
    el.draggable = true; // Make dragable

    // Add event listeners
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('item_id', this.id);
        e.dataTransfer.setData('origin_id', el.parentElement.id);
        this.classList.add('dragging');
        return false;
      }, false
    );

    el.addEventListener(
      'dragend',
      function(e) {
        this.classList.remove('dragging');
        return false;
      },
      false
    );
  }
});

app.directive('droppable', function() {
  return function(scope, element, attrs) {
    // Get the native element
    var el = element[0];

    // Add event listeners
    el.addEventListener(
      'dragover',
      function(e) {
        e.preventDefault(); // Allow the drop

        // Set effects
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('dragover');
        return false;
      }, false
    );

    el.addEventListener(
      'dragenter',
      function(e) {
        this.classList.add('dragover');
        return false;
      }, false
    );

    el.addEventListener(
      'dragleave',
      function(e) {
        this.classList.remove('dragover');
        return false;
      }, false
    );

    el.addEventListener(
      'drop',
      function(e) {
        this.classList.remove('dragover');

        // Get the data
        var destination = this.id;
        var item_to_move = e.dataTransfer.getData('item_id');
        var origin = e.dataTransfer.getData('origin_id');

        // Call the scope move function
        scope.MoveItem(origin, destination, item_to_move);

        return false;
      }, false
    );
  }
});
