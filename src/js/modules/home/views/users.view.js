"use strict";

const Marionette = require("backbone.marionette"),
    UsersTemplate = require("modules/home/templates/users.template.ejs"),
    UsersTableView = require("modules/home/views/table/table.view.js");


module.exports = Marionette.View.extend({
    className: "users-main-view",
    template: UsersTemplate,

    regions: {
        table: {
            el: "table",
            replaceElement: true
        }
    },

    onRender: function() {
        this.showChildView("table", new UsersTableView({ users: this.getOption("users") }));
    }
});
