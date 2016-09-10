"use strict";

var Marionette = require("backbone.marionette"),
    UserRowView = require("./row.view.js");


module.exports = Marionette.CollectionView.extend({
	tagName: "tbody",
    childView: UserRowView
});
