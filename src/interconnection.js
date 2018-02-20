(function (window, document) {

  // Init
  var body = document.querySelector('html');
  var mutation_conf = { childList: true, subtree: true };

  var observer = new MutationObserver(function (mutations) {
    // Check if an element added is a custom element
    // mutations.forEach(function (mutation) {
    //   mutation.addedNodes.forEach(function(added){
    //     console.log(added);
    //   });
    // });
  });

  observer.observe(body, mutation_conf);

  /* Object assign is a characteristic of ES6. ES6 only available in phantomjs 2.5 */
  if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
      'use strict';
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      target = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source != null) {
          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }

  /**
   * @module DomHandler
   *
   */
  var DomHandler = {};

  DomHandler.getCustomElements = function(){
    var list =[];
    var list2 =[];
    Polymer.telemetry.registrations.forEach(function(el){
      list.push(el.is);
      console.log(el.is);
    });
    list2 = list.map(function(el){return document.querySelectorAll(el);
    });
   
  };

  DomHandler.getElementProperties = function (element) {
    if (typeof element === 'string') {
      try {
        element = document.querySelector(element);
      } catch (err) {
        throw new Error('Element does not exist');
      }
    }
    if (!element) { throw new Error('Element does not exist'); }
    var properties = {};

    // Inheritance properties
    if (element.behaviors) {
      element.behaviors.forEach(function (behaviour) {
        if (behaviour.properties) {
          Object.assign(properties, behaviour.properties);
        }
      });
    }

    // own properties
    Object.assign(properties, element.properties);
    return properties;
  };


  window.interconnection = {
    DomHandler: DomHandler
  };

})(window, document);

