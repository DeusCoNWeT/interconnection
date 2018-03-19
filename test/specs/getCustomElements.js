(function () {

  var interconnection;
  var testProducer;
  var assert = chai.assert;

  before(function () {
    interconnection = window.Interconnection;
  });

  describe('Check getCustomElements', function () {

    it('Check if DomHandler is defined', function () {
      assert.isDefined(interconnection, 'Interconnection is not defined');
    });

    it('Polymer is missing', function () {
      var _polymer = window.Polymer;

      window.Polymer = undefined;
      try {
        interconnection.getCustomElements();
        assert.fail(null, null, 'Polymer is  missing, it should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'Error should be an error');
        window.Polymer = _polymer;
      }
    });

    it('Check if list is empty', function () {
      var list = interconnection.getCustomElements();
      assert.instanceOf(list, NodeList, 'Should be an HTMLElement');
      assert.isNotEmpty(list, 'It should not be an empty array');
      list.forEach(function (element) {
        assert.instanceOf(element, HTMLElement, 'Should be an HTMLElement');
      });
    });

    it('Custom elements are defined', function(){
      
    });

  });
})();
