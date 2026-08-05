import pb from '@/lib/pocketbase/client'

export const sendNexusMessage = async (message: string, conversationId?: string | null) => {
  return pb.send<{
    conversation_id: string
    content: string
    citations?: any[]
    message_id: string
  }>('/backend/v1/nexus/chat', {
    method: 'POST',
    body: JSON.stringify({ message, conversation_id: conversationId }),
    headers: { 'Content-Type': 'application/json' },
  })
}
