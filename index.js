/**
 * Created by patrickliu on 2017/6/24.
 */
const  { execSync }  = require('child_process');

exports = module.exports = ({path}) => {
    if (!path) {
        console.error('无指定--yconfig配置,默认寻找当前目录下的.yconfig文件');
        throw new Error('请指定--yconfig配置');
        return;
    }
    return execSync('cd ' + __dirname + ' && gulp build --path ' + path);
};
