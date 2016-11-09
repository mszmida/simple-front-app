"use strict";

const Marionette = require("backbone.marionette"),
    ModalLayoutView = require("common/modal/views/modal.layout.view.js"),
    ModalView = require("common/modal/views/modal.view.js");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "modal:show": "showModal",
        "modal:close": "closeModal"
    },

    initialize: function () {
        this.modalLayoutView = new ModalLayoutView();
        this.modalRegion = this.modalLayoutView.getRegion("modalRegion");
    },

    getModalView: function (options) {
        return new ModalView(options);
    },

    showModal: function (options) {
        this.modalRegion.$el.show();
        this.modalRegion.show(this.getModalView(options));
        // body
        this.modalLayoutView.$el.addClass("modal-open");

        this.modalRegion.$el.after("<div class=\"modal-backdrop in\"></div>");
    },

    closeModal: function (done) {
        if (done && typeof done !== "function") {
            throw new Error("Argument is not a funcion!");
        };

        this.modalRegion.$el.hide();
        this.modalRegion.empty();
        // body
        this.modalLayoutView.$el.removeClass("modal-open");

        this.modalRegion.$el.next(".modal-backdrop").remove();

        if (done) {
            done();
        }
    },

    onBeforeDestroy: function () {
        this.modalRegion.empty();
        delete this.modalRegion;

        this.modalLayoutView.destroy();
        delete this.modalLayoutView;
    }
});
