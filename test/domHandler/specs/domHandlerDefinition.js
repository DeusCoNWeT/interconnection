(function () {

  var interconnection;
  var DomHandler;
  var testProducer;
  var assert = chai.assert;

  before(function(){
    interconnection = window.interconnection;
    DomHandler = interconnection.DomHandler;
  });

  describe('Check definition of DomHandler', function() {

    it('Check if DomHandler is defined', function() {
      assert.isDefined(interconnection, 'Interconnection is not defined');
      assert.isDefined(DomHandler, 'DomHandler is not defined');
    });

  });
})();
