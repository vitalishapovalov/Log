import { MessageHandler, ProxyTrap } from "../../types";
import construct from "./traps/construct";
import getPrototypeOf from "./traps/getPrototypeOf";
import setPrototypeOf from "./traps/setPrototypeOf";
import isExtensible from "./traps/isExtensible";
import preventExtensions from "./traps/preventExtensions";
import getOwnPropertyDescriptor from "./traps/getOwnPropertyDescriptor";
import has from "./traps/has";
import get from "./traps/get";
import set from "./traps/set";
import deleteProperty from "./traps/deleteProperty";
import defineProperty from "./traps/defineProperty";
import ownKeys from "./traps/ownKeys";
import apply from "./traps/apply";

// tslint:disable-next-line:variable-name
export const MessageConstructor: Readonly<{ [PT in ProxyTrap]: MessageHandler; }> = Object.freeze({
    [ProxyTrap.CONSTRUCT]: construct,
    [ProxyTrap.GET_PROTOTYPE_OF]: getPrototypeOf,
    [ProxyTrap.SET_PROTOTYPE_OF]: setPrototypeOf,
    [ProxyTrap.IS_EXTENSIBLE]: isExtensible,
    [ProxyTrap.PREVENT_EXTENSIONS]: preventExtensions,
    [ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR]: getOwnPropertyDescriptor,
    [ProxyTrap.HAS]: has,
    [ProxyTrap.GET]: get,
    [ProxyTrap.SET]: set,
    [ProxyTrap.DELETE_PROPERTY]: deleteProperty,
    [ProxyTrap.DEFINE_PROPERTY]: defineProperty,
    [ProxyTrap.OWN_KEYS]: ownKeys,
    [ProxyTrap.APPLY]: apply,
});
