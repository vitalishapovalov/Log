# Automated, styled, declarative javascript logging

[![npm version](https://badge.fury.io/js/%40js-utilities%2Flog.svg)](https://badge.fury.io/js/%40js-utilities%2Flog)
[![Build Status](https://travis-ci.org/vitalishapovalov/js-utilities.svg?branch=master)](https://travis-ci.org/vitalishapovalov/js-utilities)

An utility to automatically log object properties access/set/delete etc., descriptor modification, function calls and a lot [more](#options) in a human-readable way.

In Browser

![browser output](https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/1.png)

In Node.js

![node.js output](https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/2.png)

Can be used to inject [logger](#instance-logger), has `Light` and `Dark` predefined themes

![instance logger](https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/3-4.png)

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
  * [Decorator](#decorator)
    * [Class](#class)
    * [Method/Get/Set](#method/get/set)
    * [Property](#property)
    * [Parameter](#parameter)
  * [Function](#function)
    * [Objects](#objects)
    * [Functions]($Functions)
  * [Instance logger](#instance-logger)
  * [Frameworks](#frameworks)
  * [Options](#options)
* [Requirements](#requirements)

## Installation

```bash
npm i -S @js-utilities/log
```

## Usage

### Decorator

Before using `@Log` as decorator, make sure that `decorators` are supported in your build:

* JavaScript

Decorators are not part of ECMAScript 2016 (aka 7). Decorators are currently in [Stage 2 Draft](https://tc39.es/proposal-decorators/) out of the total 4 stages a feature goes through before being finalized and becoming part of the language.
So, to use it, you should transform your code with transpilers (e.g. [Babel](https://babeljs.io/) and [proposal-decorators](https://babeljs.io/docs/en/babel-plugin-proposal-decorators) plugin)

* TypeScript

Decorators are available as an experimental feature of TypeScript. Official instruction [here](https://www.typescriptlang.org/docs/handbook/decorators.html).

`@Log` decorator can be used in different ways:

```typescript
import { Log } from "@js-utilities/log";

// default, no options provided
@Log
class MyClass {}

// with options
@Log({ logExecutionTime: true })
class MyClass {}

// shorthand for @Log({ name: "MyLogger" })
@Log("MyLogger")
class MyClass {}
```

#### Class

When used as a class decorator, will log:

* all methods, getters and setters calls

* properties accessing / setting

Here you can define which properties to log, setup log of prototype getting/setting, constructing, defining and deleting properties and a lot [more](#options).

Example with property set:

```javascript
import { Log } from "@js-utilities/log";

@Log
class MyClass {}

new MyClass().myProp = "value";
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/5.png" alt="console output" width="350" />

#### Method/Getter/Setter

When used as a method/getter/setter or a `static` method/getter/setter decorator, will log all of the calls.

```javascript
import { Log } from "@js-utilities/log";

class MyClass {
  @Log
  myMethod() {
    return ["string1", "string2"];
  }
}

new MyClass().myMethod();
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/6.png" alt="console output" width="350" />

Also, can be used to override already declared options of owner class.

For example:

Disable method logging:

```typescript
@Log
class MyClass {
    
  @Log({ log: false })
  get prop() {
    return ["string1", "string2"];
  }
}
```

Overriding `name` option for specific method:

```typescript
@Log
class MyClass {
    
  @Log("Special name")
  myMethod() {
    return ["string1", "string2"];
  }
}
```

Also, if class owner has `@Log` declaration, method logger will use class's options and merge them with method's `@Log` declaration options. Not for static method/getter/setter.

```typescript
@Log({ logTimeStamp: true })
class MyClass {
    
  @Log({ logExecutionTime: true })
  myMethod() {
    return ["string1", "string2"];
  }
}
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/7.png" alt="console output" width="350" />

#### Property

Can be used on a property, but due to some limitations, only along with class decorator.

Same as in [method/get/set](#method/get/set), property decorator can used to override log options for the specific property.

```typescript
import { Log } from "@js-utilities/log";

@Log({ logTimeStamp: true })
class MyClass {
    
  @Log({
    name: "'prop' with initial value 2000",
    logTimeStamp: false,
  })
  prop = 1000;
}

new MyClass().prop = 2000;
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/8.png" alt="console output" width="350" />

#### Parameter

For the moment, the only reason to use `@Log` as parameter decorator is to extend specific param log output.

Normally, to avoid logs polluting, Arrays and Objects will be printed as `Array` and `Object` correspondingly.

To log array/object entries, decorate it with `@Log` and provide max amount of entries to print `@Log(2)`.

```typescript
import { Log } from "@js-utilities/log";

class MyClass {
    
  @Log
  myMethod(@Log(2) arr1, arr2) {
      return null;
  }
}

new MyClass().myMethod(["val1", 100, 200], ["val2"]);
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/9.png" alt="console output" width="350" />

### Function

If you need to log an already instantiated class or a plain object or a function - you need `log` function.

`log` function accepts 2 arguments: entity to log and options (optional)

```typescript
import { log } from "@js-utilities/log";

// default, no options provided
const logObject = log({ param: "value" });

// with options
const logObject = log({ param: "value" }, { logTimeStamp: true });

// shorthand for log(entity, { name: "MyLogger" })
const logObject = log({ param: "value" }, "MyLogger");
```

#### Objects

Works the same way as for [class](#class), except for some options. Some of them are pointless (`logConstructor`, `logSubclass`):

```typescript
import { log } from "@js-utilities/log";

const object = {
    myMethod() {
        return "value";
    }
};

const logObject = log(object, {
    name: "MyObject",
    logExecutionTime: true
});

logObject.myMethod();
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/10.png" alt="console output" width="350" />

#### Functions

`log` with functions used the same as for [objects](#objects):

```typescript
import { log } from "@js-utilities/log";

const logObject = log(function (arg) { return null; }, "MyFunction");

logObject({ param: "value" });
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/11.png" alt="console output" width="350" />

### Instance logger

#### Providing & Interface

If there is a need to use log-like styling imperatively, you can access special `logger` object:

1) via [class](#class) `@Log` decorator

2) via `log` function

You can enable it with `provideLogger` option set to true. You can configure provided logger via `loggerOptions` option.

`logger` interface:

```typescript
interface InstanceMessageLogger {
    log(msg: string, ...args: any[]): void;
    info(msg: string, ...args: any[]): void;
    warn(msg: string, ...args: any[]): void;
    error(msg: string, ...args: any[]): void;
}
```

`loggerOptions` option:

```typescript
type InstanceMessageLoggerOptions = {
    logName?: boolean;
    logTimeStamp?: boolean;
    logMs?: boolean;
    logSuffix?: boolean | string;
}
```

#### Styling

For styling in browser [template-colors-web](https://github.com/icodeforlove/template-colors-web) is used, and [chalk](https://github.com/chalk/chalk) is used for node.js.

Logger will style your message based on provided options theme.

Also, it will parse and paint some values in corresponding theme color:

* `$string()`

* `$number()`

#### Logger usage

Example:

```typescript
import { Log } from "@js-utilities/log";

@Log({ provideLogger: true })
class MyClass {
    myMethod() {
        this.logger.warn("styling $string(string), $number(1000)");
    }
}

new MyClass().myMethod();
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/12.png" alt="console output" width="350" />

#### Usage in TypeScript

In TypeScript, you should declare `logger` before using:

```typescript
import { Log, InstanceMessageLogger } from "@js-utilities/log";

@Log({ provideLogger: true })
class MyClass {
    readonly logger!: InstanceMessageLogger;
}
```

### Frameworks

Usually, framework entities (e.g. React/Angular components) do a lot of work under the hood of an object that we don't need to know about.

Logging them will pollute console with unwanted information. But we don't know how to distinct tech. properties/hooks.

So we need to explicitly define which properties should be logged and which should be logged specially.

For the moment, only [React](https://github.com/facebook/react/) is supported.

#### React

React configuration description:

```typescript
type FrameworkConfig = {
    
    /**
     * Technical properties to log (e.g. "updater", "_reactInternalFiber").
     * 
     * @default undefined
     */
    logTechnical?: boolean | string[];
    
    /**
     * State to log (e.g. "state").
     * 
     * @default undefined
     */
    logState?: boolean | string[];
    
    /**
     * Props to log (e.g. "props").
     * 
     * @default undefined
     */
    logProps?: boolean | string[];
    
    /**
     * Hooks to log (e.g. "render", "shouldComponentUpdate").
     * 
     * @default undefined
     */
    logHooks?: boolean | string[];
    
    /**
     * Refs to log (e.g. "refs").
     * 
     * @default undefined
     */
    logRefs?: boolean | string[];
    
    /**
     * Context to log (e.g. "context").
     * 
     * @default undefined
     */
    logContext?: boolean | string[];
    
    /**
     * Other react properties to log (e.g. "setState", "forceUpdate").
     * 
     * @default undefined
     */
    logOther?: boolean | string[];
    
    /**
     * Default log depth for react properties.
     * 
     * @default 1
     */
    argsLogDepth?: number;
}
```

Example:

```typescript
import * as React from "react";
import { Log } from "@js-utilities/log";

@Log({
    react: { logHooks: true }
})
class MyComponent extends React.Component {
    render() {
        return null;
    }
}
```

Console output:

<img src="https://raw.githubusercontent.com/vitalishapovalov/js-utilities/master/packages/log/docs/13.png" alt="console output" width="350" />

#### Other

To avoid console polluting with other frameworks / libraries, disable all props logging and enable only wanted ones explicitly:

```typescript
import { Log } from "@js-utilities/log";

@Log({ logProperties: ["myProp"] })
class MyClass extends FrameworkEntity {
    myProp = "value";
}
```

### Options

Log library is highly-configurable and there are a lot of options available:

```typescript
type LoggerOptions = {
    
    /**
     * Name of the logger.
     * All messages will be prepended with this field's value.
     *
     * @default function or class name
     */
    name?: string | number;

    /**
     * Flag for enabling/disabling Logger name logging.
     *
     * @default true
     */
    logName?: boolean;

    /**
     * If provided, will be executed on each log.
     * If condition isn't met, log won't be executed.
     *
     * @default undefined
     */
    condition?: (propKey: PropertyKey) => boolean;

    /**
     * Console method which will be used to output messages.
     *
     * @default "log"
     */
    consoleMethod?: "log" | "group" | "groupCollapsed" | "groupEnd" | "warn" | "info";

    /**
     * Logger theme. If object will be provided, "dark" will be used as main theme
     * and overridden with provided object properties.
     *
     * @default "dark"
     */
    theme?: "dark" | "light" | LoggerTheme;

    /**
     * InstanceMessageLogger description can be found in Instance logger section of readme.
     *
     * @default false
     */
    provideLogger?: boolean;

    /**
     * InstanceMessageLogger description can be found in Instance logger section of readme.
     *
     * @default { logTimeStamp: true, logSuffix: true }
     */
    loggerOptions?: InstanceMessageLoggerOptions;

    /**
     * Flag for enabling/disabling logging.
     *
     * @default true
     */
    log?: boolean;

    /**
     * The same as "logProperties", but for all types of the property manipulation.
     * (e.g. "prop" in class, delete class["prop"], getOwnPropertyDescriptor)
     *
     * @default false
     */
    logPropertiesFull?: boolean | PropertyKey[];

    /**
     * Some object just can't fit into well-looking console output,
     * so you can force logger to log full objects separately
     * right after the log message.
     *
     * @default false
     */
    logExtensibleObjects?: boolean;

    /**
     * Option to control "toString()", "valueOf()" and other well-known calls.
     *
     * @default false
     */
    logWellKnownSymbols?: boolean | Symbol[];

    /**
     * Option to control "hasOwnProperty" and other Object.prototype calls.
     *
     * @default false
     */
    logProtoMethods?: boolean | string[];

    /**
     * Will append execution time (of method call etc.) raw to every log message.
     * In browser: Performance API, in Node.js - "perf_hooks" core module.
     *
     * @default false
     */
    logExecutionTime?: boolean;

    /**
     * Log subclasses of the class containing @Log declaration.
     *
     * @default false
     */
    logSubclass?: boolean;

    /**
     * Add timestamp for each log message.
     *
     * @default true
     */
    logTimeStamp?: boolean;

    /**
     * Alternative for @Log parameter decorator.
     * Array of depth log for each argument.
     *
     * If you want to set log depth 5 only for the second parameter:
     * argsLogDepth: [null, 5]
     *
     * @default []
     */
    argsLogDepth?: (number | null | undefined)[];

    /**
     * Log class constructing.
     *
     * @default false
     */
    logConstructor?: boolean;

    /**
     * Log getPrototypeOf calls to the class.
     *
     * @default false
     */
    logGetPrototypeOf?: boolean;

    /**
     * Log setPrototypeOf calls to the class.
     *
     * @default false
     */
    logSetPrototypeOf?: boolean;

    /**
     * Log isExtensible calls to the class.
     *
     * @default false
     */
    logIsExtensible?: boolean;

    /**
     * Log preventExtensions calls to the class.
     *
     * @default false
     */
    logPreventExtensions?: boolean;

    /**
     * A list of properties (or boolean to affect all of them),
     * whose accessing/setting/calling will be logged.
     *
     * @default true
     */
    logProperties?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose getOwnPropertyDescriptor calls will be logged.
     *
     * @default false
     */
    logGetOwnPropertyDescriptor?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose "prop in Obj" checks will be logged.
     *
     * @default false
     */
    logInOperator?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose "delete prop" executions will be logged.
     *
     * @default false
     */
    logDeleteProperty?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose defineProperty calls will be logged.
     *
     * @default false
     */
    logDefineProperty?: boolean | PropertyKey[];

    /**
     * A list of properties (or boolean to affect all of them),
     * whose defineProperty calls will be logged.
     *
     * @default false
     */
    logOwnKeys?: boolean;

    /**
     * Log entity invocation (usually a function, but also
     * might be a class extending Function).
     *
     * @default true
     */
    logInvocation?: boolean;
}
```

## Requirements

* `Proxy` support
* `Reflect` support

## License

[MIT License](https://github.com/vitalishapovalov/js-utilities/blob/master/LICENSE)
