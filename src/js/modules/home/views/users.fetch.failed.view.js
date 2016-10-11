"use strict";

const Marionette = require("backbone.marionette"),
    UsersFetchFailedTemplate = require("modules/home/templates/users.fetch.failed.template.ejs");


module.exports = Marionette.View.extend({
    template: UsersFetchFailedTemplate
});
