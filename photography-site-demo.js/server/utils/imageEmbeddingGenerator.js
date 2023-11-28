'use strict';
const { PythonShell } = require('python-shell');

module.exports = async function getPhotoEmbedding(fileName) {
  const filePath = './public/uploads/' + fileName;
  const options = {
    args: [filePath]
  };

  return new Promise((resolve, reject) => {
    PythonShell.run('./server/utils/imageEmbeddingGenerator.py', options).then(messages => {
      const vector = JSON.parse(messages[0]);
      resolve(vector);
    }).catch(error => {
      reject(error);
    });
  });
};