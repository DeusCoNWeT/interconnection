(function (window, document) {


  /* Extend object assign if it is not defined */
  if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
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
   * @module DomHandler Utils to interact with the DOM
   */
  var DomHandler = {}


  DomHandler.getElementProperties = function (element) {
    if (typeof element === "string") {
      try {
      element = document.querySelector(element);
      } catch(err){
        throw new Error("Element does not exist");
      }
    }
    if (!element) throw new Error("Element does not exist");
    var properties = {};

    // Inheritance properties
    if (element.behaviors) {
      element.behaviors.forEach(function (behaviour) {
        if (behaviour.properties)
          Object.assign(properties, behaviour.properties);
      });
    }

    // own properties
    Object.assign(properties, element.properties);
    return properties;
  }

  window.interconnection = {
    DomHandler: DomHandler
  };

})(window, document);

