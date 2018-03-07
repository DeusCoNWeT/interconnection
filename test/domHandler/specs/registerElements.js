(function () {

  var interconnection;
  var testProducer;
  var assert = chai.assert;
  var body;
  
  before(function () {

    if (window.__html__) {
      document.write(window.__html__['registerElements']);
    }
    interconnection = window.Interconnection;
    body = document.querySelector('#container');
  });

  describe('Add and remove custom elements dynamically', function () {

    it('Register a new element', function (done) {
      var el = document.createElement('test-producer');
      el.id = '_mocha_test-component';
      var mutation = new MutationObserver(function (mutations) {
        assert.isTrue(interconnection.elementsMap.has(el), 'New element is not registed in the binding map');
        mutation.disconnect();
        done();
      });
      mutation.observe(body, { childList: true, subtree: false });
      body.append(el);

    });

    it('Remove a element', function(done){
      var el = document.querySelector('#_mocha_test-component');

      var mutation = new MutationObserver(function (mutations) {
        assert.isFalse(interconnection.elementsMap.has(el), 'New element is not registed in the binding map');
        mutation.disconnect();
        done();
      });
      mutation.observe(body, { childList: true, subtree: false });
      el.remove();
    });
  });
})();
