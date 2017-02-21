"use strict";

const _ = require("underscore");

module.exports = {
    process(src, filename) {
        return `module.exports = function() {
            return ${_.template(src).source};
        };`;
    }
};
