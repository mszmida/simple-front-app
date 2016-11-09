"use strict";

const Marionette = require("backbone.marionette"),
    UserAddEditTemplate = require("modules/home/templates/user.create.edit.template.ejs"),
    Radio = require("backbone.radio");


module.exports = Marionette.View.extend({
    className: "modal-body",

    template: UserAddEditTemplate,

    behaviors: {
        InputValidator: {
           fields: {
                name: {
                    el: "#userName",
                    validators: {
                        required: "User name cannot be empty."
                    }
                },
                email: {
                    el: "#userEmail",
                    validators: {
                        required: "Email address cannot be empty.",
                        email: "Please enter a valid email address."
                    }
                }
            }
        }
    },

    initialize: function () {
        this.channel = Radio.channel("global");
        this.isCreate = this.getOption("isCreate") !== false;
    },

    onModalSubmit: function () {
        this.triggerMethod("validation:run");
    },

    onValidationSuccess: function () {
        var formData = this.$el.children("form").serializeArray();

        if (this.isCreate) {
            this.channel.trigger("user:create", formData);
        } else {
            this.channel.trigger("user:edit", formData, this.model);
        }
    },

    _populateForm: function (form, model) {
        var formInputs,
            input,
            inputName,
            attributes = model.attributes;

        formInputs = form.find("input");

        formInputs.each(function (key, input) {
            inputName = input.name;

            if (attributes.hasOwnProperty(inputName)) {
                input.value = attributes[inputName];
            }
        });
    },

    onRender: function () {
        if (!this.isCreate) {
            this._populateForm(this.$el.children("form"), this.model);
        }
    },

    onBeforeDestroy: function () {
        delete this.channel;
    }
});
