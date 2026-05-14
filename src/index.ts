interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * data.gov.au MCP — Australia open-data CKAN catalogue.
 *
 * Auth: none. Docs: https://docs.ckan.org/en/latest/api/
 */


const BASE = 'https://data.gov.au/data/api/3';
const UA = 'pipeworx-mcp-datagov-au/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'search',
    description: 'CKAN package_search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'e.g. "bushfire", "transport".' },
        fq: { type: 'string', description: 'Solr filter, e.g. "organization:abs"' },
        rows: { type: 'number', description: '1-1000 (default 25).' },
        start: { type: 'number', description: '0-based offset.' },
        sort: { type: 'string', description: 'e.g. "metadata_modified desc"' },
      },
      required: ['query'],
    },
  },
  {
    name: 'package',
    description: 'Single package (dataset) by id or name.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
  {
    name: 'organizations',
    description: 'List publishing organizations.',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number', description: '1-1000 (default 100).' } },
    },
  },
  {
    name: 'groups',
    description: 'List themes (groups).',
    inputSchema: {
      type: 'object',
      properties: { limit: { type: 'number' } },
    },
  },
  {
    name: 'tags',
    description: 'List or search tags.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number' },
      },
    },
  },
  {
    name: 'resource',
    description: 'Single resource (downloadable file) by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string' } },
      required: ['id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const params = new URLSearchParams({
        q: reqStr(args, 'query', '"bushfire"'),
        rows: String(Math.min(1000, Math.max(1, (args.rows as number) ?? 25))),
        start: String(Math.max(0, (args.start as number) ?? 0)),
      });
      if (args.fq) params.set('fq', String(args.fq));
      if (args.sort) params.set('sort', String(args.sort));
      return ckanGet(`/action/package_search?${params}`);
    }
    case 'package':
      return ckanGet(`/action/package_show?id=${encodeURIComponent(reqStr(args, 'id', '"my-dataset"'))}`);
    case 'organizations': {
      const params = new URLSearchParams({
        all_fields: 'true',
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 100))),
      });
      return ckanGet(`/action/organization_list?${params}`);
    }
    case 'groups': {
      const params = new URLSearchParams({
        all_fields: 'true',
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 100))),
      });
      return ckanGet(`/action/group_list?${params}`);
    }
    case 'tags': {
      const params = new URLSearchParams({
        all_fields: 'true',
        limit: String(Math.min(1000, Math.max(1, (args.limit as number) ?? 100))),
      });
      if (args.query) params.set('query', String(args.query));
      return ckanGet(`/action/tag_list?${params}`);
    }
    case 'resource':
      return ckanGet(`/action/resource_show?id=${encodeURIComponent(reqStr(args, 'id', '"<resource-uuid>"'))}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function ckanGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 404) throw new Error('data.gov.au: not found');
  if (!res.ok) throw new Error(`data.gov.au: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  const json = (await res.json()) as { success?: boolean; error?: { message?: string }; result?: unknown };
  if (json.success === false) throw new Error(`data.gov.au: ${json.error?.message ?? 'unknown error'}`);
  return json.result ?? json;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  }
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
