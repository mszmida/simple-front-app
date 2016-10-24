"use strict";

const Marionette = require("backbone.marionette"),
    UsersPaginationTemplate = require("modules/home/templates/users.pagination.template.ejs"),
    Radio = require("backbone.radio"),
    $ = require("jquery");


module.exports = Marionette.View.extend({
    className: "panel-footer",

    template: UsersPaginationTemplate,

    ui: {
        usersPreviousPage: ".js-users-previous-page",
        usersPage: ".js-users-page",
        usersNextPage: ".js-users-next-page"
    },

    events: {
        "click @ui.usersPreviousPage": "showPreviousPage",
        "click @ui.usersPage": "showPage",
        "click @ui.usersNextPage": "showNextPage"
    },

    modelEvents: {
        "change:pages": "onPagesChanged",
        "change:total": "onUsersTotalChanged"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.previousActivePage = null;
    },

    showPreviousPage: function (e) {
        var currentPage = this.model.get("page");

        e.preventDefault();

        if (currentPage > 1) {
            currentPage--;

            this.previousActivePage.removeClass("active");
            this.previousActivePage = this.previousActivePage.prev();
            this.previousActivePage.addClass("active");

            this.channel.trigger("users:show:page", currentPage);
        }
    },

    showPage: function (e) {
        e.preventDefault();

        this.previousActivePage.removeClass("active");
        this.previousActivePage = $(e.target).parent();
        this.previousActivePage.addClass("active");

        this.channel.trigger("users:show:page", $(e.target).text());
    },

    showNextPage: function (e) {
        var currentPage = this.model.get("page"),
            pages = this.model.get("pages");

        e.preventDefault();

        if (currentPage < pages) {
            currentPage++;

            this.previousActivePage.removeClass("active");
            this.previousActivePage = this.previousActivePage.next();
            this.previousActivePage.addClass("active");

            this.channel.trigger("users:show:page", currentPage);
        }
    },

    onPagesChanged: function () {
        this.render();
    },

    onUsersTotalChanged: function (model) {
        var firstPage = this.ui.usersPreviousPage.parent().next();

        if (!this.previousActivePage.is(firstPage)) {
            this.previousActivePage.removeClass("active");
            this.previousActivePage = firstPage;
            this.previousActivePage.addClass("active");
        }
    },

    onRender: function () {
        this.previousActivePage = this.ui.usersPreviousPage.parent().next();
        this.previousActivePage.addClass("active");
    },

    onBeforeDestroy: function () {
        delete this.channel;

        this.previousActivePage = null;
    }
});
