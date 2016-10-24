"use strict";

const Marionette = require("backbone.marionette"),
    UserAddEditTemplate = require("modules/home/templates/user.create.edit.template.ejs"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "modal-body",

    template: UserAddEditTemplate,

    templateContext: function() {
        return {
            isCreate: this.isCreate
        }
    },

    ui: {
        userSubmit: ".js-user-submit"
    },

    events: {
        "click @ui.userSubmit": "userSubmit"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.isCreate = this.getOption("isCreate") !== false;
    },

    userSubmit: function (event) {
        var formData = this.$el.children("form").serializeArray();

        event.preventDefault();

        if (this.isCreate) {
            this.channel.trigger("user:create", formData);
        } else {
            this.channel.trigger("user:edit", formData, this.getOption("model"));
        }
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});