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
  var targetElement;
  var assert = chai.assert;
  var expect = chai.expect;

  before(function (done) {
    var cb = function () {
      interconnection = window.Interconnection;
      targetElement = document.querySelector('test-producer');
      done();
    };

    if (!window.Polymer) {
      window.addEventListener('WebComponentsReady', cb);
    } else {
      cb();
    }
  });

  describe('Check getElementProperties', function () {
    it('Check get element properties return an object', function () {
      var properties_element = interconnection.getElementProperties('#test-producer1');
      assert.isObject(properties_element, 'Properties is not an object');
    });
    it('Pass invalid element', function () {
      try {
        interconnection.getElementProperties('');
        assert.fail(null, null, 'Should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'Should throw an object instance of Error');
      }
    });

    it('Pass an HTML element', function () {
      assert.isObject(interconnection.getElementProperties(targetElement), 'Should return an object');
    });

    it('Check own properties', function () {
      var properties = interconnection.getElementProperties(targetElement);
      assert.isDefined(window.Polymer);
      assert.isDefined(window.Polymer.telemetry);
      assert.isDefined(properties, 'properties is undefined');
      // Check properties
      assert.isNotNull(properties.test, 'Undefined "test" property defined in test-producer component');
    });

    it('Check inherited properties', function () {
      var properties = interconnection.getElementProperties(targetElement);
      assert.isNotNull(properties.inheritedProperty, 'inhereted properties are missing');

    });

    it('Should throw an error. Invalid HTMLElement', function () {
      try {
        interconnection.getElementProperties(document.createElement('div'));
      } catch (err) {
        assert.instanceOf(err, Error, 'Should throw an object instance of Error');
      }
    });

    it('Should remove private properties', function () {
      var properties = interconnection.getElementProperties(targetElement, true);
      assert.isFalse(Object.keys(properties).some(prop => prop.charAt(0) === '_'))
    })
  });
})();
