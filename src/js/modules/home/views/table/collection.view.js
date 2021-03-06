"use strict";

const Marionette = require("backbone.marionette"),
    UserRowView = require("modules/home/views/table/row.view.js"),
    UsersEmptyView = require("modules/home/views/table/users.empty.view.js"),
    UserCreateEditView = require("modules/home/views/user.create.edit.view.js"),
    UserRemoveConfirmationView = require("modules/home/views/user.remove.confirmation.view.js"),
    Radio = require("backbone.radio"),
    $ = require("jquery");


module.exports = Marionette.CollectionView.extend({
    tagName: "tbody",

    childView: UserRowView,

    emptyView: UsersEmptyView,

    childViewEvents: {
        "user:dropdown:button:clicked": "dropdownToggle",
        "user:edit:clicked": "editUser",
        "user:remove:clicked": "removeUser"
    },

    childViewOptions: function(model, index) {
        var page = this.model.get("page"),
            limit = this.model.get("limit");

        return {
            index: page * limit - limit + index + 1
        }
    },

    collectionEvents: {
        remove: "onCollectionRemove"
    },

    onCollectionRemove: function () {
        // re-render entire collection to refresh models indexes
        this.render();
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.previousDropdownButton = null;
        this.documentClickHandler = this.documentOnClick.bind(this);

        $(document).on("click", this.documentClickHandler);
    },

    documentOnClick: function (event) {
        if (!this.isPreviousDropdownButton(event.target)) {
            this.previousDropdownButtonClose();
        }
    },

    isPreviousDropdownButton: function (element) {
        if (!element) {
            throw new Error("Argument must be supplied!");
        }

        if (!this.previousDropdownButton) {
            return false;
        }

        if (!(element instanceof $ || element.constructor.prototype.jquery)) {
            element = $(element);
        }

        return $(element).is(this.previousDropdownButton.el);
    },

    previousDropdownButtonClose: function () {
        if (this.isPreviousDropdownButtonOpened()) {
            this.previousDropdownButton.parent.removeClass("open");
            this.previousDropdownButton.el.attr("aria-expanded", "false")
        }
    },

    isPreviousDropdownButtonOpened: function () {
        return !!(this.previousDropdownButton && this.previousDropdownButton.parent.hasClass("open"));
    },

    savePreviousDropdownButton: function (dropdownButton, dropdownButtonParent) {
        this.previousDropdownButton = {
            el: dropdownButton,
            parent: dropdownButtonParent
        };
    },

    dropdownToggle: function (child) {
        var dropdownButton = child.getUI("userDropdownButton"),
            dropdownButtonParent = dropdownButton.parent();

        if (!this.isPreviousDropdownButton(dropdownButton)) {
            // closing previously clicked dropdown button (if opened)
            this.previousDropdownButtonClose();
            // saving previously clicked dropdown button
            this.savePreviousDropdownButton(dropdownButton, dropdownButtonParent);
        }

        dropdownButtonParent.toggleClass("open");
        dropdownButton.attr("aria-expanded", function (i, val) {
            return val === "true" ? "false" : "true";
        });
    },

    getUserCreateEditView: function (options) {
        return new UserCreateEditView(options);
    },

    getUserRemoveConfirmView: function (options) {
        return new UserRemoveConfirmationView(options);
    },

    editUser: function (child) {
        this.channel.trigger("modal:show", {
            title: "Edit user",
            body: this.getUserCreateEditView({ isCreate: false, model: child.model }),
            submitButtonText: "Edit"
        });
    },

    removeUser: function (child) {
        var model = child.model;

        this.channel.trigger("modal:show", {
            title: "Remove user - confirmation",
            body: this.getUserRemoveConfirmView({ model: child.model }),
            submitButtonText: "Remove"
        });
    },

    onBeforeDestroy: function () {
        $(document).off("click", this.documentClickHandler);

        this.previousDropdownButton = null;

        delete this.channel;
    }
});
