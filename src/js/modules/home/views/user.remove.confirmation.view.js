"use strict";

const Marionette = require("backbone.marionette"),
    UserRemoveConfirmationTemplate = require("modules/home/templates/user.remove.confirmation.template.ejs"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "modal-body",

    template: UserRemoveConfirmationTemplate,

    ui: {
        userRemoveOk: ".js-user-remove-ok"
    },

    events: {
        "click @ui.userRemoveOk": "userRemoveOk"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
    },

    userRemoveOk: function (event) {
        this.channel.trigger("user:remove", this.getOption("model"), this.getOption("collection"));
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});
