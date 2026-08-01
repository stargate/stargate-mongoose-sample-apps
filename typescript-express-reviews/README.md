# typescript-express-reviews

This sample demonstrates integrating Mongoose with [`express`](https://www.npmjs.com/package/express).

## Setup

Make sure you have Node.js 20.6.0 or higher and a local Data API instance running as described on the [main page](../README.md) of this repo.

## Running This Example

Before running this example, make sure you've cloned the [stargate-mongoose-sample-apps](https://github.com/stargate/stargate-mongoose-sample-apps) GitHub repository, and navigated to the `typescript-express-reviews` directory.
From there:

1. Run `npm install`
2. Create a `.env` file using the instructions in `.env.example`
3. Run `npm run seed`
4. Run `npm run build` to build the example
5. Run `npm start`
6. Visit `http://localhost:3000/review/find-by-vehicle?vehicleId=111111111111111111111111` to see the reviews for a vehicle. You should see the JSON output show below.
7. Visit `http://localhost:3000/studio` to view the data in [Mongoose Studio](https://mongoosestudio.app/)

```
{
  "reviews": [
    {
      "_id": "6425a0ca8f330d09e7767e14",
      "rating": 4,
      "text": "When you live your life a quarter of a mile at a time, it ain't just about being fast. I needed a 10 second car, and this car delivers.",
      "userId": "6425a0ca8f330d09e7767e0e",
      "vehicleId": "111111111111111111111111",
      "createdAt": "2023-03-30T14:46:34.451Z",
      "updatedAt": "2023-03-30T14:46:34.451Z",
      "__v": 0
    }
  ]
}
```

### Mongoose Studio AI Chat

To use the AI chat feature in Mongoose Studio, you need to provide your own API key for OpenAI, Anthropic, or Google Gemini.
Add one of the following environment variables to your `.env` file with your API key.

```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GEMINI_API_KEY=
```
