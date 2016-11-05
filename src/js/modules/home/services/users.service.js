"use strict";

const Marionette = require("backbone.marionette"),
    Backbone = require("backbone"),
    $ = require("jquery");


module.exports = Marionette.Object.extend({
    channelName: "global",

    radioRequests: {
        "service:users:fetch": "fetchUsers",
        "service:user:create": "createUser",
        "service:user:edit": "editUser",
        "service:user:remove": "removeUser"
    },

    initialize: function () {
        // Backbone Collection for internal service usage only
        this.users = new Backbone.Collection([
            { id: 1, name: "Bruce Wayne", email: "bruce@wayne.com" },
            { id: 2, name: "Tony Stark", email: "tony@stark.com" },
            { id: 3, name: "Edward Nożycoręki", email: "edi@noz.com" },
            { id: 4, name: "Mr Anderson", email: "mr@anderson.com" },
            { id: 5, name: "Mr Anderson2", email: "mr@anderson2.com" },
            { id: 6, name: "Mr Anderson3", email: "mr@anderson3.com" },
            { id: 7, name: "Mr Anderson4", email: "mr@anderson4.com" },
            { id: 8, name: "Mr Anderson5", email: "mr@anderson5.com" },
            { id: 9, name: "Mr Anderson6", email: "mr@anderson6.com" },
            { id: 10, name: "Mr Anderson7", email: "mr@anderson7.com" }
        ]);

        this.counter = this.users.length;
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
    // eventually user should be CREATED on the server
    createUser: function (formData) {
        var deferred = $.Deferred(),
            user = this._parseFormData(formData);

        user.id = ++this.counter;
        this.users.add(user);

        this._simulateServerResponse(deferred, user);

        return deferred.promise();
    },

    // this is only dummy implementation
    // eventually user should be UPDATED on the server
    editUser: function (formData, userModel) {
        var deferred = $.Deferred(),
            user = this._parseFormData(formData);

        userModel.set(user);
        this.users.add(userModel, { merge: true });

        this._simulateServerResponse(deferred, user);

        return deferred.promise();
    },

    // this is only dummy implementation
    // eventually user should be REMOVED on the server
    removeUser: function (userModel) {
        var deferred = $.Deferred();

        this.users.remove(userModel);

        this._simulateServerResponse(deferred, userModel.toJSON());

        return deferred.promise();
    }
});
