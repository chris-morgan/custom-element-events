custom-element-events
=====================

Normal HTML tags have a set of events they can receive; for each event `foo` they have an IDL property `onfoo` and an HTML attribute `onfoo` which provide an easy way to bind an event listener—often an easier way than `addEventListener` and `removeEventListener`.

For example, you can write a backwards-compatible image source fallback by listening for the `error` event which is dispatched on an `HTMLImageElement` if it fails to load the source, thus: `<img src=x.svg onerror="this.onerror=null;this.src='x.png'">`. Or declare what happens when you click on a button, with `<button onclick=jump()>Jump</button>`.

This little library (minified and gzipped, it’s 506 bytes!) allows you to, defining your own error types for your own custom elements, get the same convenience attributes.

See [example.html](https://rawgit.com/chris-morgan/custom-element-events/master/example.html) for a simple example of using this library/function.

Web Components version support
------------------------------

This library should work with Custom Elements V0 (Chrome, webcomponents.js) and V1 (no real implementations that I know of at the time of writing).

Usage
-----

1. Define your event type however you want. Maybe like this:

    ```javascript
    class FooEvent extends Event {
        constructor(…) {
            super('foo');
            …
        }
    }
    ```

2. Define your custom element type. Perhaps like this:

    ```javascript
    class MyFancyElement extends HTMLElement {
        …
    }
    
    MyFancyElement = document.registerElement('my-fancy', MyFancyElement);
    ```

3. Call the function defined by this library:

    ```javascript
    defineEventAttributes(MyFancyElement, ['foo'])
    ```

4. Enjoy the way in which your `<my-fancy>` element handles the `onfoo` HTML attribute and JavaScript property, so that when you `this.dispatchEvent(new FooEvent(…))` it’ll be dispatched to that, just like you expect.

Browser compatibility
---------------------

Unknown. In my own uses of this I only care about the latest browsers (actually, I only care about Edge, because no one else has implemented pressure sensitivity for the Pointer Events API yet).

`custom-element-events.js` uses things like `let`, `const`, `for..of` and arrow functions, because they’re nice and I like them. (Well, I like them more than normal JavaScript stuff, anyway. I still don’t like JavaScript as a language. Give me Rust any day.)

`custom-element-events.min.js` avoids fancy syntax, for greater browser compatibility; it should be *syntax*-compatible with older browsers, but it still depends on `Symbol`, `Array.prototype.map`, `Object.defineProperty` and such things, so IE isn’t supported out of the box. I suspect that with [polyfill.io] it would work on older browsers without issue.

If it doesn’t and you want it to, I’ll accept PRs. Make sure to make changes in both versions of the JavaScript code.

Contributing
------------

I will only accept PRs where you confirm that you waive copyright *et al* (CC0).

Update both `custom-element-events.js` and `custom-element-events.min.js` as necessary.
The latter is hand-written; I enjoy doing better than automated minifying tools can do.
If the gzipped, minified size changes (`gzip -fk9 custom-element-events.min.js`), update the mention of the filesize in this README.

License
-------

[![CC0](http://i.creativecommons.org/p/zero/1.0/80x15.png)][CC0]
To the extent possible under law, Chris Morgan has waived all copyright and related or neighboring rights to custom-element-events.

[polyfill.io]: https://polyfill.io/v2/docs/
[CC0]: http://creativecommons.org/publicdomain/zero/1.0/
