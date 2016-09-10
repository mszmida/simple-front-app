"use strict";

const Backbone = require("backbone"),
    User = require("modules/users/models/user.model.js");


module.exports = Backbone.Collection.extend({
    model: User
});
