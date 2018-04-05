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

  describe('Bind array property', function () {
    var interconnection, el1, el2, el3;
    var assert = chai.assert;
    var expect = chai.expect;

    before(function (done) {
      var cb = function () {
        interconnection = window.Interconnection;
        el1 = document.querySelector('#test-array');
        el2 = document.querySelector('#test-array2');
        el3 = document.querySelector('#test-array3');
        done();
      };

      if (!window.Polymer) {
        window.addEventListener('WebComponentsReady', cb);
      } else {
        cb();
      }
    });
    it('bind two arrays', function () {
      interconnection.bind(el1, 'simpleArray', el2, 'consumer');
      var init_length = el1.simpleArray.length;

      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after binding');

      //push
      el1.push('simpleArray', 10);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after push');
      assert.equal(el2.consumer.length, init_length + 1, 'Array length is not increased after push');

      // splice
      el1.push('simpleArray', 10);
      el1.splice('simpleArray', init_length, 2);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after splice');
      assert.equal(el2.consumer.length, init_length, 'Array length is not increased after splice');

      //pop
      el1.push('simpleArray', 10);
      el1.pop('simpleArray');
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after pop');
      assert.equal(el2.consumer.length, init_length, 'Array length is not increased after pop');


      // multiple push
      el1.push('simpleArray', 10, 11);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after multiple push');
      assert.equal(el2.consumer.length, init_length + 2, 'Array length is not increased after multiple push');
      el1.splice('simpleArray', init_length, 2);

      // unshift
      el1.unshift('simpleArray', 10);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after shift');
      assert.equal(el2.consumer.length, init_length + 1, 'Array length is not increased after shift');

      //shift
      el1.shift('simpleArray');
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after shift');
      assert.equal(el2.consumer.length, init_length, 'Array length is not increased after shift');

      // multiple unshift
      el1.unshift('simpleArray', 10, 11);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'Both properties are different after multiple unshift');
      assert.equal(el2.consumer.length, init_length + 2, 'Array length is not increased after multiple unshift');
      el1.splice('simpleArray', 0, 2);

      interconnection.unbindElement(el1);
      interconnection.unbindElement(el2);
    });

    it('bind three elements in cascade', function () {
      interconnection.bind(el1, 'simpleArray', el2, 'consumer');
      interconnection.bind(el2, 'consumer', el3, 'consumer');

      var init_length = el1.simpleArray.length;
      assert.deepEqual(el1.simpleArray, el2.consumer, 'el2 and el1 properties are different after binding');
      assert.deepEqual(el1.simpleArray, el3.consumer, 'el3 and el1 properties are different after binding');

      el1.push('simpleArray', 10);
      assert.deepEqual(el1.simpleArray, el2.consumer, 'el2 consumer are different after push');
      assert.equal(el2.consumer.length, init_length + 1, 'el2 consumer length is not increased after push');

      assert.deepEqual(el1.simpleArray, el3.consumer, 'el3 consumer are different after push');
      assert.equal(el3.consumer.length, init_length + 1, 'el3 consumer length is not increased after push');

      el1.pop('simpleArray');

      assert.deepEqual(el1.simpleArray, el2.consumer, 'el2 consumer are different after pop');
      assert.equal(el2.consumer.length, init_length, 'el2 consumer length is not increased after pop');

      assert.deepEqual(el1.simpleArray, el3.consumer, 'el3 consumer are different after pop');
      assert.equal(el3.consumer.length, init_length, 'el3 consumer length is not increased after pop');

      interconnection.unbindElement(el1);
      interconnection.unbindElement(el2);
    });

    it('bind two array of objects', function () {
      interconnection.bind(el1, 'arrayObject', el2, 'consumer');
      var init_length = el1.arrayObject.length;

      assert.deepEqual(el1.arrayObject, el2.consumer, 'el2 and el1 properties are different after binding');

      // push
      el1.push('arrayObject', { test: 'test' });
      assert.deepEqual(el1.arrayObject, el2.consumer, 'el2 consumer are different after push');
      assert.equal(el2.consumer.length, init_length + 1, 'el2 consumer length is not increased after push');

      // pop
      el1.pop('arrayObject');
      assert.deepEqual(el1.arrayObject, el2.consumer, 'el2 consumer are different after pop');
      assert.equal(el2.consumer.length, init_length, 'el2 consumer length is not increased after pop');

      // modify an object
      el1.push('arrayObject', { test: 'test' });
      var path = init_length + '.test';
      el1.set('arrayObject.' + path, 'prueba');

      assert.equal(el2.consumer[init_length].test, 'prueba', 'el2 consumer n object doesnt change if el1 change');

      el1.splice('arrayObject', init_length, 1);
      assert.deepEqual(el1.arrayObject, el2.consumer, 'el2 consumer are different after slice');
      assert.equal(el2.consumer.length, init_length, 'el2 consumer length is not increased after slice');

      interconnection.unbindElement(el1);
      interconnection.unbindElement(el2);
    });
  });
})();
