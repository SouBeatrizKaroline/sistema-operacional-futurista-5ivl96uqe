import { useState, useRef, useEffect } from 'react'
import { useOS } from '@/hooks/use-os'
import { getTerminalHistory, addTerminalEntry, clearTerminalHistory } from '@/services/terminal'
import { sendNexusMessage } from '@/services/nexus'

interface Line {
  cmd?: string
  output?: string
}

export function TerminalApp() {
  const { openApp, changeTheme } = useOS()
  const [history, setHistory] = useState<Line[]>([])
  const [inputVal, setInputVal] = useState('')
  const [cmdIndex, setCmdIndex] = useState<number>(-1)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getTerminalHistory().then((res) => {
      if (res.length > 0) {
        setHistory(res.map((item) => ({ cmd: item.command, output: item.output })))
      } else {
        setHistory([
          { output: 'NEXUS OS v4.2 Terminal [Kernel v4.2.0-quantico]' },
          { output: "Digite 'help' para listar todos os comandos disponíveis.\n" },
        ])
      }
    })
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault()
    const command = inputVal.trim()
    if (!command) return

    setInputVal('')
    setCmdIndex(-1)

    let output = ''

    const parts = command.split(' ')
    const mainCmd = parts[0].toLowerCase()
    const arg = parts.slice(1).join(' ')

    switch (mainCmd) {
      case 'help':
        output =
          'Comandos Disponíveis:\n' +
          '  help             - Exibe esta mensagem de ajuda\n' +
          '  clear            - Limpa o histórico do terminal\n' +
          '  ls / pwd / cd    - Comandos de navegação de arquivos\n' +
          '  neofetch         - Exibe informações do sistema NEXUS OS\n' +
          '  open <app>       - Abre aplicativo (terminal, files, music, email, calendar, dashboard, settings, nexus)\n' +
          '  theme <nome>     - Troca o tema (neon-cyan, aurora-purple, matrix-green, solaris-amber, crimson, mono)\n' +
          '  nexus <pergunta> - Pergunta diretamente à IA NEXUS\n' +
          '  whoami / quem-sou- Exibe o operador atual\n' +
          '  date / data      - Exibe a data e hora atual'
        break
      case 'clear':
        setHistory([])
        await clearTerminalHistory()
        return
      case 'ls':
        output = 'Documentos/  Projetos/  boas-vindas.txt  core-kernel.ts'
        break
      case 'pwd':
        output = '/home/nexus/operador'
        break
      case 'neofetch':
        output =
          '  /  NEXUS OS v4.2 (x86_64 Quantico)\n' +
          ' /   OS: NEXUS OS Holographic\n' +
          '/____ Kernel: 4.2.0-holo-quantico\n' +
          '       Uptime: 12 horas, 48 mins\n' +
          '       IA Engine: NEXUS Neural Agent v4.5\n' +
          '       Memoria: 8.4 GiB / 32 GiB'
        break
      case 'open':
        if (arg) {
          openApp(arg as any)
          output = `Abrindo ${arg}...`
        } else {
          output = 'Uso: open <nome_do_app>'
        }
        break
      case 'theme':
        if (arg) {
          changeTheme(arg as any)
          output = `Tema alterado para: ${arg}`
        } else {
          output = 'Uso: theme <neon-cyan|aurora-purple|matrix-green|solaris-amber|crimson|mono>'
        }
        break
      case 'nexus':
        if (arg) {
          output = 'Processando resposta do NEXUS...'
          setHistory((prev) => [...prev, { cmd: command, output }])
          try {
            const res = await sendNexusMessage(arg)
            output = res.content
          } catch (err: any) {
            output = 'Erro ao se comunicar com o assistente NEXUS.'
          }
          await addTerminalEntry({ command, output })
          setHistory((prev) => [...prev.slice(0, -1), { cmd: command, output }])
          return
        } else {
          output = 'Uso: nexus <sua_pergunta>'
        }
        break
      case 'whoami':
      case 'quem-sou':
        output = 'nexus@operador-principal [Acesso Nível 5]'
        break
      case 'date':
      case 'data':
        output = new Date().toLocaleString('pt-BR')
        break
      case 'sudo':
        output = 'Acesso Negado: Esta ação foi registrada nos logs do núcleo quantico.'
        break
      default:
        output = `Comando não reconhecido: '${mainCmd}'. Digite 'help' para comandos.`
        break
    }

    setHistory((prev) => [...prev, { cmd: command, output }])
    await addTerminalEntry({ command, output })
  }

  return (
    <div className="h-full flex flex-col font-mono text-xs text-primary bg-black/80 p-3 rounded-lg overflow-hidden border border-primary/20">
      <div className="flex-1 overflow-y-auto space-y-2 leading-relaxed">
        {history.map((item, idx) => (
          <div key={idx}>
            {item.cmd && (
              <div className="flex items-center space-x-2 text-foreground font-semibold">
                <span className="text-secondary">nexus@os:~$</span>
                <span>{item.cmd}</span>
              </div>
            )}
            {item.output && (
              <pre className="whitespace-pre-wrap text-primary/90 mt-0.5">{item.output}</pre>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleCommand}
        className="mt-2 flex items-center space-x-2 border-t border-primary/20 pt-2"
      >
        <span className="text-secondary font-bold">nexus@os:~$</span>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-foreground focus:outline-none font-mono"
        />
      </form>
    </div>
  )
}
