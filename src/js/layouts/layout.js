"use strict";

const Marionette = require("backbone.marionette"),
    RootLayoutView = require("layouts/root.layout.view.js"),
    MainLayoutController = require("layouts/main/layout.controller.js"),
    ModalView = require("common/modal/views/modal.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "layout:show": "showLayout",
        "modal:show": "showModal",
        "modal:close": "closeModal"
    },

    initialize: function () {
        this.layoutController = null;
        this.rootLayoutView = new RootLayoutView();
        this.modalRegion = this.rootLayoutView.getRegion("modalRegion");
    },

    getLayoutController: function (callback) {
        return new MainLayoutController({
            region: this.rootLayoutView.getRegion("rootRegion"),
            callback: callback
        });
    },

    getModalView: function (options) {
        return new ModalView(options);
    },

    showLayout: function (callback) {
        if (!this.layoutController) {
            this.layoutController = this.getLayoutController(callback);
        }
    },

    showModal: function (options) {
        this.modalRegion.show(this.getModalView(options));
        // body
        this.rootLayoutView.$el.addClass("modal-open");
        // #modal-region
        this.modalRegion.$el.show();
        this.modalRegion.$el.after("<div class=\"modal-backdrop in\"></div>");
    },

    closeModal: function () {
        this.modalRegion.empty();
        // body
        this.rootLayoutView.$el.removeClass("modal-open");
        // #modal-region
        this.modalRegion.$el.hide();
        this.modalRegion.$el.next(".modal-backdrop").remove();
    }
});
