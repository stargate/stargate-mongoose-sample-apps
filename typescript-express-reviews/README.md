# typescript-express-reviews

This sample demonstrates integrating Mongoose with [`express`](https://www.npmjs.com/package/express).

## Setup

Make sure you have Node.js 20.6.0 or higher and a local Data API instance running as described on the [main page](../README.md) of this repo.

## Running This Example

1. Run `npm install`
1. Create a `.env` file using the instructions in `.env.example`
1. Run `npm run seed`
1. Run `npm run build` to build the example
1. Run `npm start`
1. Visit `http://localhost:3000/review/find-by-vehicle?vehicleId=111111111111111111111111` to see the reviews for a vehicle. You should see the following JSON output:

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
