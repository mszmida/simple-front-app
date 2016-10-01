"use strict";

const Marionette = require("backbone.marionette"),
    UserTemplate = require("modules/home/templates/table/row.template.ejs");


module.exports = Marionette.View.extend({
    tagName: "tr",

    template: UserTemplate,

    templateContext: function() {
        return {
            index: this.getOption("index") + 1
        }
    },

    ui: {
        userDropdownButton: ".js-user-dropdown-button",
        userEdit: ".js-user-edit",
        userRemove: ".js-user-remove"
    },

    triggers: {
        "click @ui.userDropdownButton": "user:dropdown:button:clicked",
        "click @ui.userEdit": {
            event: "user:edit:clicked",
            stopPropagation: false
        },
        "click @ui.userRemove": {
            event: "user:remove:clicked",
            stopPropagation: false
        }
    }
});
