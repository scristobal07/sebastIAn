import type { Config, Context } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { message, history } = await req.json()

  const messages = [
    ...(history || []),
    { role: 'user' as const, content: message }
  ]

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: 'Eres SebastIAn, un asistente virtual inteligente especializado en soluciones digitales: automatización con IA, desarrollo web, análisis en Excel e investigación. Responde siempre en español de manera clara, amigable y profesional. Ayuda a los usuarios a entender los servicios y a resolver sus dudas. Sé conciso pero completo.',
    messages,
  })

  return Response.json({
    reply: response.content[0].type === 'text' ? response.content[0].text : '',
  })
}

export const config: Config = {
  path: '/api/chat',
  method: 'POST',
}
