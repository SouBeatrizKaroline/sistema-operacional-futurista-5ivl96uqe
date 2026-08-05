migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    let userRec

    try {
      userRec = app.findAuthRecordByEmail('_pb_users_auth_', '1aspiraqualquer@gmail.com')
    } catch (_) {
      userRec = new Record(users)
      userRec.setEmail('1aspiraqualquer@gmail.com')
      userRec.setPassword('Skip@Pass')
      userRec.setVerified(true)
      userRec.set('name', 'Operador NEXUS')
      app.save(userRec)
    }

    const userId = userRec.id

    // 1. Files Seed
    const filesCol = app.findCollectionByNameOrId('files')
    try {
      app.findFirstRecordByData('files', 'owner', userId)
    } catch (_) {
      const docsFolder = new Record(filesCol)
      docsFolder.set('name', 'Documentos')
      docsFolder.set('type', 'pasta')
      docsFolder.set('owner', userId)
      app.save(docsFolder)

      const projectsFolder = new Record(filesCol)
      projectsFolder.set('name', 'Projetos')
      projectsFolder.set('type', 'pasta')
      projectsFolder.set('owner', userId)
      app.save(projectsFolder)

      const welcomeFile = new Record(filesCol)
      welcomeFile.set('name', 'boas-vindas.txt')
      welcomeFile.set('type', 'texto')
      welcomeFile.set('parent', docsFolder.id)
      welcomeFile.set(
        'content',
        'Bem-vindo ao NEXUS OS v4.2.\nSistema Operacional Holográfico totalmente funcional.\n\nUse o Terminal para explorar os comandos disponíveis.',
      )
      welcomeFile.set('owner', userId)
      app.save(welcomeFile)

      const codeFile = new Record(filesCol)
      codeFile.set('name', 'core-kernel.ts')
      codeFile.set('type', 'codigo')
      codeFile.set('parent', projectsFolder.id)
      codeFile.set(
        'content',
        "// NEXUS Quantum Core Initialization\nexport function initCore() {\n  console.log('NEXUS Neural Network Active');\n  return { status: 'ONLINE', latency: '0.4ms' };\n}",
      )
      codeFile.set('owner', userId)
      app.save(codeFile)
    }

    // 2. Calendar Seed
    const calCol = app.findCollectionByNameOrId('calendar_events')
    try {
      app.findFirstRecordByData('calendar_events', 'owner', userId)
    } catch (_) {
      const now = new Date()
      const isoDate = (days, hours) => {
        const d = new Date(now.getTime() + days * 86400000)
        d.setHours(hours, 0, 0, 0)
        return d.toISOString()
      }

      const ev1 = new Record(calCol)
      ev1.set('title', 'Reunião de Alinhamento Quantico')
      ev1.set('description', 'Revisão dos módulos do sistema com a equipe de engenharia')
      ev1.set('start', isoDate(0, 14))
      ev1.set('end', isoDate(0, 15))
      ev1.set('category', 'trabalho')
      ev1.set('color', '#00E5FF')
      ev1.set('owner', userId)
      app.save(ev1)

      const ev2 = new Record(calCol)
      ev2.set('title', 'Manutenção de Módulos de IA')
      ev2.set('description', 'Otimização de embeddings e cache da assistente NEXUS')
      ev2.set('start', isoDate(1, 10))
      ev2.set('end', isoDate(1, 11))
      ev2.set('category', 'trabalho')
      ev2.set('color', '#A855F7')
      ev2.set('owner', userId)
      app.save(ev2)

      const ev3 = new Record(calCol)
      ev3.set('title', 'Check-up Médico Holo-Scan')
      ev3.set('description', 'Exame biométrico anual preventivo')
      ev3.set('start', isoDate(2, 9))
      ev3.set('category', 'saude')
      ev3.set('color', '#22D3A5')
      ev3.set('owner', userId)
      app.save(ev3)
    }

    // 3. Emails Seed
    const emailCol = app.findCollectionByNameOrId('emails')
    try {
      app.findFirstRecordByData('emails', 'owner', userId)
    } catch (_) {
      const em1 = new Record(emailCol)
      em1.set('from_name', 'NEXUS Security')
      em1.set('from_email', 'security@nexus.os')
      em1.set('subject', 'Alerta de Segurança: Login Detectado')
      em1.set(
        'body',
        'Um novo terminal confiável iniciou sessão no nó principal. Se foi você, nenhuma ação é necessária.',
      )
      em1.set('is_read', false)
      em1.set('is_flagged', true)
      em1.set('folder', 'inbox')
      em1.set('owner', userId)
      app.save(em1)

      const em2 = new Record(emailCol)
      em2.set('from_name', 'RH Futuro')
      em2.set('from_email', 'rh@empresa.futuro')
      em2.set('subject', 'Atualização do Relatório Semestral')
      em2.set(
        'body',
        'Olá Operador, favor revisar os parâmetros de desempenho do assistente NEXUS anexados no drive.',
      )
      em2.set('is_read', true)
      em2.set('is_flagged', false)
      em2.set('folder', 'inbox')
      em2.set('owner', userId)
      app.save(em2)

      const em3 = new Record(emailCol)
      em3.set('from_name', 'Notícias Holo')
      em3.set('from_email', 'news@holonet.io')
      em3.set('subject', 'Destaques da Semana: Avanços em Computação Neuronal')
      em3.set(
        'body',
        'Confira as últimas novidades sobre arquiteturas de rede de 128 qubits e IA autonômica.',
      )
      em3.set('is_read', false)
      em3.set('is_flagged', false)
      em3.set('folder', 'inbox')
      em3.set('owner', userId)
      app.save(em3)
    }

    // 4. Notifications Seed
    const notifCol = app.findCollectionByNameOrId('notifications')
    try {
      app.findFirstRecordByData('notifications', 'owner', userId)
    } catch (_) {
      const n1 = new Record(notifCol)
      n1.set('title', 'Sincronização Concluída')
      n1.set('message', 'Sua agenda foi sincronizada com a nuvem quantica.')
      n1.set('type', 'sucesso')
      n1.set('is_read', false)
      n1.set('owner', userId)
      app.save(n1)

      const n2 = new Record(notifCol)
      n2.set('title', 'NEXUS IA Atualizado')
      n2.set('message', 'Módulo de síntese de linguagem atualizado para v4.5.')
      n2.set('type', 'info')
      n2.set('is_read', false)
      n2.set('owner', userId)
      app.save(n2)
    }

    // 5. Music Seed
    const musicCol = app.findCollectionByNameOrId('music_library')
    try {
      app.findFirstRecordByData('music_library', 'owner', userId)
    } catch (_) {
      const songs = [
        {
          title: 'Cybernetic Horizon',
          artist: 'Neon Drive',
          album: 'Synth City 2099',
          duration: 215,
          genre: 'synthwave',
          is_favorite: true,
        },
        {
          title: 'Quantum Dreams',
          artist: 'Holo Sound',
          album: 'Deep Space',
          duration: 184,
          genre: 'lo-fi',
          is_favorite: true,
        },
        {
          title: 'Digital Odyssey',
          artist: 'Byte Pulse',
          album: 'Neural Networks',
          duration: 240,
          genre: 'eletronica',
          is_favorite: false,
        },
        {
          title: 'Solar Wind',
          artist: 'Atmosphere X',
          album: 'Cosmic Drift',
          duration: 310,
          genre: 'ambient',
          is_favorite: false,
        },
      ]
      for (const s of songs) {
        const m = new Record(musicCol)
        m.set('title', s.title)
        m.set('artist', s.artist)
        m.set('album', s.album)
        m.set('duration', s.duration)
        m.set('genre', s.genre)
        m.set('is_favorite', s.is_favorite)
        m.set('owner', userId)
        app.save(m)
      }
    }

    // 6. User Settings Seed
    const settingsCol = app.findCollectionByNameOrId('user_settings')
    try {
      app.findFirstRecordByData('user_settings', 'owner', userId)
    } catch (_) {
      const st = new Record(settingsCol)
      st.set('theme', 'neon-cyan')
      st.set('wallpaper', 'holo-grid')
      st.set('accent', '#00E5FF')
      st.set('clock_format', '24h')
      st.set('weather_city', 'São Paulo')
      st.set('terminal_greeting', 'Bem-vindo ao NEXUS OS. Todos os sistemas operacionais.')
      st.set('notif_sound', true)
      st.set('owner', userId)
      app.save(st)
    }

    // 7. Widgets Seed
    const widgetCol = app.findCollectionByNameOrId('widgets')
    try {
      app.findFirstRecordByData('widgets', 'owner', userId)
    } catch (_) {
      const wTypes = ['relogio', 'clima', 'agenda', 'musica', 'sistema', 'notas']
      wTypes.forEach((wt, idx) => {
        const w = new Record(widgetCol)
        w.set('widget_type', wt)
        w.set('position', idx + 1)
        w.set('is_visible', true)
        w.set(
          'settings',
          JSON.stringify({
            noteText: wt === 'notas' ? 'Lembrete: Atualizar módulos do sistema às 18:00' : '',
          }),
        )
        w.set('owner', userId)
        app.save(w)
      })
    }
  },
  (app) => {
    // Tear down seeds if needed
  },
)
