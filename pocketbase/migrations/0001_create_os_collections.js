migrate(
  (app) => {
    const usersId = '_pb_users_auth_'

    // 1. Files
    const files = new Collection({
      name: 'files',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['pasta', 'texto', 'codigo', 'imagem', 'audio', 'video', 'documento'],
          maxSelect: 1,
        },
        { name: 'content', type: 'text' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_files_owner ON files (owner)'],
    })
    app.save(files)

    // Add self-relation parent for files
    files.fields.add(
      new RelationField({
        name: 'parent',
        collectionId: files.id,
        maxSelect: 1,
        cascadeDelete: false,
      }),
    )
    files.indexes.push('CREATE INDEX idx_files_parent ON files (parent)')
    app.save(files)

    // 2. Calendar Events
    const calendarEvents = new Collection({
      name: 'calendar_events',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'start', type: 'date', required: true },
        { name: 'end', type: 'date' },
        { name: 'all_day', type: 'bool' },
        {
          name: 'category',
          type: 'select',
          required: true,
          values: ['trabalho', 'pessoal', 'social', 'saude', 'lembrete'],
          maxSelect: 1,
        },
        { name: 'color', type: 'text' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_calendar_owner ON calendar_events (owner)'],
    })
    app.save(calendarEvents)

    // 3. Emails
    const emails = new Collection({
      name: 'emails',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'from_name', type: 'text' },
        { name: 'from_email', type: 'text' },
        { name: 'subject', type: 'text' },
        { name: 'body', type: 'text' },
        { name: 'is_read', type: 'bool' },
        { name: 'is_flagged', type: 'bool' },
        {
          name: 'folder',
          type: 'select',
          required: true,
          values: ['inbox', 'enviados', 'rascunhos', 'lixeira'],
          maxSelect: 1,
        },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_emails_owner ON emails (owner)'],
    })
    app.save(emails)

    // 4. Notifications
    const notifications = new Collection({
      name: 'notifications',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'message', type: 'text' },
        {
          name: 'type',
          type: 'select',
          required: true,
          values: ['info', 'sucesso', 'aviso', 'alerta', 'email', 'musica'],
          maxSelect: 1,
        },
        { name: 'is_read', type: 'bool' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_notifications_owner ON notifications (owner)'],
    })
    app.save(notifications)

    // 5. Music Library
    const musicLibrary = new Collection({
      name: 'music_library',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'artist', type: 'text' },
        { name: 'album', type: 'text' },
        { name: 'duration', type: 'number' },
        {
          name: 'genre',
          type: 'select',
          required: true,
          values: ['synthwave', 'lo-fi', 'eletronica', 'ambient', 'pop'],
          maxSelect: 1,
        },
        {
          name: 'cover',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'is_favorite', type: 'bool' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_music_owner ON music_library (owner)'],
    })
    app.save(musicLibrary)

    // 6. Playlists
    const playlists = new Collection({
      name: 'playlists',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'songs', type: 'relation', collectionId: musicLibrary.id, maxSelect: 100 },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_playlists_owner ON playlists (owner)'],
    })
    app.save(playlists)

    // 7. Widgets
    const widgets = new Collection({
      name: 'widgets',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        {
          name: 'widget_type',
          type: 'select',
          required: true,
          values: ['relogio', 'clima', 'agenda', 'musica', 'sistema', 'notas'],
          maxSelect: 1,
        },
        { name: 'position', type: 'number' },
        { name: 'settings', type: 'json' },
        { name: 'is_visible', type: 'bool' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_widgets_owner ON widgets (owner)'],
    })
    app.save(widgets)

    // 8. User Settings
    const userSettings = new Collection({
      name: 'user_settings',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        {
          name: 'theme',
          type: 'select',
          required: true,
          values: [
            'neon-cyan',
            'aurora-purple',
            'matrix-green',
            'solaris-amber',
            'crimson',
            'mono',
          ],
          maxSelect: 1,
        },
        { name: 'wallpaper', type: 'text' },
        { name: 'accent', type: 'text' },
        {
          name: 'clock_format',
          type: 'select',
          required: true,
          values: ['12h', '24h'],
          maxSelect: 1,
        },
        { name: 'weather_city', type: 'text' },
        { name: 'terminal_greeting', type: 'text' },
        { name: 'notif_sound', type: 'bool' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_user_settings_owner ON user_settings (owner)'],
    })
    app.save(userSettings)

    // 9. Terminal History
    const terminalHistory = new Collection({
      name: 'terminal_history',
      type: 'base',
      listRule: 'owner = @request.auth.id',
      viewRule: 'owner = @request.auth.id',
      createRule: "@request.auth.id != ''",
      updateRule: 'owner = @request.auth.id',
      deleteRule: 'owner = @request.auth.id',
      fields: [
        { name: 'command', type: 'text' },
        { name: 'output', type: 'text' },
        {
          name: 'owner',
          type: 'relation',
          required: true,
          collectionId: usersId,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_term_owner ON terminal_history (owner)'],
    })
    app.save(terminalHistory)
  },
  (app) => {
    const collections = [
      'terminal_history',
      'user_settings',
      'widgets',
      'playlists',
      'music_library',
      'notifications',
      'emails',
      'calendar_events',
      'files',
    ]
    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
