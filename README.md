# @pipeworx/datagov-au

[data.gov.au](https://data.gov.au) MCP — Australia's national open-data catalogue (CKAN). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, fq?, rows?, start?, sort?)` — CKAN package_search
- `package(id)` — package_show by id or name
- `organizations(limit?)` — list publishing organizations
- `groups(limit?)` — list themes/groups
- `tags(limit?, query?)` — list/search tags
- `resource(id)` — single resource (file) by id

## Data source

`https://data.gov.au/data/api/3/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "datagov-au": {
      "url": "https://gateway.pipeworx.io/datagov-au/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Datagov Au data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
