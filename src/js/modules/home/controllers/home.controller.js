"use strict";

const Marionette = require('backbone.marionette'),
    Backbone = require("backbone"),
    UsersView = require("modules/home/views/users.view.js"),
    UsersCollection = require("modules/home/models/users.collection.js"),
    UsersFetchFailedTemplate = require("modules/home/templates/users.fetch.failed.template.ejs"),
    UsersFailedTemplate = require("modules/home/templates/users.failed.template.ejs");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioEvents: {
        "user:create": "createUser",
        "user:edit": "editUser",
        "user:remove": "removeUser",
        "users:show:page": "showUsersPage"
    },

    initialize: function () {
        this.channel = this.getChannel();
        this.users = new UsersCollection();
        this.model = null;
    },

    getUsersView: function (obj) {
        return new UsersView(obj);
    },

    getUsersFetchFailedView: function () {
        return new Marionette.View({
            template: UsersFetchFailedTemplate
        });
    },

    getFailedView: function () {
        return new Marionette.View({
            className: "modal-body",
            template: UsersFailedTemplate
        });
    },

    fetchUsers: function (page, elements) {
        return this.channel.request("service:users:fetch", page, elements);
    },

    showHome: function () {
        this.fetchUsers(1, 5)
            .done(this._onFetchUsersInitPageSuccess.bind(this))
            .fail(this._onFetchUsersFail.bind(this));
    },

    _onFetchUsersInitPageSuccess: function (res) {
        var self = this;

        this.model = new Backbone.Model(res.data);
        this.users.reset(res.data.users);

        this.channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersView({ model: self.model, collection: self.users }));
        });
    },

    _onFetchUsersFail: function (res) {
        var self = this;

        this.channel.trigger("layout:show", function (contentRegion) {
            contentRegion.show(self.getUsersFetchFailedView());
        });
    },

    showUsersPage: function (page) {
        this.fetchUsers(page, 5)
            .done(this._onfetchUsersPageSuccess.bind(this))
            .fail(this._onFetchUsersFail.bind(this));
    },

    _onfetchUsersPageSuccess: function (res) {
        this.model.set(res.data);

        this.users.reset(res.data.users);
    },

    createUser: function (formData) {
        this.channel.request("service:user:create", formData)
            .done(this._onCreateUserSuccess.bind(this))
            .fail(this._onCommunicationFail.bind(this));
    },

    _onCreateUserSuccess: function (res) {
        this.showUsersPage(1);

        this.channel.trigger("modal:close");
    },

    _onCommunicationFail: function () {
        this.channel.trigger("modal:close", this._showFailedModal.bind(this));
    },

    _showFailedModal: function (title) {
        this.channel.trigger("modal:show", {
            title: "Operation failed!",
            body: this.getFailedView()
        });
    },

    editUser: function (formData, userModel) {
        this.channel.request("service:user:edit", formData, userModel)
            .done(this._onEditUserSuccess.bind(this, userModel))
            .fail(this._onCommunicationFail.bind(this));
    },

    _onEditUserSuccess: function (userModel, res) {
        userModel.set(res.data);

        this.channel.trigger("modal:close");
    },

    removeUser: function (model, collection) {
        this.channel.request("service:user:remove", model)
            .done(this._onRemoveUserSuccess.bind(this))
            .fail(this._onCommunicationFail.bind(this));
    },

    _onRemoveUserSuccess: function (res) {
        this.showUsersPage(1);

        this.channel.trigger("modal:close");
    },

    onBeforeDestroy: function () {
        if (this.model) {
            delete this.model;
        }

        this.users.reset();

        delete this.users;
        delete this.channel;
    }
});
