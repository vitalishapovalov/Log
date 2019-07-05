import {
    T,
    TConstructor,
    TGetPrototypeOf,
    TIsExtensible,
    TOwnKeys,
    TPreventExtensions,
    TSetPrototypeOf,
    TLogFullProperty,
    TFunction,
    TProvideLogger
} from "./__mocks__/LogDecorator";

// TODO when used as a parameter decorator
// TODO when used as a method decorator
// TODO when used as a getset decorator
// TODO when used on a class + property/method/getset
// TODO static properties/methods/getset
// TODO cover different options cases

describe("log/Log test", () => {

    describe("when used as a class decorator", () => {

        let dummy;
        let logSpy;

        beforeEach(() => {
           logSpy = jest.spyOn(console, "log");
        });

        afterEach(() => {
            logSpy.mockClear();
        });

        it("shouldn't log anything", () => {
            const inst = new T();

            dummy = Object.getPrototypeOf(inst);
            Object.isExtensible(inst);
            Object.setPrototypeOf(inst, Object.create({}));
            Object.preventExtensions(inst);

            expect(logSpy).not.toHaveBeenCalled();
        });

        it("should correctly log only get/set events on property", () => {
            const inst = new T();

            dummy = inst.prop;
            inst.prop = "";

            // shouldn't be logged
            dummy = "prop" in inst;
            delete inst.prop;
            Object.defineProperty(inst, "prop", { value: "prop_value" });
            dummy = Object.getOwnPropertyDescriptor(inst, "prop");

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[1])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(2);
        });

        it("should correctly log only get/set events on getters and setters", () => {
            const inst = new T();

            dummy = inst.getSetProp;
            inst.getSetProp = "";

            // shouldn't be logged
            dummy = "getSetProp" in inst;
            delete inst.getSetProp;
            Object.defineProperty(inst, "getSetProp", { value: "getSetProp_value" });
            dummy = Object.getOwnPropertyDescriptor(inst, "getSetProp");

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[1])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(2);
        });

        it("should correctly log only call events on methods", () => {
            const inst = new T();

            dummy = inst.method();

            // shouldn't be logged
            dummy = "method" in inst;
            delete inst.method;
            Object.defineProperty(inst, "method", { value: () => {} });
            dummy = Object.getOwnPropertyDescriptor(inst, "method");

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log constructor", () => {
            new TConstructor({ a: 10 }, 100, "100", ["str"]);

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log getPrototypeOf", () => {
            Object.getPrototypeOf(new TGetPrototypeOf());

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log setPrototypeOf", () => {
            Object.setPrototypeOf(new TSetPrototypeOf(), {
                dummyMethod() {}
            });

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log isExtensible", () => {
            Object.isExtensible(new TIsExtensible());

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log preventExtensions", () => {
            Object.preventExtensions(new TPreventExtensions());

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log ownKeys", () => {
            const instance = new TOwnKeys();

            Object.getOwnPropertyNames(instance);
            Object.getOwnPropertySymbols(instance);
            Reflect.ownKeys(instance);
            Object.keys(instance);
            for (const k in instance) {}

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[1])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[2])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[3])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[4])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(5);
        });

        it("should correctly log delete", () => {
            delete new TLogFullProperty().prop;

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log defineProperty", () => {
            Object.defineProperty(new TLogFullProperty(), "prop", { value: "new val" });

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log has", () => {
            dummy = "prop" in new TLogFullProperty();

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log getOwnPropertyDescriptor", () => {
            Object.getOwnPropertyDescriptor(new TLogFullProperty(), "prop");

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        it("should correctly log apply", () => {
            const instance = new TFunction("a", "b", "return a + b;");
            instance.call({}, 20, 30);

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });

        describe("instance message logger", () => {

            it("should provide instance logger", () => {
               expect((new TProvideLogger() as any).logger).toBeTruthy();
            });

            it("should correctly log messages", () => {
                const logger = (new TProvideLogger() as any).logger;

                logger.log("");
                logger.info("Message []");
                logger.warn("Number: $number(1000)");
                logger.error("String: $string(alex)");

                expect(logSpy).toHaveBeenCalledTimes(4);
            });
        });
    });
});
