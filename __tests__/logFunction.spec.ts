import { getTFunction, getTObject } from "./__mocks__/logFunction";

describe("log/log test", () => {

    let dummy;
    let logSpy;

    beforeEach(() => {
        logSpy = jest.spyOn(console, "log");
    });

    afterEach(() => {
        logSpy.mockClear();
    });

    describe("when used on an object", () => {

        it("should correctly log actions", () => {
            const instance = getTObject();

            dummy = instance.prop;
            instance.prop = "";
            dummy = instance.getSet;
            instance.getSet = "";
            dummy = instance.method();

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[1])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[2])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[3])).toMatchSnapshot();
            expect(JSON.stringify(logSpy.mock.calls[4])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(5);
        });
    });

    describe("when used on a function", () => {

        it("should correctly log apply", () => {
            const fn = getTFunction();

            fn(100, ["alex"]);

            expect(JSON.stringify(logSpy.mock.calls[0])).toMatchSnapshot();
            expect(logSpy).toHaveBeenCalledTimes(1);
        });
    });
});
