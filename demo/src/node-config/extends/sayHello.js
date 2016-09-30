/**
 * sayHello示例
 * Author:luolei
 * @param sayHello
 * 在ejs模板中可以直接通过<%= sayHello() %>
 * @returns {string}
 */
module.exports = function (str) {
	var str = !!str ? str: 'World!';
    return ('Hello' + ' ' + str)
}