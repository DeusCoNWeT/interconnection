(function (window, document) {


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


  DomHandler.getElementProperties = function (element) {
    if (typeof element === "string") {
      try {
        element = document.querySelector(element);
      } catch (err) {
        throw new Error("Element does not exist");
      }
    }
    if (!element) { throw new Error("Element does not exist"); }
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

