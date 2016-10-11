"use strict";

const Marionette = require("backbone.marionette"),
    UsersService = require("modules/home/services/users.service.js"),
    HomeController = require("modules/home/controllers/home.controller.js");


module.exports =  Marionette.Object.extend({
    channelName: "global",

    initialize: function () {
        var channel = this.getChannel();

        this.service = new UsersService();
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
        this.service.destroy();
        this.controller.destroy();
    }
});
