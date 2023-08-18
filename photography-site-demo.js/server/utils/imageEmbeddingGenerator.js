
let { PythonShell } = require('python-shell')

module.exports = async function getPhotoEmbedding(fileName) {
    let filePath = "./public/uploads/" + fileName;
    let options = {
        args: [filePath]
    };

    return new Promise((resolve, reject) => {
        PythonShell.run('./server/utils/imageEmbeddingGenerator.py', options).then(messages => {
            let vector = JSON.parse(messages[0]);
            resolve(vector);
        }).catch(error => {
            reject(error);
        });
    });
}