import pb from '@/lib/pocketbase/client'

export interface EmailItem {
  id: string
  from_name?: string
  from_email?: string
  subject?: string
  body?: string
  is_read?: boolean
  is_flagged?: boolean
  folder: 'inbox' | 'enviados' | 'rascunhos' | 'lixeira'
  owner: string
  created: string
  updated: string
}

export const getEmails = () => pb.collection('emails').getFullList<EmailItem>({ sort: '-created' })
export const createEmail = (data: Partial<EmailItem>) =>
  pb.collection('emails').create<EmailItem>(data)
export const updateEmail = (id: string, data: Partial<EmailItem>) =>
  pb.collection('emails').update<EmailItem>(id, data)
export const deleteEmail = (id: string) => pb.collection('emails').delete(id)
