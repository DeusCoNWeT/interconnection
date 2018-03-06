(function () {

  var interconnection;
  var testProducer;
  var assert = chai.assert;

  before(function () {

    if (window.__html__) {
      document.write(window.__html__['domHandlerDefinition.test']);
    }
    interconnection = window.Interconnection;
  });

  describe('Check definition of DomHandler', function () {

    it('Check if DomHandler is defined', function () {
      assert.isDefined(interconnection, 'Interconnection is not defined');
    });

  });
})();
