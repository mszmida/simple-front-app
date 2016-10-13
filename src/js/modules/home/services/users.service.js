"use strict";

const Marionette = require("backbone.marionette"),
    $ = require("jquery");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioRequests: {
        "service:users:fetch": "fetchUsers",
        "service:user:create": "createEditUser",
        "service:user:edit": "createEditUser",
        "service:user:remove": "removeUser"
    },

    _simulateServerResponse: function (deferred, data) {
        setTimeout(function () {
            deferred.resolve({ status: "OK", data: data });
            // deferred.reject({ status: "ERR" });
        }, 1);
    },

    // this is only dummy implementation
    // eventually users should be FETCHED from the server
    fetchUsers: function () {
        var deferred = $.Deferred(),
            users = [
                { name: "John Snow", email: "john@snow.com" },
                { name: "Edward Nożycoręki", email: "edi@noz.com" },
                { name: "Mr Anderson", email: "mr@anderson.com" }
            ];

        this._simulateServerResponse(deferred, users);

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
    // eventually user should be CREATED/UPDATED on the server
    createEditUser: function (formData) {
        var deferred = $.Deferred(),
            user = this._parseFormData(formData);

        this._simulateServerResponse(deferred, user);

        return deferred.promise();
    },

    // this is only dummy implementation
    // eventually user should be REMOVED on the server
    removeUser: function (modelJSON) {
        var deferred = $.Deferred();

        this._simulateServerResponse(deferred, modelJSON);

        return deferred.promise();
    }
});
