import { convertSchemaToUDTColumns, tableDefinitionFromSchema } from "@datastax/astra-mongoose";
import mongoose from "./models/mongoose";
import { Schema } from 'mongoose';

mongoose.set('debug', true);

function overwriteModel(connection: typeof mongoose.connection, name: string, schema: Schema, collection: string) {
  connection.deleteModel(name);
  return connection.model(name, schema, collection);
}

function parseJSON(v: any) {
  return v == null || typeof v !== 'string' ? v : JSON.parse(v);
}

function stringifyJSON(v: any) {
  return v == null ? v : JSON.stringify(v);
}

export default async function mongooseStudioSetup(connection: typeof mongoose.connection) {
  let StudioDashboards = connection.model('__Studio_Dashboard');
  const studioDashboardsSchema = StudioDashboards.schema.clone();
  studioDashboardsSchema.pre('updateOne', function (this: any) {
    // $setOnInsert not supported in table mode
    delete this.getUpdate().$setOnInsert;
  });
  StudioDashboards = overwriteModel(connection, '__Studio_Dashboard', studioDashboardsSchema, 'studio__dashboards');

  let StudioDashboardResult = connection.model('__Studio_DashboardResult');
  const studioDashboardResultSchema = StudioDashboardResult.schema.omit(['result', 'error']).add({
    result: {
      type: String,
      get: parseJSON,
      set: stringifyJSON
    },
    error: {
      type: String,
      get: parseJSON,
      set: stringifyJSON
    }
  });
  studioDashboardResultSchema.pre('updateOne', function (this: any) {
    // $setOnInsert not supported in table mode
    delete this.getUpdate().$setOnInsert;
  });
  StudioDashboardResult = overwriteModel(
    connection,
    '__Studio_DashboardResult',
    studioDashboardResultSchema,
    'studio__dashboardResults'
  );

  let studioChatThread = connection.model('__Studio_ChatThread');
  const studioChatThreadSchema = studioChatThread.schema.omit(['sharingOptions.sharedWithWorkspace']);
  studioChatThread = overwriteModel(connection, '__Studio_ChatThread', studioChatThreadSchema, 'studio__chatThreads');

  let studioChatMessage = connection.model('__Studio_ChatMessage');
  const tollCallSchema = studioChatMessage.schema.path('toolCalls').schema.omit(['input']).add({
    input: {
      type: String,
      get: parseJSON,
      set: stringifyJSON
    }
  });
  tollCallSchema.options.udtName = 'ToolCall';
  const studioChatMessageSchema = studioChatMessage.schema.omit(['toolCalls']).add({
    toolCalls: {
      type: Set,
      of: {
        type: tollCallSchema,
        required: true
      }
    }
  });
  studioChatMessageSchema.path('executionResult').schema = studioChatMessageSchema.path('executionResult').schema.omit(['output']).add({
    output: {
      type: String,
      get: parseJSON,
      set: stringifyJSON
    }
  });
  studioChatMessageSchema.options.versionKey = false;
  studioChatMessageSchema.path('executionResult').options.udtName = 'ExecutionResult';
  studioChatMessageSchema.pre('updateOne', function (this: any) {
    // $setOnInsert not supported in table mode
    delete this.getUpdate().$setOnInsert;
  })
  studioChatMessage = overwriteModel(connection, '__Studio_ChatMessage', studioChatMessageSchema, 'studio__chatMessages');
  await connection.syncTypes([
    {
      name: 'ToolCall',
      definition: {
        fields: convertSchemaToUDTColumns(tollCallSchema)
      }
    },
    {
      name: 'ExecutionResult',
      definition: {
        fields: convertSchemaToUDTColumns(studioChatMessageSchema.path('executionResult').schema)
      }
    }
  ]);

  await connection.collection('studio__dashboards').syncTable(
    tableDefinitionFromSchema(StudioDashboards.schema)
  );
  await connection.collection('studio__dashboardResults').syncTable(
    tableDefinitionFromSchema(studioDashboardResultSchema)
  );
  await connection.collection('studio__chatThreads').syncTable(
    tableDefinitionFromSchema(studioChatThreadSchema)
  );
  await connection.collection('studio__chatMessages').syncTable(
    tableDefinitionFromSchema(studioChatMessageSchema)
  );
}
