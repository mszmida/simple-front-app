"use strict";

const Marionette = require("backbone.marionette"),
    UsersEmptyTemplate = require("modules/home/templates/table/users.empty.template.ejs");


module.exports = Marionette.View.extend({
    tagName: "tr",

    template: UsersEmptyTemplate
});
