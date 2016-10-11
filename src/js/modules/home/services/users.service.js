"use strict";

const Marionette = require("backbone.marionette"),
    $ = require("jquery");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioRequests: {
        "service:users:fetch": "fetchUsers",
        "service:user:create": "createUser",
        // "service:user:edit": "editUser",
        // "service:user:remove": "removeUser"
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
    },

    _parseFormData: function (formData) {
        var data = { };

        formData.forEach(function (field) {
            data[field.name] = field.value;
        });

        return data;
    },

    // this is only dummy implementation
    // eventually user should be CREATED on the server
    createUser: function (formData) {
        var deferred = $.Deferred(),
            user = this._parseFormData(formData);

        setTimeout(function () {
            deferred.resolve({ status: "OK", data: user });
            // deferred.reject({ status: "ERR" });
        }, 1);

        return deferred.promise();
    }
});
