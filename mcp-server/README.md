# mcp-server

This application demonstrates building an MCP server using Data API and Mongoose.
The MCP server exposes Mongoose static functions as MCP tools.

## Setup

Make sure you have Node.js 20.6.0 or higher and a local Data API instance running as described on the [main page](../README.md) of this repo.

## Running This Example

1. Run `npm install`
1. Create a `.env` file using the instructions in `.env.example`
1. Run `npm run seed`
1. Run `npm start`
1. Set up ngrok to expose your local port 3000 to the internet
1. Add your ngrok URL with `/mcp` appended to an LLM client, for example as a [Claude connector](https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp) as shown in the first screenshot below.
1. Start using your MCP tools in your LLM client, like Claude as shown in the second screenshot below.

![MCP connector](https://github.com/user-attachments/assets/4c47f52a-2641-4dea-a4ee-323b3083cac9)

![MCP demo](https://github.com/user-attachments/assets/9b613478-850e-4911-ae49-d618b8f056e4)
