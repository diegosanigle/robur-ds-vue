#!/usr/bin/env node
// MCP de Robur DS: lleva el Design System a cualquier agente, en cualquier proyecto.
// Solo lee mcp/data.json, que se genera con `npm run mcp:data`.
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './tools.mjs'

await createServer().connect(new StdioServerTransport())
