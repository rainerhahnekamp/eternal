# Pangular Inspector experiment

Branch: `experiment/pangular-inspector`, rebased onto `origin/main` commit `cb46f317`.
Installed package: `@pangular-inspector/devtools` 0.0.7.

Run in two terminals from this folder:

```sh
pnpm inspector
pnpm start:inspector
```

Open http://localhost:4210 and click the Pangular Inspector button.
Standalone panel: http://localhost:9999/ .
MCP HTTP endpoint: http://localhost:9999/__mcp .
For a stdio MCP client, use command `pnpm`, arguments `["exec", "pangular", "mcp"]`, with this folder as its working directory. The agent client has not been registered globally.

The overlay loads after Angular bootstrap in development only. The proxy forwards `/__pangular/**` to port 9999, including WebSockets.

Verified: development build passes; Angular app starts; inspector server starts; embedded inspector renders. In the Codex in-app browser, the panel remains on CONNECTING and live data is unavailable. Live inspection therefore still needs verification/debugging in Chrome. No Chrome extension was installed.

The latest upstream documentation includes `--proxy-origin`, which the published 0.0.7 CLI does not accept; this setup omits it.
