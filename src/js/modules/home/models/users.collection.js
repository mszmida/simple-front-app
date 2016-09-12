"use strict";

const Backbone = require("backbone"),
    User = require("modules/home/models/user.model.js");


module.exports = Backbone.Collection.extend({
    model: User
});
