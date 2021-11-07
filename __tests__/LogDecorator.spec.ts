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
    TProvideLogger, TMethod
} from "./__mocks__/LogDecorator";

// TODO when used as a parameter decorator
// TODO when used as a method decorator
// TODO when used as a getset decorator
// TODO when used on a class + property/method/getset
// TODO static properties/methods/getset
// TODO cover different options cases

@Describe("log/Log test, when used as a class decorator")
class LogDecoratorSpec1 {

    dummy;

    @Spy(console, "log")
    logSpy;

    @It("shouldn't log anything")
    test1() {
        const inst = new T();

        this.dummy = Object.getPrototypeOf(inst);
        Object.isExtensible(inst);
        Object.setPrototypeOf(inst, Object.create({}));
        Object.preventExtensions(inst);

        expect(this.logSpy).not.toHaveBeenCalled();
    }

    @It("should correctly log only get/set events on property")
    test2() {
        const inst = new T();

        this.dummy = inst.prop;
        inst.prop = "";

        // shouldn't be logged
        this.dummy = "prop" in inst;
        delete inst.prop;
        Object.defineProperty(inst, "prop", { value: "prop_value" });
        this.dummy = Object.getOwnPropertyDescriptor(inst, "prop");

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[1])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(2);
    }

    @It("should correctly log only get/set events on getters and setters")
    testThree() {
        const inst = new T();

        this.dummy = inst.getSetProp;
        inst.getSetProp = "";

        // shouldn't be logged
        this.dummy = "getSetProp" in inst;
        delete inst.getSetProp;
        Object.defineProperty(inst, "getSetProp", { value: "getSetProp_value" });
        this.dummy = Object.getOwnPropertyDescriptor(inst, "getSetProp");

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[1])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(2);
    }

    @It("should correctly log only call events on methods")
    testFour() {
        const inst = new T();

        this.dummy = inst.method();

        // shouldn't be logged
        this.dummy = "method" in inst;
        delete inst.method;
        Object.defineProperty(inst, "method", { value: () => {} });
        this.dummy = Object.getOwnPropertyDescriptor(inst, "method");

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log constructor")
    testFive() {
        new TConstructor({ a: 10 }, 100, "100", ["str"]);

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log getPrototypeOf")
    testSix() {
        Object.getPrototypeOf(new TGetPrototypeOf());

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log setPrototypeOf")
    testSeven() {
        Object.setPrototypeOf(new TSetPrototypeOf(), {
            dummyMethod() {}
        });

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log isExtensible")
    testEight() {
        Object.isExtensible(new TIsExtensible());

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log preventExtensions")
    testNine() {
        Object.preventExtensions(new TPreventExtensions());

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log ownKeys")
    testTen() {
        const instance = new TOwnKeys();

        Object.getOwnPropertyNames(instance);
        Object.getOwnPropertySymbols(instance);
        Reflect.ownKeys(instance);
        Object.keys(instance);
        for (const k in instance) {}

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[1])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[2])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[3])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[4])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(5);
    }

    @It("should correctly log delete")
    testEleven() {
        delete new TLogFullProperty().prop;

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log defineProperty")
    testTwelve() {
        Object.defineProperty(new TLogFullProperty(), "prop", { value: "new val" });

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log has")
    testThirteen() {
        this.dummy = "prop" in new TLogFullProperty();

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log getOwnPropertyDescriptor")
    testFourteen() {
        Object.getOwnPropertyDescriptor(new TLogFullProperty(), "prop");

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should correctly log apply")
    testFifteen() {
        const instance = new TFunction("a", "b", "return a + b;");
        instance.call({}, 20, 30);

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }

    @It("should provide instance logger")
    testSixteen() {
        expect((new TProvideLogger() as any).logger).toBeTruthy();
    }

    @It("should correctly log messages")
    testSeventeen() {
        const logger = (new TProvideLogger() as any).logger;

        logger.log("");
        logger.info("Message []");
        logger.warn("Number: $number(1000)");
        logger.error("String: $string(alex)");

        expect(this.logSpy).toHaveBeenCalledTimes(4);
    }

    @It("should correctly log methods usage")
    testMethodLogging() {
        const instance = new TMethod();

        instance.myMethod("foo");
        instance.myNamedMethod("foo", "bar");

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[1])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(2);
    }
}
