"use strict";

const Marionette = require("backbone.marionette"),
    AlertTemplate = require("common/alert/templates/alert.template.ejs");


module.exports = Marionette.View.extend({
    template: AlertTemplate,

    regions: {
        alertBody: {
            el: ".alert-body-region",
            replaceElement: true
        }
    },

    templateContext: function () {
        return {
            type: this.type
        };
    },

    initialize: function () {
        var types = ["success", "info", "warning", "danger"];

        this.type = this.getOption("type");
        this.bodyView = this.getOption("body");

        if (types.indexOf(this.type) === -1) {
            throw new Error("Alert type is unknown!");
        }

        if (!this.bodyView) {
            throw new Error("Alert 'body' view must be defined!");
        }
    },

    onRender: function () {
        this.showChildView("alertBody", this.bodyView);
    },

    onBeforeDestroy: function () {
        this.bodyView.destroy();

        delete this.bodyView;
        delete this.type;
    }
});
