node-typedarray
===

Simple examples/methods showing how to mix node.js's Buffers and W3C Typed Arrays

## Rationale :

Node.js has defined its own proprietary Buffers and does not use standard w3c ArrayBuffer and Typed Array ( http://www.khronos.org/registry/typedarray/specs/latest/ ).

In some cases you might want to use the standards instead or at least be able to switch from one to another, or use both at the same time.

For different reasons : for example if you want to run your code in different environments (on server side and client side (browser), see https://github.com/Ayms/node-Tor )

## Install :

	npm install node-typedarray

or

    git clone http://github.com/Ayms/node-typedarray.git
    cd node-typedarray
    npm link

## Details :

These are simple methods and examples showing how to mix both types of buffers. Probably it can be optimized, the intent here is just to give some ideas.

See the comments in the code, it is interesting to note that under certain conditions you can use both types of buffers together without needing any conversion at any time (in node.js environment for example)

TextEncoder and TextDecoder functions (based on http://encoding.spec.whatwg.org/#api ) can be retrieved here : http://code.google.com/p/stringencoding/ (Joshua Bell) and integrated into the code or as a node.js module, it does include a very usefull option {stream:true} (which is absent from node.js's toString method, as well as modified toString method here, if you want to use it you must customize it yourself)

## Tests :

Successfully tested with https://github.com/Ayms/node-Tor, mixing Buffers and Typed Arrays.

See simple tests in the code.
	
## Related projects :

[Ayms/node-Tor](https://github.com/Ayms/node-Tor)
[Ayms/node-dom](https://github.com/Ayms/node-dom)
[Ayms/node-bot](https://github.com/Ayms/node-bot)
[Ayms/node-gadgets](https://github.com/Ayms/node-gadgets)
