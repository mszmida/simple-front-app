"use strict";

const Backbone = require("backbone");


module.exports = Backbone.Model.extend({
    defaults: {
        "name": "default name",
        "email": "default@mail.com"
    }
});
