"use strict";

const Marionette = require("backbone.marionette"),
    UserRowView = require("modules/users/views/row.view.js");


module.exports = Marionette.CollectionView.extend({
	tagName: "tbody",
    childView: UserRowView
});
