/*
 * (C) Copyright 2018 Universidad Politécnica de Madrid.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Contributors:
 *     Miguel Ortega Moreno
 */
(function () {

  var interconnection;
  var testProducer;
  var assert = chai.assert;

  before(function (done) {
    var cb = function(){
      interconnection = window.Interconnection;
      done();
    };
    if (!window.Polymer){
      window.addEventListener('WebComponentsReady', cb);
    } else {
      cb();
    }
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
