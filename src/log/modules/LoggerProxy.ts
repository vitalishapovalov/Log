import { ProxyTrap } from "../types";
import { MessageConstructor } from "./MessageConstructor";
import { LogHandler } from "./LogHandler";

export class LoggerProxy<T extends object> implements ProxyHandler<T> {

    public static create<T extends object>(target: T): T {
        return new Proxy<T>(target, new this() as ProxyHandler<T>);
    }

    private static handleTrap(trap: ProxyTrap, args: any[]): any {
        return (Reflect as any)[trap](...args);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.CONSTRUCT])
    public construct(target: T, args: any[], newTarget?: any): T {
        return LoggerProxy.handleTrap(ProxyTrap.CONSTRUCT, [target, args, newTarget]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.GET_PROTOTYPE_OF])
    public getPrototypeOf(target: T): object | null {
        return LoggerProxy.handleTrap(ProxyTrap.GET_PROTOTYPE_OF, [target]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.SET_PROTOTYPE_OF])
    public setPrototypeOf(target: T, prototype: any): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.SET_PROTOTYPE_OF, [target, prototype]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.IS_EXTENSIBLE])
    public isExtensible(target: T): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.IS_EXTENSIBLE, [target]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.PREVENT_EXTENSIONS])
    public preventExtensions(target: T): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.PREVENT_EXTENSIONS, [target]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR])
    public getOwnPropertyDescriptor(target: T, property: PropertyKey): PropertyDescriptor | undefined {
        return LoggerProxy.handleTrap(ProxyTrap.GET_OWN_PROPERTY_DESCRIPTOR, [target, property]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.HAS])
    public has(target: T, property: PropertyKey): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.HAS, [target, property]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.GET])
    public get(target: T, property: PropertyKey): any {
        return LoggerProxy.handleTrap(ProxyTrap.GET, [target, property]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.SET])
    public set(target: T, property: PropertyKey, value: any): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.SET, [target, property, value]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.DELETE_PROPERTY])
    public deleteProperty(target: T, property: PropertyKey): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.DELETE_PROPERTY, [target, property]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.DEFINE_PROPERTY])
    public defineProperty(target: T, property: PropertyKey, attributes: PropertyDescriptor): boolean {
        return LoggerProxy.handleTrap(ProxyTrap.DEFINE_PROPERTY, [target, property, attributes]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.OWN_KEYS])
    public ownKeys(target: T): ArrayLike<string | symbol> {
        return LoggerProxy.handleTrap(ProxyTrap.OWN_KEYS, [target]);
    }

    @LogHandler.handleTrap(MessageConstructor[ProxyTrap.APPLY])
    public apply(target: T, thisArg: any, args?: any[]): any {
        return LoggerProxy.handleTrap(ProxyTrap.APPLY, [target, thisArg, args]);
    }
}
