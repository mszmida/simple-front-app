"use strict";

const Marionette = require("backbone.marionette"),
    $ = require("jquery");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioRequests: {
        "service:users:fetch": "fetchUsers"
    },

    // this is only dummy implementation
    // eventually users should be FETCHED from the server
    fetchUsers: function () {
        var deferred = $.Deferred();

        setTimeout(function () {
            var users = [
                { name: "John Snow", email: "john@snow.com" },
                { name: "Edward Nożycoręki", email: "edi@noz.com" },
                { name: "Mr Anderson", email: "mr@anderson.com" }
            ];

            deferred.resolve({ status: "OK", data: users });
            // deferred.reject({ status: "ERR" });
        }, 1);

        return deferred.promise();
    }
});
