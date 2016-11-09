"use strict";

const Marionette = require("backbone.marionette"),
    UserRemoveConfirmationTemplate = require("modules/home/templates/user.remove.confirmation.template.ejs"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "modal-body",

    template: UserRemoveConfirmationTemplate,

    initialize: function () {
        this.channel = Radio.channel("global");
    },

    onModalSubmit: function (event) {
        this.channel.trigger("user:remove", this.model, this.collection);
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});
