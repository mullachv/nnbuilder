describe("Network Tests > ", function() {

  function sample_response(nt:NNComponentType) {
    let user_response = get_user_response_for_type(nt);
    switch(NNComponentType[nt]) {
      case NNComponentType[NNComponentType.ConvNet2D]:
        user_response['num_output'] = 256;
        user_response['pad'] = 0;
        user_response['kernel_size'] = 3;
        return user_response;
      case NNComponentType[NNComponentType.Pooling]:
        user_response['pool_type'] = 'MAX';
        user_response['kernel_size'] = 3;
        user_response['stride'] = 1;
        return user_response;
      case NNComponentType[NNComponentType.FullyConnected]:
        user_response['num_output'] = 1024;
        return user_response;
      case NNComponentType[NNComponentType.DropOut]:
        user_response['dropout_ratio'] = 0.5;
        return user_response;
      case NNComponentType[NNComponentType.ReLU]:
        return user_response;
      case NNComponentType[NNComponentType.Softmax]:
        return user_response;
    }
    return user_response;
  }

  var strScanCompare = function(a:any, b:any) {
    var ret = [];
    for(var i=0, len = a.length; i < len; i++) {
      if (a.charAt(i) != b.charAt(i)) {
        ret.push(i);
        console.log(a.charAt(i) + ' -- ' + b.charAt(i));
      } else {
        console.log(".")
      }
    }
    return ret;
  }

  describe("Net tests > ", function() {
    var root:any;
    var net:any;

    beforeEach(angular.mock.module("myApp"));

    beforeEach(inject(function($rootScope:any, $templateCache:any, $log:any) {
      root = $rootScope;
    }));

    afterEach(function() {
      net.reset();
    });

    it('rootScope should be defined', inject(function($rootScope:any, $templateCache:any, $log:any) {
      net = root['common'];
      expect(net).toBeDefined();
    }));

    it('should add a pooling component and checkout by fieldvalues', function() {
      net.addToNN(NNComponentType.Pooling);
      let comp = net.getCurrentComponents()[0];
      //console.log('c:' + JSON.stringify(comp));

      let usr_response = sample_response(NNComponentType.Pooling);
      //console.log('u:' + JSON.stringify(usr_response));

      net.saveNNCProps(comp.id, usr_response);
      let fvs = net.getfieldvaluesbyname(comp.id);
      //console.log('by name:' + JSON.stringify(fvs));

      expect(fvs['pool_type']).toBe("MAX");
      expect(fvs['kernel_size']).toBe(3);
      expect(fvs['stride']).toBe(1);
    });


    it('fully connected component and checkout by fieldvalues', function() {
      net.addToNN(NNComponentType.FullyConnected);
      let comp = net.getCurrentComponents()[0];
      let usr_response = sample_response(NNComponentType.FullyConnected);
      net.saveNNCProps(comp.id, usr_response);
      let fvs = net.getfieldvaluesbyname(comp.id);
      expect(fvs['num_output']).toBe(1024);
    });

    it('softmax component should checkout', function() {
      net.addToNN(NNComponentType.Softmax);
      let comp = net.getCurrentComponents()[0];
      let usr_response = sample_response(NNComponentType.Softmax);
      net.saveNNCProps(comp.id, usr_response);
      expect(comp.getTypeName()).toBe(NNComponentType[NNComponentType.Softmax]);
    });

    it('generate prototxt should produce json file', function() {
      net.addToNN(NNComponentType.Pooling);
      let comp = net.getCurrentComponents()[0];
      //console.log('c:' + JSON.stringify(comp));
      let usr_response = sample_response(NNComponentType.Pooling);
      //console.log('u:' + JSON.stringify(usr_response));
      net.saveNNCProps(comp.id, usr_response);
      let fvs = net.getfieldvaluesbyname(comp.id);
      //console.log('by name:' + JSON.stringify(fvs));
      let expectedProto:string =
          'name:NN_20174115515__1_layers\n' +
          'input: "data"\n' +
          'layers {"name":"Pooling_1000","top":"Pooling_1000","type":"POOLING","pooling_param":{"pool":"MAX","kernel_size":3,"stride":1},"bottom":"data"}\n';

      let generated = net.generateProto();
      //console.log('gen:' + generated);
      let encoded = encodeURIComponent(generated);
      //console.log('encoded:' + encoded);
      let unescaped = unescape(encoded);
      //console.log('unescaped:' + unescaped);

      //'name:NN_' must match -- remaining of that line is datetime related
      expect(unescaped.substring(0,8)).toBe(expectedProto.substring(0,8));

      var first = unescaped.substring(19);
      var second = expectedProto.substring(19);
      // console.log('first:' + first);
      // console.log('second:' + second);
      // console.log(strScanCompare(first, second));
      expect(first).toEqual(second);

    });

  });

});
