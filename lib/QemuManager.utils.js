const fs = require("fs")

function getServerFileList(path){
    return new Promise(res=>{
        fs.readdir(path, (err, files) => {
            res(files);
        });
    })
}

module.exports = {
    getServerFileList
}