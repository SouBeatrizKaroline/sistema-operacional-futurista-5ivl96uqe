import pb from '@/lib/pocketbase/client'

export interface FileItem {
  id: string
  name: string
  type: 'pasta' | 'texto' | 'codigo' | 'imagem' | 'audio' | 'video' | 'documento'
  parent?: string
  content?: string
  owner: string
  created: string
  updated: string
}

export const getFiles = () => pb.collection('files').getFullList<FileItem>({ sort: '-created' })
export const createFile = (data: Partial<FileItem>) => pb.collection('files').create<FileItem>(data)
export const updateFile = (id: string, data: Partial<FileItem>) =>
  pb.collection('files').update<FileItem>(id, data)
export const deleteFile = (id: string) => pb.collection('files').delete(id)
