'use strict';

const Bot = require('../models/bot');
const assert = require('assert');
const { describe, it } = require('mocha');
const createdocument = require('../commands/createdocument');
const sinon = require('sinon');

describe('createdocument', function() {
  it('inserts a new document', async function() {
    //await Bot.deleteMany({});

    const interaction = {
      reply: sinon.stub()
    };
    await createdocument.execute(interaction);
    assert.ok(interaction.reply.calledOnce);
    assert.deepEqual(interaction.reply.getCalls()[0].args, ['done!']);

    const docs = await Bot.find();
    assert.equal(docs.length, 1);
    assert.equal(docs[0].name, 'I am a document');
  });
});