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
  var DomHandler;
  var testProducers;
  var assert = chai.assert;
  var el1, el2, el3, el4;
  var prop1 = 'text', prop2 = 'testing';

  before(function (done) {
    var cb = function(){
      interconnection = window.Interconnection;
      testProducers = document.querySelectorAll('test-producer');
      el1 = testProducers[0];
      el2 = testProducers[1];
      el3 = testProducers[2];
      el4 = testProducers[3];
      done();
    };
    if (!window.Polymer){
      window.addEventListener('WebComponentsReady', cb);
    } else {
      cb();
    }
  });

  describe('Check binding string properties', function () {

    it('Connecting elements', function () {
      var prop1 = 'text';


      var text = 'testing text';
      interconnection.bind(el1, prop1, el2, prop1);

      el1.set(prop1, text);
      assert.equal(el2[prop1], text, 'The text of both elements is not the same after binding them.');

      interconnection.bind(el2, prop1, el3, prop1);
      assert.equal(el3[prop1], text, 'After binding, both properties must be the same.');

      var text2 = 'second text';
      el1.set(prop1, text2);
      assert.equal(el3[prop1], text2, 'The text of both elements is not the same after binding them.');
    });

    it('Unbinding element consumer', function () {
      try {
        interconnection.unbindConsumer();
        assert.fail(null, null, 'element is not defined. It should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should throw an error');
      }
      var noCE = document.querySelector('#noCustomElement');

      try {
        interconnection.unbindConsumer(noCE, null);
        assert.fail(0, 1, 'element is not a custom element. It should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should throw an error');
      }



      interconnection.unbindConsumer(el2, prop1);

      el1.set(prop1, '');
      assert.notEqual(el1[prop1], el2[prop1], 'After unbind a consumer, both properties change at same time');

      el2.set(prop1, 'testing');
      assert.equal(el2[prop1], el3[prop1], 'After unbind el2 of el1, el3 is unbinded too');

    });

    it('Unbinding element producer with only one consume', function () {

      try {
        interconnection.unbindProducer();
        assert.fail(null, null, 'element is not defined. It should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should throw an error');
      }
      var noCE = document.querySelector('#noCustomElement');

      try {
        interconnection.unbindProducer(noCE, null);
        assert.fail(0, 1, 'element is not a custom element. It should throw an error');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should throw an error');
      }

      interconnection.unbindProducer(el2, prop1);

      el2.set(prop1, 'testing 2');
      assert.notEqual(el2[prop1], el3[prop1], 'After unbind a producer, both properties change at same time');
    });
    it('Unbind an element', function () {
      interconnection.bind(el1, prop1, el2, prop1);
      interconnection.bind(el2, prop1, el3, prop1);

      interconnection.bind(el1, prop2, el3, prop2);

      interconnection.unbindElement(el2);
      assert.isTrue(interconnection.isPropertyBinded(el1, prop2), 'Element 1 should be binded');
      assert.isFalse(interconnection.isBinded(el2), 'Element 2 should be unbinded');
      assert.isTrue(interconnection.isPropertyBinded(el3, prop2), 'Element 3 should be binded');

      interconnection.unbindElement(el1);
      assert.isFalse(interconnection.isPropertyBinded(el3, prop2), 'Element 3 should be unbinded');
    });
    it('Binding two elements to one', function () {

      el1.set(prop1, '');
      el2.set(prop1, '');
      el3.set(prop1, '');

      interconnection.bind(el1, prop1, el2, prop1);
      interconnection.bind(el1, prop1, el3, prop1);

      el1.set(prop1, 'testing text');

      assert.equal(el2[prop1], 'testing text', 'After binding, both properties must be the same');
      assert.equal(el3[prop1], 'testing text', 'After binding, both properties must be the same.');

    });

    it('Unbinding a producer with two consumers', function () {

      interconnection.unbindProducer(el1, prop1);

      el1.set(prop1, 'unbinding multiple consumers');

      assert.notEqual(el2[prop1], el1[prop1], 'After unbinding, both properties must be different');
      assert.notEqual(el3[prop1], el1[prop1], 'After unbinding, both properties must be different');

      el1.set(prop1, '');
      el2.set(prop1, '');
      el3.set(prop1, '');
    });

    it('Binding a consumer to two producer', function () {
      interconnection.bind(el1, prop1, el2, prop1);

      try {
        interconnection.bind(el1, prop2, el2, prop1);
        assert.fail(0, 1, 'Must be throw an error. A property cannot be binded to two sources');
      } catch (err) {
        assert.instanceOf(err, Error, 'Error should be an instance of Error');
        interconnection.unbindProducer(el1, prop1);
      }
    });

    it('Remove all bindings of an element and property', function () {

      interconnection.bind(el1, prop1, el2, prop1);
      interconnection.bind(el2, prop1, el3, prop1);

      el1.set(prop1, 'test');

      assert.equal(el2[prop1], 'test', 'Element 2 must be connected to element 1');

      el1.set(prop1, '');

      interconnection.unbind(el2, prop1);
      el1.set(prop1, 'testing');

      assert.notEqual(el2[prop1], el1[prop1], 'Element 1 and element 2 should be unbinded after unbind');
      el2.set(prop1, 'testing2');
      assert.notEqual(el2[prop1], el3[prop1], 'Element 2 and element 3 should be unbinded after unbind');
      el1.set(prop1, '');
      el2.set(prop1, '');
    });

    it('Try to bind no custom elements', function () {

      var noCE = document.querySelector('#noCustomElement');
      var noCE2 = document.querySelector('#noCustomElement2');

      try {
        interconnection.bind(noCE, 'text', el1, prop1);
        assert.fail(0, 1, 'It should throw an error if consumer is not a custom element');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }

      try {
        interconnection.bind(el1, prop1, noCE, 'text');
        assert.fail(0, 1, 'It should throw an error if producer is not a custom element');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }

      try {
        interconnection.bind(noCE, 'text', noCE2, 'text');
        assert.fail(0, 1, 'It should throw an error if both are not custom elements');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }



    });

    it('Try to bind not HTMLElements', function () {
      try {
        interconnection.bind('', 'text', el1, prop1);
        assert.fail(0, 1, 'It should throw an error if consumer is not a HTMLElement');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }

      try {
        interconnection.bind(el1, prop1, '', 'text');
        assert.fail(0, 1, 'It should throw an error if producer is not a HTMLElement');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }

      try {
        interconnection.bind('', 'text', '', 'text');
        assert.fail(0, 1, 'It should throw an error if both are not HTMLElements');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be instance of error');
      }
    });

    it('Trying to connect an element to itself', function () {

      try {
        interconnection.bind(el1, prop1, el1, prop1);
        assert.fail(0, 1, 'It should throw an error if consumer and producer are the same element');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
    });

    it('Trying to connect empty element', function () {
      try {
        interconnection.bind(null, undefined, el2, prop1);
        assert.fail(0, 1, 'It should throw an error if consumer element is empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
      try {
        interconnection.bind(el1, prop1, null, undefined);
        assert.fail(0, 1, 'It should throw an error if producer element is empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
      try {
        interconnection.bind(null, undefined, null, undefined);
        assert.fail(0, 1, 'It should throw an error if consumer and producer element are empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
    });
    it('Trying to connect unknow property', function () {

      try {
        interconnection.bind(el1, undefined, el2, prop1);
        assert.fail(0, 1, 'It should throw an error if consumer property is empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
      try {
        interconnection.bind(el1, prop1, el2, '');
        assert.fail(0, 1, 'It should throw an error if producer property is empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }
      try {
        interconnection.bind(el1, undefined, el2, undefined);
        assert.fail(0, 1, 'It should throw an error if consumer and producer property are empty');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }

      try {
        interconnection.bind(el1, prop1, el2, 'undefined');
        assert.fail(0, 1, 'It should throw an error if consumer is not a consumer property');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }

      interconnection.unbindElement(el1);
    });

    it('Trying to connect readonly property', function(){
      try {
        interconnection.bind(el1, prop1, el2, 'onlyProducer');
        assert.fail(0, 1, 'It should throw an error if consumer property is read only');
      } catch (err) {
        assert.instanceOf(err, Error, 'It should be an error');
      }

      try{
        interconnection.bind(el1,'onlyProducer', el2, prop1);

      } catch(err){
        assert.fail(0,1, 'It should not throw an error binding a readOnly property as consumer');
      }
      interconnection.unbindElement(el1);

    });

    it('Check if a custom element is binded', function () {

      assert.isFalse(interconnection.isBinded(null, 'isBinded should return false if element is not registered or is empty'));
      assert.isFalse(interconnection.isBinded(el1), 'Element 1 should be unbinded');
      interconnection.bind(el1, prop1, el2, prop1);
      assert.isTrue(interconnection.isBinded(el1), 'Element 1 should be binded with element 2');
      assert.isTrue(interconnection.isBinded(el2), 'Element 2 should be binded with element 3');
      interconnection.unbindElement(el2);

    });

    it('Check if a custom element property is binded', function () {

      assert.isFalse(interconnection.isPropertyBinded(el1, prop1), 'Element 1 text is not binded');
      assert.isFalse(interconnection.isPropertyBinded(el1, null), 'It should be false. Property is not defined');
      assert.isFalse(interconnection.isPropertyBinded(null, null), 'It should be false. Element is not defined');

      interconnection.bind(el1, prop1, el2, prop1);

      assert.isTrue(interconnection.isPropertyBinded(el1, prop1), 'Element 1 text is binded with element 2 text');
      assert.isTrue(interconnection.isPropertyBinded(el1, prop1), 'Element 2 text is binded with element 1 text');

      interconnection.unbindElement(el1);

    });


    it('Check if a property is consuming or producing data', function () {

      assert.isFalse(interconnection.isConsumer(el1, prop1), 'Element 1 text is not consuming data');
      assert.isFalse(interconnection.isProducer(el1, prop1), 'Element 1 text is not producing data');

      interconnection.bind(el1, prop1, el2, prop1);
      assert.isTrue(interconnection.isConsumer(el2, prop1), 'Element 2 text is consuming data');
      assert.isTrue(interconnection.isProducer(el1, prop1), 'Element 1 text is producing data');

      interconnection.unbindElement(el1);

    });

  });
})();
