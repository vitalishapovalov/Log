export const toString = (val: any): string => (
    Object.prototype.toString.call(val)
);

export const getUnderlyingPrototype = (obj: object) => (
    Reflect.getPrototypeOf(Reflect.getPrototypeOf(obj))
);

export const isOwnMethod = (target: object, prop: PropertyKey): boolean => {
    const underlyingPrototype = getUnderlyingPrototype(target);
    return underlyingPrototype
        ? Object.prototype.hasOwnProperty.call(underlyingPrototype, prop)
        : true;
};

const LOGGER_PROXY_CLASS_NAME = "__$$LoggerProxy";
export const getOwnClassName = (target: object): { name?: string } => {
  if (!target?.constructor?.name) {
      return {};
  }
  let ownClassName = target.constructor.name;
  let currentTarget = target;
  while (ownClassName && ownClassName.includes(LOGGER_PROXY_CLASS_NAME)) {
      currentTarget = (currentTarget as any).__proto__ as object;
      ownClassName = currentTarget.constructor.name;
  }
  return { name: ownClassName };
}
