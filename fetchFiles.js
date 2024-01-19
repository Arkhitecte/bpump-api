const fs = require('fs-extra')

module.exports.fetchFiles = function(path) {
    let files = []
    fs.readdirSync(path).forEach(file => {
        files.push(file)
        console.log(file);
    });
    return files
}