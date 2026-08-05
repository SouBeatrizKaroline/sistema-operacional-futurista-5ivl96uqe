routerAdd(
  'POST',
  '/backend/v1/nexus/chat',
  (e) => {
    try {
      const body = e.requestInfo().body || {}
      const userId = e.auth?.id
      if (!userId) return e.unauthorizedError('Autenticação necessária')
      if (!body.message || !body.message.trim()) return e.badRequestError('Mensagem é obrigatória')

      if (body.stream) {
        const conv = $ai.agent('nexus').getOrCreateConversation({
          user_id: userId,
          id: body.conversation_id || null,
        })
        const iter = $ai.agent('nexus').chat({
          user_id: userId,
          conversation_id: conv.id,
          message: body.message,
          stream: true,
        })
        e.response.header().set('Content-Type', 'text/event-stream')
        e.response.header().set('Cache-Control', 'no-cache')
        e.response.header().set('X-Conversation-Id', conv.id)
        return $response.stream(e, iter)
      }

      const result = $ai.agent('nexus').chat({
        user_id: userId,
        conversation_id: body.conversation_id || null,
        message: body.message,
      })

      return e.json(200, {
        conversation_id: result.conversation_id,
        content: result.content,
        citations: result.citations,
        message_id: result.message_id,
      })
    } catch (err) {
      if (err instanceof SkipAiConfigError)
        return e.json(503, { error: 'Serviço NEXUS indisponível no momento' })
      if (err instanceof SkipAiAgentsError) {
        const status = err.status || 500
        return e.json(status, { error: status >= 500 ? 'Falha no agente NEXUS' : err.message })
      }
      if (err instanceof SkipAiError) {
        const status = err.status || 502
        return e.json(status, { error: status >= 500 ? 'Serviço NEXUS indisponível' : err.message })
      }
      throw err
    }
  },
  $apis.requireAuth(),
)
