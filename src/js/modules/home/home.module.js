"use strict";

const Marionette = require("backbone.marionette"),
    HomeController = require("modules/home/controllers/home.controller.js");


module.exports =  Marionette.Object.extend({
    channelName: "global",

    initialize: function () {
        var channel = this.getChannel();
    	this.controller = new HomeController();

        // init 'home' module router
    	new Marionette.AppRouter({
    		controller: this.controller,

		    appRoutes: {
		        "home": "showHome"
		    }
		});

		this.listenTo(channel, "home:show", function () {
            channel.trigger("navigate", "home");
            this.controller.showHome();
        });
    },

    onBeforeDestroy: function () {
        this.controller.destroy();
    }
});
