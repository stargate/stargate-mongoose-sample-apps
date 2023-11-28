'use strict';

const assert = require('assert');
const { describe, it } = require('mocha');
const ping = require('../commands/ping');
const sinon = require('sinon');

describe('ping', function() {
  it('replies with "Pong!"', async function() {
    const interaction = {
      reply: sinon.stub()
    };
    await ping.execute(interaction);
    assert.ok(interaction.reply.calledOnce);
    assert.deepEqual(interaction.reply.getCalls()[0].args, ['Pong!']);
  });
});