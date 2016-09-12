"use strict";

const Marionette = require("backbone.marionette"),
    UserRowView = require("modules/home/views/row.view.js");


module.exports = Marionette.CollectionView.extend({
	tagName: "tbody",
    childView: UserRowView
});
