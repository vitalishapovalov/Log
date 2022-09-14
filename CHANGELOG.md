# 1.0.0

* split a single entrypoint of the package into two separate entrypoints (browser and node)
* remove semicolon decoration for a few cases - it could unpredictably break colors

# 0.1.9

* fix retrieval of the logger name
* fix `ownKeys` logging (exclude logger's tech symbols)
* update & stabilize tests

# 0.1.8

Dependencies bump. No code changes. Re-build the lib using latest ts/rollup/optimizers.

# 0.1.7

Dependencies bump. No code changes. Re-build the lib using latest ts/rollup/optimizers.

# 0.1.6

Drop Node 8.x support. Updated most of the dependencies.

# 0.1.5

Technical release, cleanup npm package.

# 0.1.4

* highlight `bound` keyword for bound functions
* add `logInterceptor` callback, which will be invoked before every log. Also, returned value from this callback will decide whether to log message to console or not. `logInterceptor` accepts an object with a lot of data of proxied call:

```typescript
type LogData = {
    proxyTrap: ProxyTrap;
    propertyKey?: PropertyKey;
    trapResult?: any;
    target?: any;
    options?: LoggerOptions;
    message?: string;
    decoratedMessage?: string;
    valueToSet?: any;
    descriptor?: PropertyDescriptor;
    thisArg?: any;
    args?: any[];
    design?: Design;
};
```

# 0.1.3

* added `Nest.js` support
* added `Vue.js` support
* added `Angular` support
* remove `logSubclass` option, log derived classes by default
* log resolved promise value for method decorators