![Code Coverage-shield-badge-1](https://img.shields.io/badge/Code%20Coverage-97.44%25-brightgreen.svg)
[![CircleCI](https://circleci.com/gh/DeusCoNWeT/interconnection/tree/master.svg?style=svg)](https://circleci.com/gh/DeusCoNWeT/interconnection/tree/master)
![Interconnection](https://i.imgur.com/HOFmZy3.png)

# Polymer Interconnection

## What is Interconnection?
Polymer Interconnection is a JavaScript library that makes it posible to bind components properties dynamically. It uses polymer in order to bind components so it's require.
The library creates a window property `Interconnection` with high level functions to manipulate the binding between two components (consumer and producer. 

Interconnection is done using [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) and [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver). 

WeakMap is used to keep track of the binding information of the custom elements. Each key is a HTMLElement and their value is a Custom map of the componente [ElementsMap](https://deusconwet.github.io/interconnection/ElementMap.html).

Suppose we have the following component:

**my-component.html**
```html
<dom-module id="my-component">
    <template>
      <p>{{text}}</p>
    </template>
    <script>
        Polymer({
            is: 'my-component',
            properties: {
                text: {
                    type: String,
                    value: "",
                    readOnly: false
                }
            }
        });
    </script>
</dom-module>
```

Using the polymer syntax if we want to connect the property `text` of two `my-component` we have to use `{{}}` or `[[]]`.

```html
<my-component id="comp1" text="{{my_text}}"></my-component>
<my-component id="comp2" text="{{my_text}}"></my-component>
```

In this way, we can bind both properties but it is currently so hard to do it dynamycally using javascript. This library provides a function to bind them:

```javascript
let comp1 = document.querySelector('#comp1');
let comp2 = document.querySelector('#comp2');

// Bind comp1.text to comp2.text
Interconnection.bind(comp1, 'text',comp2,'text');
```

## Documentation
The documentation is available [here](https://deusconwet.github.io/interconnection)

## Performance

**Binding one producer to N consumer sending  ([interactive graph](https://docs.google.com/spreadsheets/d/e/2PACX-1vQIeEXMiUgyG8PX870wD2yv8yeQVqdP7wXIUFLcOyPwbQEafgALYMpvLqu-uv8ikvvukg-9W-SS6zMZ/pubchart?oid=262117739&format=interactive)
)**

![1 to N](https://i.imgur.com/GQiu6X4.png)

## Supported version

### Polymer versions
- [x] Polymer 1.2
- [x] Polymer 1.11
- [ ] Polymer 2 (not tested)
- [ ] Polymer 3 (not tested)

### Browsers

- [x] Chrome
- [x] Firefox
- [x] Opera
- [ ] Safari (not tested)
- [ ] IE (not tested)
- [ ] Edge (not tested)


## Author

Miguel Ortega Moreno [mortega5](https://github.com/mortega5)
