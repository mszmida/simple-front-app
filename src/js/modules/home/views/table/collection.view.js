"use strict";

const Marionette = require("backbone.marionette"),
    UserRowView = require("modules/home/views/table/row.view.js"),
    $ = require("jquery");


module.exports = Marionette.CollectionView.extend({
    tagName: "tbody",
    childView: UserRowView,

    childViewEvents: {
        "dropdown:button:clicked": "dropdownToggle"
    },

    childViewOptions: function(model, index) {
        return {
            index: index
        }
    },

    initialize: function () {
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
        var dropdownButton = child.getUI("dropdownButton"),
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

    onBeforeDestroy: function() {
        $(document).off("click", this.documentClickHandler);

        this.previousDropdownButton = null;
    }
});
