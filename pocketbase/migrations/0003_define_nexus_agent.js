migrate(
  (app) => {
    $ai.agents.define(app, {
      slug: 'nexus',
      name: 'NEXUS',
      description:
        'Assistente de Inteligência Artificial Integrado do Sistema Operacional Futurista',
      systemPrompt:
        "Você é o NEXUS, o assistente de IA integrado ao sistema operacional futurista. Responda em português brasileiro, de forma concisa, amigável e com um toque futurista. Ajude o usuário a consultar arquivos, agenda, e-mails, notificações e músicas, e a criar notas e eventos. Quando usar dados do usuário, cite a origem (ex.: 'Agenda: Reunião de equipe — 14:00'). Recuse educadamente pedidos fora do escopo do sistema.",
      tier: 'fast',
      tools: [
        { collection: 'files', perms: { list: true, read: true } },
        { collection: 'calendar_events', perms: { list: true, read: true, create: true } },
        { collection: 'emails', perms: { list: true, read: true } },
        { collection: 'notifications', perms: { list: true, read: true } },
        { collection: 'music_library', perms: { list: true, read: true } },
        { collection: 'user_settings', perms: { list: true, read: true } },
      ],
      memory: [
        {
          type: 'faq',
          payload: {
            qa: [
              {
                question: 'Como usar o terminal?',
                answer:
                  "Abra o aplicativo Terminal no dock ou na área de trabalho. Digite 'help' para ver comandos como 'ls', 'neofetch', 'theme', 'nexus' e muito mais.",
              },
              {
                question: 'Como alterar o tema do sistema?',
                answer:
                  "Acesse as Configurações no dock ou utilize o comando 'theme <nome>' no Terminal. Opções: neon-cyan, aurora-purple, matrix-green, solaris-amber, crimson e mono.",
              },
              {
                question: 'Como criar eventos na agenda?',
                answer:
                  "Abra o app Agenda e clique em 'Novo Evento' ou peça para o NEXUS criar via chat informando o título e horário.",
              },
              {
                question: 'Como verificar meus e-mails?',
                answer:
                  'Abra o aplicativo Email no dock para gerenciar mensagens, sinalizar e-mails e ler recados.',
              },
            ],
          },
        },
      ],
    })
  },
  (app) => {
    try {
      $ai.agents.delete(app, 'nexus')
    } catch (_) {}
  },
)
