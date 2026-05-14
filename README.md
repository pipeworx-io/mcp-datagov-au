# mcp-datagov-au

Australia data.gov.au open-data catalogue (CKAN)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 250+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search` | CKAN package_search. |
| `package` | Single package (dataset) by id or name. |
| `organizations` | List publishing organizations. |
| `groups` | List themes (groups). |
| `tags` | List or search tags. |
| `resource` | Single resource (downloadable file) by id. |

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

Or connect to the full Pipeworx gateway for access to all 250+ data sources:

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

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
