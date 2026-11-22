// MCP de Robur DS por URL: función de Vercel con las mismas herramientas que mcp/server.mjs.
// Sin MCP_TOKEN es público. Con MCP_TOKEN exige la cabecera «Authorization: Bearer <token>».
import { timingSafeEqual } from 'node:crypto'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createServer } from '../mcp/tools.mjs'

const MAX_BYTES = 100_000

const unauthorized = () =>
  Response.json({ error: 'Falta el token o no es válido' }, { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } })

function authorized(request) {
  const token = process.env.MCP_TOKEN?.trim()
  if (!token) return true
  // El esquema no distingue mayúsculas y puede ir seguido de varios espacios (RFC 7235).
  const [, given = ''] = /^bearer +(.*)$/i.exec(request.headers.get('authorization') ?? '') ?? []
  const expected = Buffer.from(token)
  const received = Buffer.from(given)
  return received.length === expected.length && timingSafeEqual(received, expected)
}

// Un lote vacío no es JSON-RPC válido; el transporte lo acepta con 202 y no responde nada.
const isEmptyBatch = (body) => {
  try {
    const message = JSON.parse(new TextDecoder().decode(body))
    return Array.isArray(message) && message.length === 0
  } catch {
    return false
  }
}
const invalidRequest = () => Response.json({ jsonrpc: '2.0', error: { code: -32600, message: 'Invalid Request' }, id: null }, { status: 400 })

export async function handle(request) {
  if (!authorized(request)) return unauthorized()
  // Sin sesiones no hay stream que abrir con GET ni sesión que cerrar con DELETE.
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } })
  // Una pantalla son unos pocos KB. Un cuerpo enorme tendría al validador minutos trabajando.
  const body = await request.arrayBuffer()
  if (body.byteLength > MAX_BYTES) return Response.json({ error: 'La petición pasa de 100 KB' }, { status: 413 })
  if (isEmptyBatch(body)) return invalidRequest()
  request = new Request(request.url, { method: 'POST', headers: request.headers, body })
  // Sin estado: cada petición tiene su servidor y su transporte, como pide una función.
  const server = createServer()
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })
  await server.connect(transport)
  try {
    return await transport.handleRequest(request)
  } finally {
    await server.close()
  }
}

export const POST = handle
export const GET = handle
export const DELETE = handle
