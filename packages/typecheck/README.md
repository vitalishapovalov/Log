# Type checking library

[![npm version](https://badge.fury.io/js/%40js-utilities%2Ftypecheck.svg)](https://badge.fury.io/js/%40js-utilities%2Ftypecheck)

A set of super-simple type checkers. Each checker returns `boolean` value. Most checkers are typescript [type predicates](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates).

## Installation

```bash
npm i -S @js-utilities/typecheck
```

## Usage example

```js
import { isBoolean } from "@js-utilities/typecheck";

const defaultValue = isBoolean(option.isEnabled) ? option.isEnabled : true;
```

```typescript
import { isCallable } from "@js-utilities/typecheck";

const a: unknown = global.value;

if (isCallable(a)) a();
```

## Available checkers:

| Checker              | Return type                    |
| -------------------- | -------------------------------|
| `isCallable`         | `boolean`                      |         
| `isFunction`         | `value is Function`            |         
| `isArrowFunction`    | `boolean`                      |         
| `isArray<T>`         | `value is T[]`                 |         
| `isObject<T>`        | `value is T`                   |         
| `isBoolean`          | `value is boolean`             |         
| `isUndefined`        | `value is undefined`           |            
| `isNumber`           | `value is number`              |         
| `isString`           | `value is string`              |         
| `isSymbol`           | `value is symbol`              |         
| `isNull`             | `value is null`                |   
| `isMap<T, U>`        | `value is Map<T, U>`           | 
| `isSet<T>`           | `value is Set<T>`              |     
| `isWeakSet<T>`       | `value is WeakSet<T>`          |         
| `isWeakMap<T, U>`    | `value is WeakMap<T, U>`       |     
    
## License

[MIT License](https://github.com/vitalishapovalov/js-utilities/blob/master/LICENSE)
