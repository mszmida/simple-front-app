"use strict";

const Marionette = require("backbone.marionette"),
    ModalTemplate = require("common/modal/templates/modal.template.ejs"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "modal-dialog",

    attributes: {
        role: "document"
    },

    template: ModalTemplate,

    templateContext: function () {
        return {
            title: this.title
        }
    },

    ui: {
        closeModalButton: "[data-dismiss=\"modal\"]",
    },

    events: {
        "click @ui.closeModalButton": "closeModal"
    },

    regions: {
        modalBody: {
            el: ".modal-body",
            replaceElement: true
        }
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.title = this.getOption("title");
        this.bodyView = this.getOption("body");

        if (!this.title) {
            throw new Error("Modal 'title' must be defined!");
        }

        if (!this.bodyView) {
            throw new Error("Modal 'body' view must be defined!");
        }
    },

    closeModal: function () {
        this.channel.trigger("modal:close");
    },

    onRender: function () {
        this.showChildView("modalBody", this.bodyView);
    },

    onBeforeDestroy: function () {
        this.bodyView.destroy();

        delete this.channel;
    }
});
