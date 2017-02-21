describe("common/alert/views/alert.view.js", () => {
    "use strict";

    const Alert = require("common/alert/views/alert.view.js"),
        _ = require("underscore"),
        Marionette = require("backbone.marionette");


    it("should be defined", () => {
        expect(Alert).toBeDefined();
    });

    describe("initialize", () => {
        it("should throw Error: 'Alert type is unknown!' if 'type' is not defined", () => {
            expect(() => {
                const AlertView = new Alert();
            }).toThrowError("Alert type is unknown!");
        });

        it("should throw Error: 'Alert type is unknown!' if 'type' is different than 'success', 'info', 'warning', 'danger'", () => {
            expect(() => {
                const AlertView = new Alert({
                    type: "other"
                });
            }).toThrowError("Alert type is unknown!");
        });

        it("should throw Error: 'Alert 'body' view must be defined!' if 'body' is not defined", () => {
            expect(() => {
                const AlertView = new Alert({
                    type: "info"
                });
            }).toThrowError("Alert 'body' view must be defined!");
        });
    });

    describe("onRender", () => {
        it("should onRender 'bodyView' in 'alertBody' region", () => {
            const AlertView = new Alert({
                template: _.template("<div>Alert view temnplate</div>"),
                type: "info",
                body: "bodyView"
            });

            AlertView.showChildView = jest.fn();

            AlertView.render();

            expect(AlertView.showChildView).toHaveBeenCalledWith("alertBody", "bodyView");
        });
    });

    describe("onBeforeDestroy", () => {
        it("should destroy 'type' and 'bodyView'", () => {
            const AlertView = new Alert({
                template: _.template("<div>Alert view temnplate</div>"),
                type: "info",
                body: new Marionette.View()
            }),
            bodyView = AlertView.bodyView;

            bodyView.destroy = jest.fn();

            AlertView.onBeforeDestroy();

            expect(bodyView.destroy).toHaveBeenCalled();
            expect(AlertView.bodyView).toBeUndefined();
            expect(AlertView.type).toBeUndefined();
        });
    });
});
