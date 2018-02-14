(function (window, document) {


  /**
   * @module DomHandler Utils to interact with the DOM
   */
  var DomHandler = {}


  DomHandler.getElementProperties = function (element) {
    if (typeof element === "string") element = document.querySelector(element);
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

