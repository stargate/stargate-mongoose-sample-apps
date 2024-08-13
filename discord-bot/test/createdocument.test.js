'use strict';

const Bot = require('../models/bot');
const assert = require('assert');
const { describe, it } = require('mocha');
const createdocument = require('../commands/createdocument');
const sinon = require('sinon');

describe('createdocument', function() {
  it('inserts a new document', async function() {
    for (const doc of await Bot.find({ deleted: 0 })) {
      await Bot.updateOne({ id: doc.id }, { deleted: 1 });
    }

    const interaction = {
      reply: sinon.stub()
    };
    await createdocument.execute(interaction);
    assert.ok(interaction.reply.calledOnce);
    assert.deepEqual(interaction.reply.getCalls()[0].args, ['done!']);

    const docs = await Bot.find({ deleted: 0 });
    assert.equal(docs.length, 1);
    assert.equal(docs[0].name, 'I am a document');
  });
});