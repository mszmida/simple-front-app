"use strict";

const Marionette = require("backbone.marionette"),
    UsersTemplate = require("modules/home/templates/users.template.ejs"),
    UsersTableView = require("modules/home/views/table/table.view.js"),
    UserCreateEditView = require("modules/home/views/user.create.edit.view.js"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "users-main-view",

    template: UsersTemplate,

    regions: {
        table: {
            el: "table",
            replaceElement: true
        }
    },

    ui: {
        createUserButton: ".js-user-create",
    },

    events: {
        "click @ui.createUserButton": "createUser"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
    },

    getUserCreateEditView: function () {
        return new UserCreateEditView();
    },

    getUsersTableView: function () {
        return new UsersTableView({ users: this.getOption("users") });
    },

    createUser: function () {
        this.channel.trigger("modal:show", { title: "Create user", body: this.getUserCreateEditView() });
    },

    onRender: function() {
        this.showChildView("table", this.getUsersTableView());
    }
});
