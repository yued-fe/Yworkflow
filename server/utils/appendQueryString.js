'use strict'

module.exports = function (str, queryString) {
    if (!queryString) {
        return str;
    }
    return str + (str.indexOf('?') > -1 ? '&' : '?') + queryString.replace(/^\?/, '');
};
