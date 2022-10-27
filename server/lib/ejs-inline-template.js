'use strict';

/***
 * 重写 ejs 的读取文件方法, 提供忽略 <script type="text/ejs-template"></script> 功能
 * @param  delimiter  分隔符
 *
 * 模板中使用:
 *  <script type="text/ejs-template">  <% 此内容不会编译 %>  </script>
 *  <script type="text/ejs-template">  <%% 此内容会编译 %>  </script>
 */

const fs = require('fs');
const ejs = require('ejs');

const REG_INLINE_TEMPLATE = /<script\b[^>]*type="text\/ejs-template"[^>]*>([\s\S]*?)<\/script>/gm;

// 重写 ejs 的读取文件方法, 提供忽略 <script type="text/ejs-template"></script> 功能
function replace(str, replaceFrom, replaceTo) {
    replaceFrom = new RegExp(replaceFrom, 'gm');

    return str.replace(replaceFrom, replaceTo);
}

function rewriteEjsFileLoader(delimiter) {
    ejs.fileLoader = function(filepath) {
        let template = fs.readFileSync(filepath, 'utf8');

        let matched = template.match(REG_INLINE_TEMPLATE);

        if (matched) {
            delimiter = delimiter || '%';

            matched.forEach(function(input) {
                // 将 text/ejs-template 内容中的 '<%' 替换成 '<%%', 后续由 ejs 还原, 这样就不会被编译
                let temp = replace(input, '<' + delimiter, '<' + delimiter + delimiter);

                // 将 text/ejs-template 内容中的 '<%%%' 替换成 '<%', 后续由 ejs 编译
                let output = replace(temp, '<' + delimiter + delimiter + delimiter, '<' + delimiter);

                template = template.replace(input, output);
            });
        }
        return template;
    };
}

module.exports = rewriteEjsFileLoader;
