"use strict";

const Marionette = require("backbone.marionette"),
    Backbone = require("backbone"),
    $ = require("jquery");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioRequests: {
        "service:users:fetch": "fetchUsers",
        "service:user:create": "createEditUser",
        "service:user:edit": "createEditUser",
        "service:user:remove": "removeUser"
    },

    initialize: function () {
        // Backbone Collection for internal service usage only
        this.users = new Backbone.Collection([
            { name: "John Snow", email: "john@snow.com" },
            { name: "Edward Nożycoręki", email: "edi@noz.com" },
            { name: "Mr Anderson", email: "mr@anderson.com" },
            { name: "Mr Anderson2", email: "mr2@anderson.com" },
            { name: "Mr Anderson3", email: "mr3@anderson.com" },
            { name: "Mr Anderson4", email: "mr4@anderson.com" },
            { name: "Mr Anderson5", email: "mr5@anderson.com" },
            { name: "Mr Anderson6", email: "mr6@anderson.com" },
            { name: "Mr Anderson7", email: "mr7@anderson.com" },
            { name: "Mr Anderson8", email: "mr8@anderson.com" },
            { name: "Mr Anderson9", email: "mr9@anderson.com" }
        ]);
    },

    // this is only dummy implementation
    // eventually users should be FETCHED from the server
    fetchUsers: function (page, limit) {
        var deferred = $.Deferred(),
            count = this.users.length,
            limit = limit || 5,
            pages = Math.ceil(count / limit),
            begin = (page * limit) - limit,
            offset = begin + limit,
            // get simple array of objects
            batch = this.users.toJSON().slice(begin, offset);

        this._simulateServerResponse(deferred, {
            users: batch,
            page: page,
            limit: limit,
            pages: pages,
            total: count
        });

        return deferred.promise();
    },

    _simulateServerResponse: function (deferred, data) {
        setTimeout(function () {
            deferred.resolve({ status: "OK", data: data });
            // deferred.reject({ status: "ERR" });
        }, 1);
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
