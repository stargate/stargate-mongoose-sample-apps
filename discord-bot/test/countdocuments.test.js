'use strict';

const Bot = require('../models/bot');
const assert = require('assert');
const { describe, it } = require('mocha');
const countdocuments = require('../commands/countdocuments');
const sinon = require('sinon');

describe('countdocuments', function() {
  it('returns the number of bot documents', async function() {
    await Bot.deleteMany({});
    await Bot.create({ name: 'test' });

    const interaction = {
      reply: sinon.stub()
    };
    await countdocuments.execute(interaction);
    assert.ok(interaction.reply.calledOnce);
    assert.deepEqual(interaction.reply.getCalls()[0].args, [1]);
  });
});