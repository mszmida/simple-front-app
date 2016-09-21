"use strict";

const Marionette = require("backbone.marionette"),
    UsersTableTemplate = require("modules/home/templates/table.template.ejs"),
    UsersCollectionView = require("modules/home/views/collection.view.js");


module.exports = Marionette.View.extend({
    tagName: "table",
    className: "table table-hover table-bordered table-striped",
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
