"use strict";

const Marionette = require("backbone.marionette"),
    UserTemplate = require("modules/home/templates/table/row.template.ejs");


module.exports = Marionette.View.extend({
    tagName: "tr",
    template: UserTemplate,

    ui: {
        dropdownButton: ".js-dropdown-button",
    },

    triggers: {
        "click @ui.dropdownButton": "dropdown:button:clicked"
    },

    templateContext: function() {
        return {
            index: this.getOption("index") + 1
        }
    }
});
