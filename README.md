![Interconnection](https://i.imgur.com/yx31ubv.png)

# Polymer Interconnection

## What is Interconnection?
Polymer Interconnection is a JavaScript library that makes it posible to bind components properties dynamically. It uses polymer in order to bind components so it's require.
The library creates a window property `Interconnection` with high level functions to manipulate the binding between two components (consumer and producer. 

Interconnection is done using [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) and [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver). 

WeakMap is used to keep track the binding information of the custom elements. Each key is a HTMLElement and their value is a Custom map of the componente [ElementsMap](https://deusconwet.github.io/interconnection/ElementMap.html).

Suppose we have the following component

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

Using the polymer syntax if we want to connect the property `text` of two `my-component` we have to using `{{}}` or `[[]]`.

```html
<my-component id="comp1" text="{{my_text}}"></my-component>
<my-component id="comp2" text="{{my_text}}"></my-component>
```

In this way, we can bind both properties but it is currently so hard to do it dynamycally using javascript. 

```javascript
let comp1 = document.querySelector('#comp1');
let comp2 = document.querySelector('#comp2');

// Bind comp1.text to comp2.text
Interconnection.bind(comp1, 'text',comp2,'text');
```

## Examples


## Documentation
The documentation is available [here](https://deusconwet.github.io/interconnection)
## Performance

## Author

Miguel Ortega Moreno [mortega5](https://github.com/mortega5)

