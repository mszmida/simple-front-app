"use strict";

const Marionette = require("backbone.marionette"),
    UsersTemplate = require("modules/home/templates/users.template.ejs"),
    UsersTableView = require("modules/home/views/table/table.view.js"),
    UserCreateEditView = require("modules/home/views/user.create.edit.view.js"),
    UsersPaginationView = require("modules/home/views/users.pagination.view.js"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "users-main-view",

    template: UsersTemplate,

    regions: {
        table: {
            el: "table",
            replaceElement: true
        },
        panelFooter: {
            el: "#panel-footer-region",
            replaceElement: true
        }
    },

    ui: {
        createUserButton: ".js-user-create",
    },

    events: {
        "click @ui.createUserButton": "createUser"
    },

    modelEvents: {
        "change:total": "onUsersTotalChanged"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
    },

    getUserCreateEditView: function () {
        return new UserCreateEditView();
    },

    getUsersTableView: function () {
        return new UsersTableView({ model: this.model });
    },

    getUsersPaginationView: function () {
        return new UsersPaginationView({ model: this.model });
    },

    createUser: function () {
        this.channel.trigger("modal:show", {
            title: "Create user",
            body: this.getUserCreateEditView()
        });
    },

    onUsersTotalChanged: function () {
        console.log("total changed", arguments);
    },

    onRender: function () {
        this.showChildView("table", this.getUsersTableView());

        if (this.model.get("pages") > 1) {
            this.showChildView("panelFooter", this.getUsersPaginationView());
        }
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});
