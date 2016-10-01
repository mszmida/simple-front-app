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
        userSaveSubmit: ".js-user-save-submit"
    },

    events: {
        "click @ui.userSaveSubmit": "saveUserSubmit"
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.isCreate = this.getOption("isCreate") !== false;
        this.model = this.getOption("model");

        // if (!this.isCreate && !this.model) {
        //     throw new Error("Model need to be defined!");
        // }
    },

    saveUserSubmit: function (event) {
        var data = this.$el.children("form").serializeArray();

        event.preventDefault();

        if (this.isCreate) {
            this.channel.trigger("user:create", data);
        } else {
            this.channel.trigger("user:edit", data);
        }
    }
});
