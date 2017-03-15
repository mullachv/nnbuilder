describe("Neural Net Builder", function () {
    function getPage(page) {
        browser.get('http://localhost:9000/' + page);
        browser.sleep(200); // Wait for the first updateUI to arrive.
    }
    it("Should have title", function () {
        expect(browser.getTitle()).toEqual('Neural Net Builder');
    });
});
