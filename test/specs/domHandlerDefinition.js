(function () {

  var interconnection;
  var testProducer;
  var assert = chai.assert;

  before(function () {
    interconnection = window.Interconnection;
  });

  describe('Check definition of DomHandler', function () {

    it('Check if DomHandler is defined', function () {
      assert.isDefined(interconnection, 'Interconnection is not defined');
    });


  });
})();
