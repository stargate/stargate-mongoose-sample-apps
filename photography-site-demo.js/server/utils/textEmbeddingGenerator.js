// openAI embedding
// https://platform.openai.com/docs/api-reference/embeddings/create
const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const endpoint = 'https://api.openai.com/v1/embeddings';
const modelType = 'text-embedding-ada-002';

const config = {
    headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    }
};

module.exports = async function createPhotoEmbedding(photoDescription) {
    let requestData = {
        input: photoDescription,
        model: modelType
    };
    const response = await axios.post(endpoint, requestData, config);
    return response.data.data[0].embedding;
}
