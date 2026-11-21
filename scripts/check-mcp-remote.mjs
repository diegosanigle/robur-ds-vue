// Comprueba el MCP por URL sin desplegarlo: llama a la función de api/mcp.mjs como lo haría Vercel.
// Mira que responda igual que el MCP local y que, con MCP_TOKEN, rechace a quien no traiga el token.
// Uso: node scripts/check-mcp-remote.mjs
import { join } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import { handle } from '../api/mcp.mjs'
import { root } from './lib/tokens.mjs'

const URL_MCP = 'http://robur.local/mcp'
const TOKEN = 'secreto-de-prueba'
const errors = []
const expect = (label, ok) => ok || errors.push(label)

// Lo mismo que se pregunta en check-mcp.mjs: si el remoto responde igual, es el mismo MCP.
const calls = [
  ['get_catalog', {}],
  ['get_component', { name: 'Button' }],
  ['get_tokens', { group: 'bg' }],
  ['get_text_on', { background: 'bg-action' }],
  ['validate_code', { code: '<div class="bg-red-500 p-[13px]"><button>¡Enviar!</button><Button variant="ghost">Ok</Button><Badge /></div>' }],
]

const connect = async (transport) => {
  const client = new Client({ name: 'check-mcp-remote', version: '1.0.0' })
  await client.connect(transport)
  return client
}
const remote = (headers = {}) =>
  connect(new StreamableHTTPClientTransport(new URL(URL_MCP), { fetch: (url, init) => handle(new Request(url, init)), requestInit: { headers } }))
const answers = async (client) => Promise.all(calls.map(async ([name, args]) => (await client.callTool({ name, arguments: args })).content[0].text))

const post = (body, headers = {}) =>
  handle(new Request(URL_MCP, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...headers }, body }))
const initialize = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'check', version: '1' } } })

// Forma pública: sin MCP_TOKEN.
delete process.env.MCP_TOKEN
const local = await connect(new StdioClientTransport({ command: 'node', args: [join(root, 'mcp', 'server.mjs')] }))
const expected = await answers(local)
await local.close()

const open = await remote()
expect('por URL hay cinco herramientas', (await open.listTools()).tools.length === 5)
const got = await answers(open)
calls.forEach(([name], i) => expect(`${name} responde igual por URL que en local`, got[i] === expected[i]))
await open.close()

const notJson = await post('no es json')
expect(`un cuerpo que no es JSON da un 4xx (da ${notJson.status})`, notJson.status >= 400 && notJson.status < 500)
const get = await Promise.race([handle(new Request(URL_MCP, { method: 'GET', headers: { accept: 'text/event-stream' } })), new Promise((r) => setTimeout(() => r({ status: 'colgado' }), 2000))])
expect(`un GET sin sesión da un 4xx (da ${get.status})`, get.status >= 400 && get.status < 500)
// Un cuerpo enorme haría trabajar al validador durante minutos: se rechaza antes de leerlo.
const huge = JSON.stringify({ jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'validate_code', arguments: { code: 'import { '.repeat(20_000) } } })
const tooBig = await post(huge)
expect(`un cuerpo de más de 100 KB da 413 (da ${tooBig.status})`, tooBig.status === 413)
const del = await handle(new Request(URL_MCP, { method: 'DELETE' }))
expect(`un DELETE da un 4xx (da ${del.status})`, del.status >= 400 && del.status < 500)

// Una variable vacía o con espacios no cierra el MCP.
process.env.MCP_TOKEN = '   '
const blank = await remote()
expect('con MCP_TOKEN en blanco sigue siendo público', (await blank.listTools()).tools.length === 5)
await blank.close()

// Forma privada: con MCP_TOKEN.
process.env.MCP_TOKEN = TOKEN
const denied = await post(initialize)
expect(`sin cabecera da 401 (da ${denied.status})`, denied.status === 401)
expect('el 401 lleva WWW-Authenticate: Bearer', denied.headers.get('www-authenticate') === 'Bearer')
for (const value of ['Bearer otro', `Basic ${TOKEN}`, 'Bearer ', `Bearer ${TOKEN}x`]) {
  expect(`«Authorization: ${value}» da 401`, (await post(initialize, { authorization: value })).status === 401)
}
const allowed = await remote({ authorization: `Bearer ${TOKEN}` })
expect('con el token bueno hay cinco herramientas', (await allowed.listTools()).tools.length === 5)
await allowed.close()
delete process.env.MCP_TOKEN

if (errors.length) {
  console.error(`MCP remoto: ${errors.length} fallos\n${errors.map((e) => `  ✗ ${e}`).join('\n')}`)
  process.exit(1)
}
console.log('MCP remoto: forma pública y privada responden como se espera.')
