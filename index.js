/**
 * Created by patrickliu on 2017/6/24.
 */
const { execSync } = require('child_process');

exports = module.exports = ({path}) => {
    if (!path) {
        console.error('argv path must be set.');
        throw new Error('argv path must be set.');
        return;
    }

    return execSync('cd ' + __dirname + ' && gulp build --path ' + path);
};
