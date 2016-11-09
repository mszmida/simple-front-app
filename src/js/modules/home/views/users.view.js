"use strict";

const Marionette = require("backbone.marionette"),
    UsersTemplate = require("modules/home/templates/users.template.ejs"),
    UsersTableView = require("modules/home/views/table/table.view.js"),
    UserCreateEditView = require("modules/home/views/user.create.edit.view.js"),
    UsersPaginationView = require("modules/home/views/users.pagination.view.js"),
    AlertView = require("common/alert/views/alert.view.js"),
    Radio = require("backbone.radio"),
    AlertRegion = Marionette.Region.extend({
        onShow: function () {
            this.$el.hide().slideDown("fast");
        }
});

module.exports = Marionette.View.extend({
    className: "users-main-view",

    template: UsersTemplate,

    regions: {
        alerts: {
            regionClass: AlertRegion,
            el: "#users-alerts-region"
        },
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
        usersTotal: ".js-users-total"
    },

    events: {
        "click @ui.createUserButton": "createUser"
    },

    modelEvents: {
        "change:total": "onUsersTotalChanged"
    },

    initialize: function () {
        this.channel = Radio.channel("global");

        this.listenTo(this.channel, "users:alert:show", this.showAlert);
    },

    getAlertView: function (options) {
        return new AlertView(options);
    },

    getUserCreateEditView: function () {
        return new UserCreateEditView();
    },

    getUsersTableView: function (options) {
        return new UsersTableView(options);
    },

    getUsersPaginationView: function (options) {
        return new UsersPaginationView(options);
    },

    showAlert: function (options) {
        var alertsRegion = this.getRegion("alerts"),
            alertView = this.getAlertView(options);

        alertsRegion.show(alertView);

        setTimeout(this.hideAlert.bind(this), 2000, alertsRegion, alertView);
    },

    hideAlert: function (alertsRegion, alertView) {
        alertView.$el.slideUp("slow", function () {
            alertsRegion.empty();
        });
    },

    createUser: function () {
        this.channel.trigger("modal:show", {
            title: "Create user",
            body: this.getUserCreateEditView(),
            submitButtonText: "Create"
        });
    },

    onUsersTotalChanged: function (model, total) {
        this.ui.usersTotal.text(total);
    },

    onRender: function () {
        this.showChildView("table", this.getUsersTableView({ model: this.model, collection: this.collection }));

        if (this.model.get("pages") > 1) {
            this.showChildView("panelFooter", this.getUsersPaginationView({ model: this.model }));
        }
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});
