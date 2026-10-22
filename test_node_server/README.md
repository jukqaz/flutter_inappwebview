# Local integration server

Use a patched Node.js release (24.22.1 or later in the 24.x line), then run
`npm ci` and `node index.js` from this directory. Dependencies are locked;
Node's built-in HTTPS implementation needs no npm `https` package.

All four listeners bind to `127.0.0.1` by default. For a physical-device test
on a trusted, isolated network, explicitly select the local interface using
`INAPPWEBVIEW_TEST_HOST`. Never expose this fixture server to the Internet:
the client-certificate error cases, sample credentials and proxy are designed
for integration tests, not production authentication.
