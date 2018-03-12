(function () {
  var elements = [];
  var source;
  var source_prop = 'text';
  var target_prop = 'text';
  var render_elements = 1e5;
  var start_time;
  var _start_time;
  // Elements
  var results_container = document.querySelector('#results');
  var target_container = document.querySelector('#container');
  var chart_container = document.querySelector('#chart');
  var ex_btn = document.querySelector('button');
  var ex_sub = document.querySelector('input');

  // new elements container
  var container = document.createDocumentFragment();
  var g_chart;

  ex_btn.addEventListener('click', function () {
    var number = parseInt(ex_sub.value);
    if (number > 1) {
      execute_plan(number).then(function (e) {
        var ex_time = e.end_time - start_time;
        print_results(e.end_time, e.start_time, number);
        print_chart();
      });
    }
  });

  // Add callback when all new elements are ready
  var mutation = new MutationObserver(function (mutation) {
    container.dispatchEvent(new Event('dom-ready'));
  });

  var mutation_conf = { childList: true, subtree: true };
  mutation.observe(target_container, mutation_conf)


  // Results structure
  var results = {
    ex_time: [],
    throughtput: [],
    label: []
  };

  // generate dom
  var generateDom = function (nelements) {

    for (var i = 0; i < nelements + 1; i++) {
      var el = document.createElement('test-producer');
      elements.push(el);
      container.appendChild(el);
    }
    target_container.appendChild(container);
    source = elements[0];

  };

  /// Generate chart
  var print_chart = function () {
    var chart = document.querySelector('#_chart');
    if (g_chart) {
      g_chart.update();
    } else {
      chart = document.createElement('canvas');
      chart.height = "500";
      chart.width = "600";
      chart.id = "_chart";
      chart_container.append(chart);
      var ctx = chart.getContext('2d');
      var config = {
        type: 'line',
        data: {
          datasets: [{
            data: results.throughtput,
            backgroundColor: [
              "#77DEC1"
            ],
            label: 'msg/s'
          }],
          labels: results.label
        },
        options: {
          responsive: true,
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Throughtput Chart'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem) {
                return new Intl.NumberFormat('es-Es').format(tooltipItem[0].xLabel) + " Subscribers";
              },
              label: function (tooltipItem) {
                return new Intl.NumberFormat('es-Es').format(tooltipItem.yLabel) + " msg/s";
              }
            }
          }
        }
      };

      g_chart = new Chart(ctx, config);
    }
  };

  // Print results 
  var print_results = function (end, start, N) {
    var tr = document.createElement('tr');
    var $nsub = document.createElement('td');
    var $execution = document.createElement('td');
    var $msgs = document.createElement('td');

    tr.append($nsub);
    tr.append($execution);
    tr.appendChild($msgs);

    var ex_time = end - start;
    var throughtput = N / (ex_time / 1000);

    $nsub.innerHTML = N;
    $execution.innerHTML = Intl.NumberFormat('es-ES', { maximumSignificantDigits: 4 }).format(ex_time);
    $msgs.innerHTML = Intl.NumberFormat('es-ES', { maximumSignificantDigits: 4 }).format(throughtput);

    $execution.title = Intl.NumberFormat('es-ES', { maximumSignificantDigits: 15 }).format(ex_time) + 'ms';
    $msgs.title = Intl.NumberFormat('es-ES', { maximumSignificantDigits: 15 }).format(throughtput) + 'msg/s';
    results_container.append(tr);

    results.ex_time.push(ex_time)
    results.throughtput.push(throughtput);
    results.label.push(N);
  };

  // Execute plan with N elements
  var execute_plan = function (N) {
    if (elements.length < N) {
      generateDom(N - elements.length);
    }

    return new Promise(function (resolve, reject) {
      var cb;
      var new_value = 'testing' + N;

      var callbacks = function (n) {
        var times = 0;
        var end_time;
        return function (e) {
          if (e.detail.value != null){ times++;}
          
          var change = true;
          // all elementes changed
          if (times == n) {
            end_time = window.performance.now();
            console.log( (end_time-start_time) + 'ms');
            for (i=0;i<N;i++){
              if (elements[i].text != new_value){
                //console.error('Falla en el elemento ' + i + '. Deberia ser ' + new_value + ' y es ' + elements[i].text);
                change = false;
              }
            }
            for (var i = 0; i < N; i++) {
              elements[i + 1].removeEventListener('text-changed', cb);
            }
            // if (change){
              source.set('text',null);
              for (var i = 0; i < N; i++) {
                window.Interconnection.unbindElement(elements[i]);
              // }
            }
            resolve({ end_time: end_time, start_time: start_time });
          }
        };
      };

      cb = callbacks(N);
      // Bind elements and add listenre
      for (var i = 0; i < N; i++) {
        elements[i + 1].addEventListener('text-changed', cb);
        //window.Interconnection.bind(source, source_prop, elements[i + 1], target_prop);
        window.Interconnection.bind(elements[i],target_prop, elements[i+1],target_prop);
      }

      // execute plan
      start_time = window.performance.now();
      _start_time = new Date().getTime();
      source.set(source_prop, new_value);
    });
  };




})();
