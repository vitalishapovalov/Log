import { AfterEach, BeforeEach, Describe, Test } from "@jest-decorated/core";
import { getTFunction, getTObject } from "./__mocks__/logFunction";

@Describe("log/log test")
class LogFunctionSpec {

    dummy;
    logSpy;

    @BeforeEach()
    beforeEach() {
        this.logSpy = jest.spyOn(console, "log");
    }

    @AfterEach()
    afterEach() {
        this.logSpy.mockClear();
    }

    @Test("when used on an object, should correctly log actions")
    asObject() {
        const instance = getTObject();

        this.dummy = instance.prop;
        instance.prop = "";
        this.dummy = instance.getSet;
        instance.getSet = "";
        this.dummy = instance.method();

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[1])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[2])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[3])).toMatchSnapshot();
        expect(JSON.stringify(this.logSpy.mock.calls[4])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(5);
    }

    @Test("when used on a function, should correctly log apply")
    asFunction() {
        const fn = getTFunction();

        fn(100, ["alex"]);

        expect(JSON.stringify(this.logSpy.mock.calls[0])).toMatchSnapshot();
        expect(this.logSpy).toHaveBeenCalledTimes(1);
    }
}
