import type { Config, Context } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export default async (req: Request, context: Context) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const { problema, materia } = await req.json()

  const systemPrompt = `Eres un tutor académico experto. Resuelves ejercicios de forma pedagógica, explicando cada paso con detalle para que el estudiante comprenda el proceso completo.

Formato de respuesta:
1. Analiza brevemente el problema
2. Identifica el concepto o fórmula necesaria
3. Resuelve paso a paso numerando cada etapa
4. Da la respuesta final claramente
5. Añade un tip o concepto clave para recordar

Materia actual: ${materia || 'General'}
Responde siempre en español. Usa notación clara y accesible.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: problema }],
  })

  return Response.json({
    solucion: response.content[0].type === 'text' ? response.content[0].text : '',
  })
}

export const config: Config = {
  path: '/api/resolver',
  method: 'POST',
}
