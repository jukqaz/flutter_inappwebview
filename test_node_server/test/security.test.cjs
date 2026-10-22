const assert = require('node:assert/strict');
const { once } = require('node:events');
const { test } = require('node:test');

test('fixture listeners stay local and preserve HTTP and basic authentication', { timeout: 10000 }, async () => {
  assert.equal(process.env.INAPPWEBVIEW_TEST_HOST, undefined,
    'run the default-binding test without a host override');
  const servers = require('../index.js');
  try {
    await Promise.all(servers.map((server) => server.listening ? undefined : once(server, 'listening')));
    for (const server of servers) {
      assert.equal(server.address().address, '127.0.0.1');
    }
    const normal = await fetch('http://127.0.0.1:8082/');
    assert.equal(normal.status, 200);
    assert.match(await normal.text(), /HELLO/);

    const denied = await fetch('http://127.0.0.1:8081/');
    assert.equal(denied.status, 401);
    assert.match(denied.headers.get('www-authenticate'), /^Basic /);
    await denied.text();

    const accepted = await fetch('http://127.0.0.1:8081/', {
      headers: { authorization: `Basic ${Buffer.from('USERNAME:PASSWORD').toString('base64')}` },
    });
    assert.equal(accepted.status, 200);
    assert.match(await accepted.text(), /Authorized/);
  } finally {
    await Promise.all(servers.map((server) => new Promise((resolve) => {
      server.close(resolve);
      server.closeAllConnections?.();
    })));
  }
});
