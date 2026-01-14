import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import mongoose from './mongoose.js';
import z from 'zod';

import './models.js';

const server = new McpServer({
  name: 'mongoose-mcp',
  version: '0.1.0'
});

const models = Object.values(mongoose.models);

server.registerTool(
  'list_mongoose_models',
  {
    title: 'List Mongoose models',
    description: 'lists available mongoose models and static functions',
    inputSchema: {},
    outputSchema: {
      out: z.array(
        z.object({
          modelName: z.string(),
          availableStaticFunctions: z.array(z.string())
        })
      )
    }
  },
  async () => {
    try {
      const out = [];
      for (const model of models) {
        out.push({
          modelName: model.modelName,
          availableStaticFunctions: Object.entries(model.schema.statics).filter(([name, fn]) => fn.mcpConfig).map(([name]) => name)
        });
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ out }) }],
        structuredContent: { out }
      };
    } catch (err) {
      console.error(err.stack);
      throw err;
    }
  }
);

for (const model of models) {
  for (const [name, fn] of Object.entries(model.schema.statics)) {
    if (!fn.mcpConfig) {
      continue;
    }
    console.log('Registering tool:', `${model.modelName}.${name}`);
    server.registerTool(
      `${model.modelName}_${name}`,
      {
        title: `${model.modelName}.${name}`,
        description: fn.mcpConfig.description,
        inputSchema: fn.mcpConfig.inputSchema,
        outputSchema: fn.mcpConfig.outputSchema
      },
      async (params) => {
        try {
          const res = await fn.call(model, params);
          console.log('Result:', res);
          return {
            content: [{ type: 'text', text: JSON.stringify(res) }],
            structuredContent: res
          };
        } catch (err) {
          console.log(err.stack);
          throw err;
        }
      }
    );
  }
}

const app = express();
app.use(express.json());
app.post('/mcp', async (req, res) => {
    // In stateless mode, create a new transport for each request to prevent
    // request ID collisions. Different clients may use the same JSON-RPC request IDs,
    // which would cause responses to be routed to the wrong HTTP connections if
    // the transport state is shared.

    try {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
            enableJsonResponse: true
        });

        res.on('close', () => {
            transport.close();
        });

        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            });
        }
    }
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    console.log(`MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});
