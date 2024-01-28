const fs = require('fs-extra')

/**
   * Returns the name of every file in a folder
   * @param  {String} path  The path in which files will be searched
   */
module.exports.fetchFiles = function(path) {
    let files = []
    fs.readdirSync(path).forEach(file => {
        files.push(file.split(".")[0])
    });
    return files
}

