import pb from '@/lib/pocketbase/client'

export interface TerminalEntry {
  id: string
  command?: string
  output?: string
  owner: string
  created: string
  updated: string
}

export const getTerminalHistory = () =>
  pb.collection('terminal_history').getFullList<TerminalEntry>({ sort: 'created' })
export const addTerminalEntry = (data: Partial<TerminalEntry>) =>
  pb.collection('terminal_history').create<TerminalEntry>(data)
export const clearTerminalHistory = async () => {
  const list = await getTerminalHistory()
  await Promise.all(list.map((item) => pb.collection('terminal_history').delete(item.id)))
}
