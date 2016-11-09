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
            title: this.title,
            submitButtonText: this.getOption("submitButtonText") || "OK",
            dismissButtonText: this.getOption("dismissButtonText") || "Cancel"
        }
    },

    ui: {
        closeModalButton: ".js-modal-close",
        modalSubmitButton: ".js-modal-submit",
        dismissModalButton: "[data-dismiss=\"modal\"]"
    },

    events: {
        "click @ui.closeModalButton": "closeModal",
        "click @ui.modalSubmitButton": "submitModal",
        "click @ui.dismissModalButton": "closeModal"
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

        this.onKeydownHandler = this.onKeydown.bind(this);
    },

    onKeydown: function (e) {
        switch (e.which) {
            case 9:
                this.trapFocusInModal(e);

                break;
            case 27:
                this.closeModal();

                break;
        }
    },

    trapFocusInModal: function (e) {
        if (e.target === this.ui.dismissModalButton[0] && e.shiftKey === false) {
            e.preventDefault();

            this.ui.closeModalButton.focus();
        } else if (e.target ===  this.ui.closeModalButton[0] && e.shiftKey === true) {
            e.preventDefault();

            this.ui.dismissModalButton.focus();
        }
    },

    closeModal: function () {
        this.channel.trigger("modal:close");
    },

    submitModal: function (e) {
        e.preventDefault();

        this.bodyView.triggerMethod("modal:submit");
    },

    onRender: function () {
        this.$el.on("keydown", this.onKeydownHandler);

        this.showChildView("modalBody", this.bodyView);
    },

    onDomRefresh: function () {
        this.ui.closeModalButton.focus();
    },

    onBeforeDestroy: function () {
        this.$el.off("keydown", this.onKeydownHandler);

        this.bodyView.destroy();

        delete this.bodyView;
        delete this.title;
        delete this.channel;
    }
});
