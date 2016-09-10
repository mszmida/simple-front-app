"use strict";

const Marionette = require("backbone.marionette"),
    UsersTableTemplate = require("modules/users/templates/table.template.ejs"),
    UsersCollectionView = require("modules/users/views/collection.view.js");


module.exports = Marionette.View.extend({
    tagName: "table",
    className: "table table-hover",
    template: UsersTableTemplate,

    regions: {
        tableBody: {
            el: "tbody",
            replaceElement: true
        }
    },

    onRender: function() {
        this.showChildView("tableBody", new UsersCollectionView({ collection: this.collection }));
    }
});
