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
  var body;

  before(function (done) {
    var cb = function () {
      interconnection = window.Interconnection;
      body = document.querySelector('#container');
      done();
    };

    if (!window.Polymer) {
      window.addEventListener('WebComponentsReady', cb);
    } else {
      cb();
    }
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

    it('Remove a element', function (done) {
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
