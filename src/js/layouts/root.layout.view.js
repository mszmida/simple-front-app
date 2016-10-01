"use strict";

const Marionette = require("backbone.marionette");


module.exports = Marionette.View.extend({
    el: "body",

    template: false,

    regions: {
        rootRegion: "#root-layout-region",
        modalRegion: "#modal-region"
    }
});
