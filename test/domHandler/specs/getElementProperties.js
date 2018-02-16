(function () {

  var interconnection;
  var DomHandler;
  var testProducer;
  var assert = chai.assert;
  var expect = chai.expect;

  before(function () {
    interconnection = window.interconnection;
    DomHandler = interconnection.DomHandler;
  });

  describe("Check getElementProperties", function () {
    it('Check get element properties return an object', function () {
      var properties_element = DomHandler.getElementProperties("#test-producer");
      assert.isObject(properties_element, "Properties is not an object");
    });
    it('Check own properties', function () {
      var properties = DomHandler.getElementProperties("#test-producer");
      assert.isDefined(properties, "properties is undefined");

      // Check properties
      assert.isNotNull(properties.test, "Undefined 'test' property defined in test-producer component");
      assert.isUndefined(properties.behaviours, "Properties behaviours should be undefined");
    });

    it('Pass invalid element', function () {
      try {
        DomHandler.getElementProperties("");
        assert.fail("Should throw an error");
      } catch (err) {
        assert.instanceOf(err, Error, "Should throw an object instance of Error");
      }
    });

    it('Pass an HTML element', function () {
      var element = document.querySelector("test-producer");
      assert.isObject(DomHandler.getElementProperties(element), "Should return an object");
    });

    // it('Should return the properties defined by behaviour', function () {
    //   assert.fail(null, null, "Not implemented yet");
    // });
  });
})();
