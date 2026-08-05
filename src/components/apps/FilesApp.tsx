import { useState, useEffect } from 'react'
import { getFiles, FileItem, createFile, deleteFile } from '@/services/files'
import { Folder, FileText, Code, Image as ImageIcon, Plus, Trash2, ArrowLeft } from 'lucide-react'

export function FilesApp() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentParent, setCurrentParent] = useState<string | undefined>(undefined)
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileNameType] = useState<FileItem['type']>('texto')

  const loadFiles = async () => {
    const list = await getFiles()
    setFiles(list)
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const visibleFiles = files.filter((f) => (currentParent ? f.parent === currentParent : !f.parent))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return
    await createFile({
      name: newFileName,
      type: newFileType,
      parent: currentParent,
      content: newFileType === 'texto' ? 'Novo arquivo de texto...' : '',
    })
    setNewFileName('')
    loadFiles()
  }

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteFile(id)
    if (selectedFile?.id === id) setSelectedFile(null)
    loadFiles()
  }

  const getIcon = (type: FileItem['type']) => {
    switch (type) {
      case 'pasta':
        return <Folder className="w-8 h-8 text-amber-400" />
      case 'codigo':
        return <Code className="w-8 h-8 text-secondary" />
      case 'imagem':
        return <ImageIcon className="w-8 h-8 text-emerald-400" />
      default:
        return <FileText className="w-8 h-8 text-primary" />
    }
  }

  return (
    <div className="h-full flex flex-col sm:flex-row gap-4 font-mono text-xs">
      {/* Sidebar & Navigation */}
      <div className="w-full sm:w-64 glass-panel p-3 rounded-lg border border-primary/20 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-primary/20">
          <span className="font-bold text-primary">ARQUIVOS</span>
          {currentParent && (
            <button
              onClick={() => setCurrentParent(undefined)}
              className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          )}
        </div>

        {/* Quick Create */}
        <form onSubmit={handleCreate} className="space-y-2">
          <input
            type="text"
            placeholder="Nome do arquivo..."
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="w-full bg-background/50 border border-primary/20 px-2 py-1.5 rounded text-foreground focus:outline-none focus:border-primary"
          />
          <div className="flex space-x-2">
            <select
              value={newFileType}
              onChange={(e) => setNewFileNameType(e.target.value as any)}
              className="bg-background/50 border border-primary/20 px-2 py-1 rounded text-foreground focus:outline-none"
            >
              <option value="texto">Texto</option>
              <option value="pasta">Pasta</option>
              <option value="codigo">Código</option>
            </select>
            <button
              type="submit"
              className="flex-1 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary py-1 rounded flex items-center justify-center cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Criar
            </button>
          </div>
        </form>
      </div>

      {/* Main Files Grid */}
      <div className="flex-1 glass-panel p-4 rounded-lg border border-primary/20 flex flex-col overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 overflow-y-auto flex-1 p-1">
          {visibleFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => {
                if (file.type === 'pasta') setCurrentParent(file.id)
                else setSelectedFile(file)
              }}
              className={`group relative p-3 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 ${
                selectedFile?.id === file.id
                  ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-background/30 border-primary/10 hover:border-primary/40 hover:bg-primary/10'
              }`}
            >
              {getIcon(file.type)}
              <span className="text-foreground text-center line-clamp-1 w-full font-medium">
                {file.name}
              </span>
              <button
                onClick={(e) => handleDelete(file.id, e)}
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* File Viewer Pane */}
        {selectedFile && (
          <div className="mt-4 pt-3 border-t border-primary/20 flex flex-col h-40">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-primary">{selectedFile.name}</span>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Fechar
              </button>
            </div>
            <pre className="flex-1 bg-black/60 p-2 rounded border border-primary/20 text-foreground overflow-auto text-[11px]">
              {selectedFile.content || 'Nenhum conteúdo.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
