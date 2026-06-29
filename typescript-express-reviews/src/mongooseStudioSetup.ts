import { convertSchemaToUDTColumns, tableDefinitionFromSchema } from "@datastax/astra-mongoose";
import mongoose from "./models/mongoose";

mongoose.set('debug', true);

export default async function mongooseStudioSetup() {
  let StudioDashboards = mongoose.model('__Studio_Dashboard');
  const studioDashboardsSchema = StudioDashboards.schema.omit(['createdBy.name', 'createdBy.email']);
  StudioDashboards = mongoose.model('__Studio_Dashboard', studioDashboardsSchema, 'studio__dashboards', { overwriteModels: true });

  let StudioDashboardResult = mongoose.model('__Studio_DashboardResult');
  const studioDashboardResultSchema = StudioDashboardResult.schema.omit(['result', 'error']).add({
    result: {
      type: String,
      get: (v: any) => JSON.parse(v),
      set: (v: any) => JSON.stringify(v)
    },
    error: {
      type: String,
      get: (v: any) => JSON.parse(v),
      set: (v: any) => JSON.stringify(v)
    }
  });
  studioDashboardResultSchema.pre('updateOne', function (this: any) {
    // $setOnInsert not supported in table mode
    delete this.getUpdate().$setOnInsert;
  })
  StudioDashboardResult = mongoose.model(
    '__Studio_DashboardResult',
    studioDashboardResultSchema,
    'studio__dashboardResults',
    { overwriteModels: true }
  );

  let studioChatThread = mongoose.model('__Studio_ChatThread');
  const studioChatThreadSchema = studioChatThread.schema.omit(['sharingOptions.sharedWithWorkspace']);
  studioChatThread = mongoose.model('__Studio_ChatThread', studioChatThreadSchema, 'studio__chatThreads', { overwriteModels: true });

  let studioChatMessage = mongoose.model('__Studio_ChatMessage');
  const tollCallSchema = studioChatMessage.schema.path('toolCalls').schema.omit(['input']).add({
    input: {
      type: String,
      get: (v: any) => JSON.parse(v),
      set: (v: any) => JSON.stringify(v)
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
      get: (v: any) => JSON.parse(v),
      set: (v: any) => JSON.stringify(v)
    }
  });
  studioChatMessageSchema.path('executionResult').options.udtName = 'ExecutionResult';
  studioChatMessageSchema.pre('updateOne', function (this: any) {
    // $setOnInsert not supported in table mode
    delete this.getUpdate().$setOnInsert;
  })
  studioChatMessage = mongoose.model('__Studio_ChatMessage', studioChatMessageSchema, 'studio__chatMessages', { overwriteModels: true });
  await mongoose.connection.syncTypes([
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

  await mongoose.connection.collection('studio__dashboards').syncTable(
    tableDefinitionFromSchema(StudioDashboards.schema)
  );
  await mongoose.connection.collection('studio__dashboardResults').syncTable(
    tableDefinitionFromSchema(studioDashboardResultSchema)
  );
  await mongoose.connection.collection('studio__chatThreads').syncTable(
    tableDefinitionFromSchema(studioChatThreadSchema)
  );
  await mongoose.connection.collection('studio__chatMessages').syncTable(
    tableDefinitionFromSchema(studioChatMessageSchema)
  );
}
