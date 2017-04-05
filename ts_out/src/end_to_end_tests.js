//
describe('Neural Net Builder', function () {
    function getPage(page) {
        browser.get('http://localhost:4000/' + page);
        browser.sleep(200); // Wait for the first updateUI to arrive.
    }
    beforeEach(function () {
        getPage('index.html');
    });
    function getDiv(row, col) {
        return element(by.id('componentpanel'));
    }
    it('should have a title', function () {
        expect(browser.getTitle()).toEqual('Neural Net Builder');
    });
    // it('should have a components panel', function () {
    //   expect(browser.getTitle()).toEqual('Neural Net Builder');
    // });
});
