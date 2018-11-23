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
  'use strict';

  describe('Bind object elements', function () {
    var interconnection, el1, el2, el3;
    var assert = chai.assert;
    var expect = chai.expect;

    before(function (done) {
      var cb = function () {
        interconnection = window.Interconnection;
        el1 = document.querySelector('#test-object1');
        el2 = document.querySelector('#test-object2');
        el3 = document.querySelector('#test-object3');
        done();
      };

      if (!window.Polymer) {
        window.addEventListener('WebComponentsReady', cb);
      } else {
        cb();
      }
    });


    it('bind two single object', function () {
      interconnection.bind(el1, 'singleObject', el2, 'consumer');

      assert.deepEqual(el1.singleObject, el2.consumer, 'Both properties are different after binding');
      el1.set('singleObject.x', 1000);
      assert.exists(el2.consumer, ' El2 has not the same properties that el1. Consumer is missing');
      assert.exists(el2.consumer.x, ' El2 has not the same properties that el1. consumer.x is missing');
      assert.deepEqual(el2.consumer.x, 1000, 'Property should be 1000 because el1 property has changed');

      interconnection.unbindElement(el1);
    });

    it('bind three elements in cascade', function () {
      interconnection.bind(el1, 'singleObject', el2, 'consumer');
      interconnection.bind(el2, 'consumer', el3, 'consumer');
      assert.deepEqual(el1.singleObject, el2.consumer, 'Both properties are different after binding. el1.singleObject -> el2.consumer');
      assert.deepEqual(el2.consumer, el3.consumer, 'Both properties are different after binding. el2.consumer -> el3.consumer');

      el1.set('singleObject.x', 1000);

      assert.exists(el2.consumer, ' El2 has not the same properties that el1. Consumer is missing');
      assert.exists(el2.consumer.x, ' El2 has not the same properties that el1. consumer.x is missing');

      assert.exists(el3.consumer, ' El3 has not the same properties that el2. Consumer is missing');
      assert.exists(el3.consumer.x, ' El3 has not the same properties that el2. consumer.x is missing');

      assert.deepEqual(el2.consumer.x, 1000, 'Property should be 1000 because el1 property has changed');
      assert.deepEqual(el3.consumer.x, 1000, 'Property should be 1000 because el1 property has changed');

      interconnection.unbindElement(el1);
      interconnection.unbindElement(el2);
    });

    it('bind an object with a key that is an object', function () {
      interconnection.bind(el1, 'deep', el2, 'consumer');
      assert.deepEqual(el1.deep, el2.consumer, 'Both properties are different after binding');

      el1.set('deep.testx.x', 1000);
      assert.exists(el2.consumer, ' El2 has not the same properties that el1. Consumer is missing');
      assert.exists(el2.consumer.testx, ' El2 has not the same properties that el1. consumer.testx is missing');
      assert.exists(el2.consumer.testx.x, ' El2 has not the same properties that el1. consumer.testx.x is missing');

      assert.deepEqual(el2.consumer.testx.x, 1000, ' El2 has not the same properties that el1. consumer.testx.x is missing');

      el1.set('deep.testx', { x: 'change' });
      assert.deepEqual(el2.consumer.testx.x, 'change', ' El2 has not the same properties that el1. deep.testx changed but not in el2');

      el1.set('deep', { testx: { x: 1 }, testy: { y: 1 } });
      assert.deepEqual(el2.consumer, el1.deep, ' El2 has not the same properties that el1. Deep changes are not notified');

      interconnection.unbindElement(el1);
    });

    it('bind a deep property', function () {
      interconnection.bind(el1, 'deep.testx', el2, 'consumer');
      assert.deepEqual(el1.deep.testx, el2.consumer, 'Both properties are different after binding');

      el1.set('deep.testx', { x: 2 });

      assert.deepEqual(el2.consumer, el1.deep.testx, 'El2 has not the same properties that el1. el2.consumer has not change');

      el1.set('deep.testx', { y: 2 });
      assert.isUndefined(el2.consumer.x, 'Consumer doesnt change. consumer.x exist and el1 remove it');
      assert.deepEqual(el1.deep.testx, el2.consumer, 'El2 has not the same properties that el1. el2.consumer has not change');

      interconnection.unbindElement(el1);
    });

    it('multiple level ', function () {
      interconnection.bind(el1, 'deep', el2, 'consumer');
      interconnection.bind(el1, 'deep.testx', el3, 'consumer');

      el1.set('deep.testy.y', 3);

      assert.deepEqual(el1.deep, el2.consumer, 'El2 has not the same properties that el1. deep.testx changed but not in el2');
      assert.deepEqual(el2.testx, el3.consumer.testx, 'El3 has not the same properties that el1. deep.testx changed but not in el3');

      el1.set('deep.testx.x', 3);
      assert.deepEqual(el1.deep, el2.consumer, 'El2 has not the same properties that el1. deep.testx changed but not in el2');
      assert.deepEqual(el2.testx, el3.consumer.testx, 'El3 has not the same properties that el1. deep.testx changed but not in el3');

      interconnection.unbindElement(el1);
      interconnection.unbindElement(el2);
    });

    it('test an object with duplicated keys value object', function () {

      interconnection.bind(el1, 'doubleKey', el2, 'consumer');

      assert.deepEqual(el1.doubleKey, el2.consumer, 'el1 and el2 are not equals after binding');

      el1.set('doubleKey.doubleKey.x', 4);
      assert.deepEqual(el2.consumer, el1.doubleKey,
        'El2 has not the same properties that el1. doubleKey.doubleKey.x changed but not in el2');

      interconnection.unbindElement(el1);
    });

    it('consumer cant change the producer property', function () {
      interconnection.bind(el1, 'singleObject', el2, 'consumer');

      el2.set('consumer.x', 'my test');

      assert.notEqual(el2.consumer.x, el1.singleObject.x, 'el2 property must be independient to el1 property');

      interconnection.unbindElement(el1);
    });
  });
})();
