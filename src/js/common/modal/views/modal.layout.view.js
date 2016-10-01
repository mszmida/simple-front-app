"use strict";

const Marionette = require("backbone.marionette");


module.exports = Marionette.View.extend({
    el: "body",

    template: false,

    regions: {
        modalRegion: "#modal-region"
    }
});
