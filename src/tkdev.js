var app = angular.module('dApp', []);
app.directive('pdfDownload', function() {
    return {
        restrict: 'E',
        template: '<a href="" class="btn btn-primary" ng-click="downloadPdf()">Download</a>',
        scope: true,
        link: function(scope, element, attr) {
            var anchor = element.children()[0];
            //var anchor = $('a.btn');
            // When the download starts, disable the link
            scope.$on('download-start', function() {
                console.log('download-start event');
                $(anchor).attr('disabled', 'disabled');
            });

            // When the download finishes, attach the data to the link. Enable the link and change its appearance.
            scope.$on('downloaded', function(event, data) {
              console.log('on downloaded');
                $(anchor).attr({
                    href: 'data:application/test;base64,' + data,
                    download: attr.filename
                })
                .removeAttr('disabled')
                .text('Save')
                .removeClass('btn-primary')
                .addClass('btn-success');

                // Also overwrite the download pdf function to do nothing.
                // scope.downloadPdf = function() {
                //
                // };
            });
        },
        // controller: ['$scope', '$attrs', '$http', function($scope, $attrs, $http) {
        // }]
        controller: getDataController
      };

      function getDataController($scope, $attrs, $http) {
        $scope.downloadPdf = function() {
            $scope.$emit('download-start');
            console.log('emitted download start event');
            var filedata = btoa(unescape(encodeURIComponent('JSON data or text data')));
            $scope.$emit('downloaded', filedata);
            // $http.get($attrs.url).then(function(response) {
            //   var filedata = btoa(unescape(encodeURIComponent(response.data)));
            //   $scope.$emit('downloaded', filedata);
            //   console.log('download completed: ' + filedata.substring(0,5));
            // }, function() {
            //   console.log('download failed');
            // });
        };
      }

});
