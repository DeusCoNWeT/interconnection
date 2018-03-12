(function () {
  describe('Stress test', function () {
    var elements = [];
    var source;
    var source_prop = 'text';
    var target_prop = 'text';
    var n_elements = 1e4;
    before(function (done) {

      var target_container = document.querySelector('#container');
      
      // generate dom
      for (var i = 0; i < n_elements; i++) {
        var el = document.createElement('test-producer');
        elements.push(el);
        target_container.append(el);
      }
      source = elements[0];
      window.setTimeout(done, 500);
    });


    it('bind 999 to 1', function (done) {
      var times = 0;
      var N = n_elements-1;
      var callbacks = function (n) {
        return function () {
          times++;
          if (times == N) {
            window.Interconnection.unbindElement(source);
            for (var i = 1; i < n_elements; i++) {
              elements[i].removeEventListener('text-changed', callbacks(N));
            }
            for (var i = 1; i < n_elements; i++) {
              assert.equal(elements[0][source_prop], elements[i][target_prop], `Element ${i} should be equals to element 0`)
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

  })
})();