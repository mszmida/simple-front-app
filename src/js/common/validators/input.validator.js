"use strict";

const Marionette = require("backbone.marionette");


// basic implementation of input validator
module.exports = Marionette.Behavior.extend({
    initialize: function (options) {
        this.validators = {
            "required": this._requiredValidator,
            "email": this._emailValidator
        };

        this.fieldsListeners = { };
        this.validationErrors = { };

        this.listenTo(this.view, "validation:run", function () {
            this._validate();
        });
    },

    // initiates input validation mechanism according to 'fields' object
    _init: function () {
        var fieldKey,
            fieldDef,
            field;


        this.fields = this.getOption("fields");

        if (!this.fields) {
            throw new Error("Fields must be defined!");
        }

        if (typeof this.fields !== "object") {
            throw new Error("Fields must be an object!");
        }

        for (fieldKey in this.fields) {
            fieldDef = this.fields[fieldKey];

            if (typeof fieldDef !== "object") {
                throw new Error("Field definition must be an object");
            }

            if (!fieldDef.hasOwnProperty("el")) {
                throw new Error("Property 'el' must be defined");
            }

            if (!fieldDef.hasOwnProperty("validators")) {
                throw new Error("Property 'validators' must be defined!");
            }

            field = this.$el.find(fieldDef.el);

            if (field.length === 0) {
                throw new Error("Field cannot be found!");
            }

            this._attachListeners(fieldKey, field, fieldDef.validators);
        }
    },

    _attachListeners: function (fieldKey, field, validators) {
        var onFieldEvent;

        this.fieldsListeners[fieldKey] = { };
        this.fieldsListeners[fieldKey].element = field;
        this.fieldsListeners[fieldKey].listeners = [];

        onFieldEvent = this._validateField.bind(this, fieldKey, field, validators);
        this.fieldsListeners[fieldKey].listeners.push(onFieldEvent);

        field.on("blur", onFieldEvent);
    },

    _validateField: function (fieldKey, field, validators) {
        var validator,
            validatorMsg;


        for (validator in validators) {
            validatorMsg = validators[validator];

            if (!this._isValidField(field, validator)) {
                this.validationErrors[fieldKey] = { };
                this.validationErrors[fieldKey][validator] = { };
                this.validationErrors[fieldKey][validator] = validatorMsg;

                this._attachValidatorMessage(field, validatorMsg);

                // if any validator will fail there is no need to check the rest of them
                break;
            } else {
                if (this.validationErrors.hasOwnProperty(fieldKey)) {
                    delete this.validationErrors[fieldKey];
                }

               this._detachValidatorMessage(field, validatorMsg);
            }
        }
    },

    _isValidField: function (field, validator) {
        if (!this.validators.hasOwnProperty(validator)) {
            throw new Error("Validator '" + validator + "' is not defined!");
        }

        return this.validators[validator].call(this, field[0].value);
    },

    _attachValidatorMessage: function (field, message) {
        var fieldParent = field.parent(),
            helpBlockId = field.attr("id") + "HelpBlock";

        this._detachValidatorMessage(field);

        if (!fieldParent.hasClass("has-error")) {
            fieldParent.addClass("has-error");
            field.attr("aria-describedby", helpBlockId);
            field.after(`<span id="${helpBlockId}" class="help-block">${message}</span>`);
        }
    },

    _detachValidatorMessage: function (field) {
        var fieldParent = field.parent();

        if (fieldParent.hasClass("has-error")) {
            fieldParent.removeClass("has-error");
            field.removeAttr("aria-describedby");
            field.next().remove();
        }
    },

    _requiredValidator: function (value) {
        return (value) ? true : false;
    },

    _emailValidator: function (value) {
        // very weak email regexp
        return /^.+@.+\..+$/.test(value);
    },

    _iterateFieldsListeners: function (callback) {
        var fieldKey,
            fieldObj;


        for (fieldKey in this.fieldsListeners) {
            fieldObj = this.fieldsListeners[fieldKey];

            fieldObj.listeners.forEach(function (handler) {
                if (typeof callback !== "function") {
                    throw new Error("Argument must be a function!");
                }

                callback(fieldObj, handler);
            });
        }
    },

    // this function runs all validators on every field
    _validate: function () {
        this._iterateFieldsListeners(function (fieldObj, handler) {
            handler();
        });

        if (Object.keys(this.validationErrors).length === 0) {
            this.view.triggerMethod("validation:success");
        } else {
            this.view.triggerMethod("validation:fail", this.validationErrors);
        }
    },

    _detachListeners: function () {
        this._iterateFieldsListeners(function (fieldObj, handler) {
             fieldObj.element.off("blur", handler);
        });
    },

    onRender: function () {
        this._init();
    },

    onBeforeDestroy: function () {
        this._detachListeners();

        delete this.validationErrors;
        delete this.fieldsListeners;
        delete this.validators;
    }
});
