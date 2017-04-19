//
describe('Neural Net Builder > ', function() {
  function getPage(page: string) {
    browser.get('http://localhost:4000/' + page);
    browser.sleep(200); // Wait for the first updateUI to arrive.
  }

  beforeEach(function() {
    getPage('index.html');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Neural Net Builder');
    expect(browser.getCurrentUrl()).toContain('/index.html');
  });

  it('should have 4 components', function () {
    element(by.id('componentpanel')).all(by.tagName('li')).then(function(arr) {
      expect(arr.length).toBe(4);
    });
  });

  it('first should be a convolution component', function () {
    element.all(by.css('#componentpanel button')).first().getText().then(
      function(text) {
        expect(text).toEqual('Convolution');
    });
  });

  it('help on convolution component', function () {
    element(by.partialButtonText('Convolution')).$('span').click().then(function(data){
      //console.log("help window for convolution");
    });
  });

  it('help on fully connected component and check the more info link', function () {
    element(by.partialButtonText('FullyConnected')).$('span').click().then(function() {
      //check "More Info" link
      element(by.xpath('//a[.="More Info"]')).getAttribute('href').then(function(l) {
        expect(l).toMatch('http://cs231n.github.io/convolutional-networks/#fc');
      });
      // element(by.xpath('//a[.="More Info"]')).click().then(function() {
      //   browser.getAllWindowHandles().then(function(handles){
      //     let newTabHandle = handles[1];//new tab or window handle
      //     browser.switchTo().window(newTabHandle).then(function() {
      //       expect(browser.getCurrentUrl()).toMatch('http://cs231n.github.io/convolutional-networks/#fc');
      //       //browser.close();
      //     });
      //   });
      // });
    });
  });

  it('Drag and drop convolution', function () {
    element(by.partialLinkText('Download Prototxt')).click().then(function(data){
      //console.log("downloading prototxt");
      //console.log("data:" + data);
    });
  });

  it('generate a prototxt', function () {
    var scratch = element(by.id('mainpanel'));
    var conv = element.all(by.css('#componentpanel button')).first();
    var softmax = element.all(by.css('#componentpanel button')).last();
    browser.actions().dragAndDrop(conv, scratch).mouseUp().perform();
    browser.sleep(500);
  });

});
