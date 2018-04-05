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
/* global assert */
(function () {
  describe('Stress test', function () {
    var elements = [];
    var source;
    var source_prop = 'text';
    var target_prop = 'text';
    var n_elements = 1e4;
    this.timeout(10000);
    before(function (done) {

      var cb = function () {
        var target_container = document.querySelector('#container');

        // generate dom
        for (var i = 0; i < n_elements; i++) {
          var el = document.createElement('test-producer');
          elements.push(el);
          target_container.append(el);
        }
        source = elements[0];
        done();
      };

      if (!window.Polymer) {
        window.addEventListener('WebComponentsReady', cb);
      } else {
        cb();
      }
    });


    it('bind 999 to 1', function (done) {
      var times = 0;
      var N = n_elements - 1;
      var callbacks = function (n) {
        return function () {
          times++;
          if (times == N) {
            window.Interconnection.unbindElement(source);
            for (var i = 1; i < n_elements; i++) {
              elements[i].removeEventListener('text-changed', callbacks(N));
            }
            for (var i = 1; i < n_elements; i++) {
              assert.equal(elements[0][source_prop], elements[i][target_prop], 'Element ' + i +' should be equals to element 0');
            }
            done();
          }
        };
      };


      for (var i = 1; i < n_elements; i++) {
        elements[i].addEventListener('text-changed', callbacks(N));
        if (i > 0) {
          window.Interconnection.bind(source, source_prop, elements[i], target_prop);
        }
      }

      var start_time = new Date();
      source.set(source_prop, 'prueba' + N);
    });
  });
})();
