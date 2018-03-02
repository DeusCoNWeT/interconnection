(function (window, document) {

  // Init
  var body = document.querySelector('html');
  var Polymer = window.Polymer;
  var mutation_conf = { childList: true, subtree: true };

  /**
   * @class ElementMap 
   * @classdesc Class to create a binding class of a HTMLElement 
   * @param {HTMLElement} element Element that will be mapped
   * @property {Object} properties Properties of the HTMLElement. Include inherit properties
   * @property {Object} consumers_prop Data consuming properties
   * @property {Object} producers_prop Data producing properties
   * @property {HTMLElement} model HTMLElement provided by Polymer
   * @property {Array} observers List of function that be called when an property changes
  */
  var ElementMap = function (element) {

    this.element = element;

    this.properties = Interconnection.getBindingProperties(element);

    this.consumers_prop = this.properties.__consumers;

    this.producers_prop = this.properties.__producers;

    this.model = Polymer.telemetry.registrations.find(function (el) { return el.is == element.tagName.toLowerCase(); });

    this.observers = {};
    this.listeners = {};

    delete this.properties.__consumers;
    delete this.properties.__producers;
  };

  /**
     *
     * @param {Function} fn Function that is called when the property change
     * @param {String} prop Property to be observerd
     * @param {HTMLElement}
     */
  ElementMap.prototype.createObserver = function (prop, target_el, target_prop, fn) {
    // TODO: evitar duplicados (?)
    // TODO: evitar bucles
    this.observers[prop] = this.observers[prop] || [];

    var observer = {
      fn: fn,
      target_el: target_el,
      target_prop: target_prop
    };
    this.observers[prop].push(observer);
  };

  /**
   * 
   * @param {HTMLElement} source_element Element from which data is to be consumed
   * @param {String} source_property Property of the element form which data is to be consumed
   * @param {String} target_prop Property where data will be written when the source property changes
   * @param {Function} fn Function that is called when the source property changes
   */
  ElementMap.prototype.createListener = function (source_element, source_property, target_prop, fn) {
    // TODO:  evitar duplicados (?)
    // TODO: evitar bucles

    var listener = {
      source_el: source_element,
      source_prop: source_property,
      target_prop: target_prop,
      fn: fn
    };

    // REVIEW: Solo se permite que una variable consuma datos de una fuente.
    // ¿Permitir N a N? Cambiar el modelo por una lista en ese caso. 
    // Empeora el problema de busqueda      
    if (this.listeners[target_prop]) {
      throw new Error('Property ' + target_prop + 'is already connected');
    }

    this.listeners[target_prop] = listener;
  };



  /**
   * Interconnection module
   * @exports Interconnection
   *
   */
  var Interconnection = {
    __customElements: {},
    __elementsMap: new WeakMap(),
    /**
     * Dom observer to record when adding or deleting items
     */
    __domObserver: (function () {
      var mutation = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          // NodeList for each issues
          [].forEach.call(mutation.addedNodes, function (added) {
            if (Interconnection.isCustomelement(added)) {
              // TODO: registrar cuando se añade y se elimina un elemento
              Interconnection._addListener(added);
            }
          });
        });
      });
      mutation.observe(body, mutation_conf);
      return mutation;
    })(),

    /**
     * Add a custom element in the binding map
     * @param {HTMLElement} element Element that is registered in the binding map
     */
    _addListener: function (element) {
      this.__elementsMap.set(element, new ElementMap(element));
    },
    /**
     * Get all custom elements registered in the dom
     * @return {Array} Node list of custom elements in the dom
     */
    getCustomElements: function () {
      if (window.Polymer === undefined) {
        throw new Error('Polymer is not defined');
      } else {
        if (window.Polymer.telemetry) {
          var ce_registered = window.Polymer.telemetry.registrations.map(function (el) {
            return el.is;
          });

          if (ce_registered === undefined || ce_registered.length == 0) {
            console.log('There is no custom elements');
            return ce_registered;
          } else {
            return document.querySelectorAll(ce_registered.join(','));
          }
        }
      }
    },

    /**
     * Register an model property of a custom element in order to notify each time it changes
     * @param {HTMLElement} model Custom element model provided by polymer
     * @param {String} property Model property that is listened to each time it changes
     */
    _createEffect: function (model, property) {
      var name = model.is;
      this.__customElements[name] = this.__customElements[name] || {};

      if (this.__customElements[name][property] == undefined) {
        var fx = Polymer.Bind.ensurePropertyEffects(model, property);
        var propEffect = {
          kind: 'binding',
          fn: Interconnection._notifyObservers
        };
        fx.push(propEffect);
        this.__customElements[name][property] = propEffect;
      }
    },
    /**
     * Get all properties of a custom element including inherited properties
     * @param {HTMLElement} element Custom element from which the properties are to be obtained
     * @return {Object} All element properties
     */
    getElementProperties: function (element) {
      if (typeof element === 'string') {
        try {
          element = document.querySelector(element);
        } catch (err) {
          throw new Error('Element does not exist');
        }
      }
      var properties = {};

      // Inheritance properties
      if (element.behaviors) {
        element.behaviors.forEach(function (behaviour) {
          if (behaviour.properties) {
            Polymer.Base.extend(properties, behaviour.properties);
          }
        });
      }

      // own properties
      Polymer.Base.extend(properties, element.properties);
      return properties;
    },

    /**
     * Check if an element is a custom element
     * @param {HTMLElement} element Element to be checked
     * @return {Boolean} If it is a custom element or
     */
    isCustomelement: function (element) {
      return element instanceof HTMLElement && element.is !== undefined;
    },
    /**
     * Take all the properties of an element differentiating between consuming and producing properties.
     * A property is consumer and producer unless readOnly is set to true
     * @param {HTMLElement} element Custom element from which the properties are to be obtained
     * @return {Object} Object with all the properties of the element and the __cosumers 
     * and __producers variables that include each of the properties that consume and produce
     * data respectively.
     */
    getBindingProperties: function (el) {
      var properties = Interconnection.getElementProperties(el);
      var bindingProperties = {
        __consumers: {},
        __producers: {}
      };

      for (var prop_name in properties) {
        if (properties.hasOwnProperty(prop_name)) {
          var prop_value = properties[prop_name];
          prop_value.producer = true;

          // set as consumer
          if (!properties.readOnly && !properties.computed) {
            prop_value.consumer = true;
            bindingProperties.__consumers[prop_name] = prop_value;
          }
          bindingProperties.__producers[prop_name] = prop_value;
          bindingProperties[prop_name] = prop_value;
        }
      }
      return bindingProperties;
    },

    /**
     * Connect two properties of two elements.
     * 
     * @param {HTMLElement} el_source Element that will produce the data
     * @param {String} prop_source Property that will produce the data
     * @param {HTMLElement} el_target Element that will consume the data
     * @param {String} prop_target Property that will consume the data
     */

    bind: function (source_el, source_prop, target_el, target_prop) {
      // TODO: comprobar si ambos elementos existen asi como las propiedades
      // TODO: comprobar que la variable productor lo es y que la consumidora lo es.
      var source_map = Interconnection.__elementsMap.get(source_el);
      var target_map = Interconnection.__elementsMap.get(target_el);

      var fn = function (source, value, effect, old, fromAbove) {
        target_el.set(target_prop, value);
      };

      target_map.createListener(source_el, source_prop, target_prop, fn);
      source_map.createObserver(source_prop, target_el, target_prop, fn);
      this._createEffect(source_map.model, source_prop);
    },

    /**
     * Notify to all observer that a property of an element has changed
     * @param {String} source Property that produce the change
     * @param {Any} value New value of the property
     * @param {Any} effect Effect defined for this type of notification (currently unused) 
     * @param {Any} old Last value of the property
     * @param {Any} fromAbove Provided by Polymer (currently unused)
     */
    _notifyObservers: function (source, value, effect, old, fromAbove) {
      var el_map = Interconnection.__elementsMap.get(this);
      var observers = el_map.observers[source];

      if (observers) {
        observers.forEach(function (observer) { observer.fn(source, value, effect, old, fromAbove); });
      }
    },

    /**
     * Unbind a property of a custom element of consuming data
     * @param {HTMLElement} target_el Consumer element
     * @param {String} target_prop Consumer property
     */
    unbindconsumer: function (target_el, target_prop) {
      // TODO: check if a consumer
      var el_map = this.__elementsMap.get(target_el);
      var listener = el_map.listeners[target_prop];
      if (!listener) {
        return ;
      }

      delete el_map.listeners[target_prop];

      var source_map = this.__elementsMap.get(listener.source_el);
      var idx = source_map.observers[listener.source_prop].indexOf(listener.fn);

      source_map.observers[listener.source_prop].splice(idx, 1);
    },
    /**
     * Unbind a property of a custom element of producing data
     * @param {HTMLElement} target_el Producer element
     * @param {String} target_prop Producer property
     */
    unbindproducer: function (target_el, target_prop) {
      // TODO: check if a producer
      var el_map = this.__elementsMap.get(target_el);

      var observers = el_map.observers[target_prop];
      el_map.observers[target_prop] = [];

      var that = this;
      observers.forEach(function (observer) {
        delete that.__elementsMap.get(observer.target_el).listeners[observer.target_prop];
      });
    }
  };




  window.Interconnection = Interconnection;

})(window, document);

