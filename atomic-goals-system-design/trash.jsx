// Trash / Papelera — tabs (metas / categorías / pasos), selectable table,
// multi-select bulk bar, restore + permanent delete with confirm dialog.
// Reuses dashPalettes, DashIcon, DASH_NAV, DashThemeToggle, CategoriesSidebar,
// CatIcon, DashMobileTabBar.

const TRASH_DATA = {
  goals: [
    { id: 't1', name: 'Aprender a tocar guitarra', cat: 'mente', color: '#C8FF1F', deleted: 'hace 2 días', expires: 28, meta: '8 pasos · 30% completado' },
    { id: 't2', name: 'Maratón de Berlín', cat: 'salud', color: '#FF3D6E', deleted: 'hace 5 días', expires: 25, meta: '12 pasos · conclusiva' },
    { id: 't3', name: 'Newsletter semanal', cat: 'trabajo', color: '#FFB400', deleted: 'hace 1 semana', expires: 23, meta: 'cíclica · semanal' },
  ],
  categories: [
    { id: 't4', name: 'hobbies', cat: null, color: '#9D7AFF', deleted: 'hace 3 días', expires: 27, meta: '0 metas dentro' },
    { id: 't5', name: 'viajes', cat: null, color: '#1FD1F9', deleted: 'hace 6 días', expires: 24, meta: '2 metas movidas a salud' },
  ],
  steps: [
    { id: 't6', name: 'Comprar partitura', cat: 'mente', color: '#C8FF1F', deleted: 'hace 2 días', expires: 28, meta: 'de · Aprender guitarra' },
    { id: 't7', name: 'Inscripción al maratón', cat: 'salud', color: '#FF3D6E', deleted: 'hace 5 días', expires: 25, meta: 'de · Maratón de Berlín' },
    { id: 't8', name: 'Borrador edición #4', cat: 'trabajo', color: '#FFB400', deleted: 'hace 1 semana', expires: 23, meta: 'de · Newsletter semanal' },
    { id: 't9', name: 'Reservar vuelos', cat: null, color: '#1FD1F9', deleted: 'hace 6 días', expires: 24, meta: 'de · Viaje a Japón' },
  ],
};

const TRASH_TABS = [
  { id: 'goals', label: 'Metas', icon: 'square' },
  { id: 'categories', label: 'Categorías', icon: 'square' },
  { id: 'steps', label: 'Pasos', icon: 'check' },
];

// ── Confirm dialog ──
function ConfirmDialog({ palette, title, body, confirmLabel, danger, onCancel, onConfirm }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'trash-fade .15s ease',
    }}
    onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 380,
        background: palette.surface,
        border: `1.5px solid ${palette.line}`,
        boxShadow: `8px 8px 0 0 ${danger ? palette.magenta : palette.line}`,
      }}>
        <div style={{
          padding: '20px 22px 16px',
          borderBottom: `1.5px solid ${palette.line}`,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 10,
          }}>
            <span style={{
              width: 32, height: 32,
              background: danger ? palette.magenta : palette.lime,
              border: `1.5px solid ${palette.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: palette.line,
              fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 16,
            }}>{danger ? '!' : '↺'}</span>
            <h3 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: palette.ink,
            }}>{title}</h3>
          </div>
          <p style={{
            margin: 0, fontSize: 13, lineHeight: 1.5, color: palette.inkDim,
          }}>{body}</p>
        </div>
        <div style={{ padding: '14px 22px', display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, height: 42,
            background: palette.surface, color: palette.ink,
            border: `1.5px solid ${palette.line}`, cursor: 'pointer',
            fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 13, fontWeight: 600,
          }}>Cancelar</button>
          <button onClick={onConfirm} style={{
            flex: 1.4, height: 42,
            background: danger ? palette.magenta : palette.line,
            color: danger ? palette.line : palette.bg,
            border: danger ? `1.5px solid ${palette.line}` : 'none', cursor: 'pointer',
            fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 14, fontWeight: 700,
            letterSpacing: '-0.005em',
          }}>{confirmLabel}</button>
        </div>
      </div>
      <style>{`@keyframes trash-fade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}

// ── Custom checkbox ──
function TrashCheck({ checked, indeterminate, onChange, palette }) {
  return (
    <button onClick={onChange} aria-label="Seleccionar" style={{
      width: 20, height: 20, flexShrink: 0,
      border: `1.5px solid ${palette.line}`,
      background: (checked || indeterminate) ? palette.line : palette.surface,
      cursor: 'pointer', padding: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background .12s',
    }}>
      {indeterminate
        ? <span style={{ width: 9, height: 2, background: palette.bg }} />
        : checked && <DashIcon kind="check" size={13} color={palette.bg} />}
    </button>
  );
}

function TrashRow({ item, tab, palette, selected, onToggle, onRestore, onDelete }) {
  const urgent = item.expires <= 24;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '20px 6px 1fr 150px 130px 150px',
      gap: 16, alignItems: 'center',
      padding: '12px 16px',
      borderBottom: `1px solid ${palette.lineSofter}`,
      background: selected ? palette.primarySoft : palette.surface,
      transition: 'background .12s',
    }}>
      <TrashCheck checked={selected} onChange={onToggle} palette={palette} />
      <div style={{ alignSelf: 'stretch', background: item.color }} />
      <div style={{ minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {tab === 'categories' && (
            <span style={{
              width: 22, height: 22, background: item.color, border: `1.5px solid ${palette.line}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: palette.line, flexShrink: 0,
            }}><CatIcon kind="leaf" size={12} color={palette.line} /></span>
          )}
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
            textTransform: tab === 'categories' ? 'capitalize' : 'none',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{item.name}</span>
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
        }}>{item.meta}</div>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
        color: palette.inkDim, letterSpacing: '0.04em',
      }}>{item.deleted}</div>
      <div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.04em',
          color: urgent ? palette.magenta : palette.inkDim,
          fontWeight: urgent ? 600 : 400,
        }}>
          <span style={{
            width: 8, height: 8,
            background: urgent ? palette.magenta : palette.lineSoft,
          }} />
          {item.expires} días
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onRestore} style={{
          padding: '6px 10px', border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.ink, cursor: 'pointer',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>↺ restaurar</button>
        <button onClick={onDelete} aria-label="Eliminar definitivamente" style={{
          width: 30, height: 30, border: `1.5px solid ${palette.line}`,
          background: palette.surface, color: palette.magenta, cursor: 'pointer',
          fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 14,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>×</button>
      </div>
    </div>
  );
}

function TrashDesktop() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('goals');
  const [data, setData] = React.useState(TRASH_DATA);
  const [selected, setSelected] = React.useState(new Set());
  const [dialog, setDialog] = React.useState(null); // { mode, ids } or { mode:'empty' }
  const palette = dashPalettes[theme];

  const rows = data[tab];
  const allSelected = rows.length > 0 && rows.every(r => selected.has(r.id));
  const someSelected = rows.some(r => selected.has(r.id));

  const totalCount = Object.values(data).reduce((s, arr) => s + arr.length, 0);

  const toggleAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allSelected) rows.forEach(r => next.delete(r.id));
      else rows.forEach(r => next.add(r.id));
      return next;
    });
  };
  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const restoreIds = (ids) => {
    setData(prev => ({ ...prev, [tab]: prev[tab].filter(r => !ids.includes(r.id)) }));
    setSelected(prev => { const n = new Set(prev); ids.forEach(i => n.delete(i)); return n; });
  };
  const deleteIds = (ids) => {
    setData(prev => ({ ...prev, [tab]: prev[tab].filter(r => !ids.includes(r.id)) }));
    setSelected(prev => { const n = new Set(prev); ids.forEach(i => n.delete(i)); return n; });
  };

  const selectedInTab = rows.filter(r => selected.has(r.id)).map(r => r.id);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '240px 1fr',
      background: palette.bg, color: palette.ink,
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      <CategoriesSidebar palette={palette} active="trash" />

      <main style={{ overflow: 'auto', padding: '24px 32px 32px' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 4,
            }}>papelera · {totalCount} elementos</div>
            <h1 style={{
              margin: 0,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em',
            }}>Lo que <span style={{
              background: palette.magenta, color: palette.bg, padding: '0 8px',
            }}>borraste</span> · aún recuperable.</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
            <button onClick={() => setDialog({ mode: 'empty' })} disabled={totalCount === 0} style={{
              background: totalCount === 0 ? palette.lineSofter : palette.surface,
              color: totalCount === 0 ? palette.inkSubtle : palette.magenta,
              border: `1.5px solid ${totalCount === 0 ? palette.lineSoft : palette.magenta}`,
              padding: '10px 16px', cursor: totalCount === 0 ? 'default' : 'pointer',
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 13, fontWeight: 700, letterSpacing: '-0.005em',
            }}>Vaciar papelera</button>
          </div>
        </div>

        {/* Info banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', marginBottom: 18,
          border: `1.5px solid ${palette.line}`,
          background: palette.surface2,
        }}>
          <span style={{
            width: 24, height: 24, background: palette.yellow, border: `1.5px solid ${palette.line}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: palette.line, fontWeight: 700, fontSize: 13, flexShrink: 0,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
          }}>i</span>
          <span style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 13,
            color: palette.inkDim,
          }}>Los elementos se eliminan <strong style={{ color: palette.ink }}>definitivamente a los 30 días</strong>. Puedes restaurarlos antes de eso.</span>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: `1.5px solid ${palette.line}`, marginBottom: 0,
        }}>
          {TRASH_TABS.map(t => {
            const n = data[t.id].length;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '12px 20px',
                background: 'transparent', border: 'none',
                borderBottom: active ? `3px solid ${palette.magenta}` : '3px solid transparent',
                marginBottom: -1.5, cursor: 'pointer',
                color: active ? palette.ink : palette.inkDim,
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 14, fontWeight: 700, letterSpacing: '-0.005em',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                {t.label}
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                  padding: '2px 6px',
                  background: active ? palette.line : palette.lineSofter,
                  color: active ? palette.bg : palette.inkDim,
                  letterSpacing: '0.04em',
                }}>{n}</span>
              </button>
            );
          })}
        </div>

        {/* Bulk action bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 16px',
          background: someSelected ? palette.line : palette.surface,
          color: someSelected ? palette.bg : palette.ink,
          border: `1.5px solid ${palette.line}`,
          borderTop: 'none',
          transition: 'background .15s, color .15s',
        }}>
          <TrashCheck
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            onChange={toggleAll}
            palette={someSelected ? { ...palette, line: palette.bg, surface: palette.line, bg: palette.line } : palette}
          />
          <span style={{
            fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
            letterSpacing: '0.06em',
          }}>
            {selectedInTab.length > 0
              ? `${selectedInTab.length} seleccionado${selectedInTab.length !== 1 ? 's' : ''}`
              : 'seleccionar todo'}
          </span>

          {selectedInTab.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>
              <button onClick={() => restoreIds(selectedInTab)} style={{
                padding: '7px 14px',
                background: palette.lime, color: palette.line,
                border: `1.5px solid ${palette.line}`, cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 13, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>↺ Restaurar ({selectedInTab.length})</button>
              <button onClick={() => setDialog({ mode: 'delete', ids: selectedInTab })} style={{
                padding: '7px 14px',
                background: palette.magenta, color: palette.line,
                border: `1.5px solid ${palette.line}`, cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 13, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>× Eliminar ({selectedInTab.length})</button>
            </div>
          )}
        </div>

        {/* Column header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '20px 6px 1fr 150px 130px 150px',
          gap: 16, alignItems: 'center',
          padding: '8px 16px',
          background: palette.surface2,
          border: `1.5px solid ${palette.line}`, borderTop: 'none',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
          color: palette.inkDim, letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          <div /><div />
          <div>elemento</div>
          <div>eliminado</div>
          <div>expira en</div>
          <div style={{ textAlign: 'right' }}>acciones</div>
        </div>

        {/* Rows */}
        <div style={{
          border: `1.5px solid ${palette.line}`, borderTop: 'none',
          background: palette.surface,
        }}>
          {rows.length === 0 ? (
            <div style={{
              padding: '48px 20px', textAlign: 'center',
            }}>
              <div style={{
                width: 56, height: 56, margin: '0 auto 14px',
                border: `1.5px dashed ${palette.lineSoft}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: palette.inkSubtle,
              }}><DashIcon kind="check" size={26} color={palette.inkSubtle} /></div>
              <div style={{
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 16, fontWeight: 700, color: palette.ink, marginBottom: 4,
              }}>Nada por aquí</div>
              <div style={{
                fontFamily: '"JetBrains Mono", monospace', fontSize: 11,
                color: palette.inkDim, letterSpacing: '0.04em',
              }}>esta pestaña de la papelera está vacía</div>
            </div>
          ) : (
            rows.map(item => (
              <TrashRow key={item.id}
                item={item} tab={tab} palette={palette}
                selected={selected.has(item.id)}
                onToggle={() => toggle(item.id)}
                onRestore={() => restoreIds([item.id])}
                onDelete={() => setDialog({ mode: 'delete', ids: [item.id] })}
              />
            ))
          )}
        </div>
      </main>

      {dialog && dialog.mode === 'delete' && (
        <ConfirmDialog
          palette={palette} danger
          title={`Eliminar ${dialog.ids.length} elemento${dialog.ids.length !== 1 ? 's' : ''}`}
          body="Esta acción es permanente. No podrás recuperar lo que elimines aquí. ¿Seguro?"
          confirmLabel="Sí, eliminar"
          onCancel={() => setDialog(null)}
          onConfirm={() => { deleteIds(dialog.ids); setDialog(null); }}
        />
      )}
      {dialog && dialog.mode === 'empty' && (
        <ConfirmDialog
          palette={palette} danger
          title="Vaciar la papelera"
          body={`Vas a eliminar definitivamente los ${totalCount} elementos de la papelera. Esta acción no se puede deshacer.`}
          confirmLabel="Vaciar todo"
          onCancel={() => setDialog(null)}
          onConfirm={() => { setData({ goals: [], categories: [], steps: [] }); setSelected(new Set()); setDialog(null); }}
        />
      )}
    </div>
  );
}

// ── Mobile ──
function TrashMobile() {
  const [theme, setTheme] = React.useState('light');
  const [tab, setTab] = React.useState('goals');
  const [data, setData] = React.useState(TRASH_DATA);
  const [selected, setSelected] = React.useState(new Set());
  const [dialog, setDialog] = React.useState(null);
  const palette = dashPalettes[theme];

  const rows = data[tab];
  const selectedInTab = rows.filter(r => selected.has(r.id)).map(r => r.id);

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const removeIds = (ids) => {
    setData(prev => ({ ...prev, [tab]: prev[tab].filter(r => !ids.includes(r.id)) }));
    setSelected(prev => { const n = new Set(prev); ids.forEach(i => n.delete(i)); return n; });
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: palette.bg, color: palette.ink,
      position: 'relative',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflow: 'auto', paddingBottom: 100,
      }}>
        {/* header */}
        <div style={{
          paddingTop: 54, paddingLeft: 20, paddingRight: 20, paddingBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: palette.inkDim, marginBottom: 2,
            }}>recuperable 30 días</div>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', color: palette.ink,
            }}>Papelera</div>
          </div>
          <DashThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} palette={palette} />
        </div>

        {/* tabs */}
        <div style={{
          padding: '0 16px 12px',
          display: 'flex', gap: 6,
        }}>
          {TRASH_TABS.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, padding: '8px 6px',
                border: `1.5px solid ${palette.line}`,
                background: active ? palette.line : palette.surface,
                color: active ? palette.bg : palette.ink,
                cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontSize: 12, fontWeight: 700, letterSpacing: '-0.005em',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {t.label}
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                  padding: '1px 5px',
                  background: active ? 'rgba(244,244,239,0.2)' : palette.lineSofter,
                  color: active ? palette.bg : palette.inkDim,
                }}>{data[t.id].length}</span>
              </button>
            );
          })}
        </div>

        {/* selection bar */}
        {selectedInTab.length > 0 && (
          <div style={{
            margin: '0 16px 12px',
            padding: '10px 12px',
            background: palette.line, color: palette.bg,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.06em',
            }}>{selectedInTab.length} sel.</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <button onClick={() => removeIds(selectedInTab)} style={{
                padding: '6px 12px', background: palette.lime, color: palette.line,
                border: 'none', cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12, fontWeight: 700,
              }}>↺ Restaurar</button>
              <button onClick={() => setDialog({ ids: selectedInTab })} style={{
                padding: '6px 12px', background: palette.magenta, color: palette.line,
                border: 'none', cursor: 'pointer',
                fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: 12, fontWeight: 700,
              }}>× Borrar</button>
            </div>
          </div>
        )}

        {/* cards */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.length === 0 ? (
            <div style={{
              padding: 36, textAlign: 'center',
              border: `1.5px dashed ${palette.lineSoft}`, color: palette.inkDim,
              fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.04em',
            }}>pestaña vacía</div>
          ) : rows.map(item => {
            const sel = selected.has(item.id);
            const urgent = item.expires <= 24;
            return (
              <div key={item.id} style={{
                background: sel ? palette.primarySoft : palette.surface,
                border: `1.5px solid ${palette.line}`,
                display: 'grid', gridTemplateColumns: '20px 5px 1fr', gap: 12,
                padding: '12px 14px', alignItems: 'flex-start',
              }}>
                <div style={{ paddingTop: 1 }}>
                  <TrashCheck checked={sel} onChange={() => toggle(item.id)} palette={palette} />
                </div>
                <div style={{ alignSelf: 'stretch', background: item.color }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', color: palette.ink,
                    textTransform: tab === 'categories' ? 'capitalize' : 'none',
                  }}>{item.name}</div>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                    color: palette.inkDim, marginTop: 2, letterSpacing: '0.02em',
                  }}>{item.meta}</div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginTop: 8,
                  }}>
                    <span style={{
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 9,
                      color: urgent ? palette.magenta : palette.inkSubtle,
                      letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}>
                      <span style={{ width: 7, height: 7, background: urgent ? palette.magenta : palette.lineSoft }} />
                      {item.deleted} · expira en {item.expires}d
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => removeIds([item.id])} style={{
                      flex: 1, padding: '7px', border: `1.5px solid ${palette.line}`,
                      background: palette.surface, color: palette.ink, cursor: 'pointer',
                      fontFamily: '"JetBrains Mono", monospace', fontSize: 10,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                    }}>↺ restaurar</button>
                    <button onClick={() => setDialog({ ids: [item.id] })} style={{
                      padding: '7px 12px', border: `1.5px solid ${palette.magenta}`,
                      background: palette.surface, color: palette.magenta, cursor: 'pointer',
                      fontFamily: '"Space Grotesk", system-ui, sans-serif', fontWeight: 700, fontSize: 13,
                    }}>×</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 30 }} />
      </div>

      <DashMobileTabBar palette={palette} active="profile" onChange={() => {}} />

      {dialog && (
        <ConfirmDialog
          palette={palette} danger
          title={`Eliminar ${dialog.ids.length}`}
          body="Permanente. No podrás recuperarlo. ¿Seguro?"
          confirmLabel="Sí, eliminar"
          onCancel={() => setDialog(null)}
          onConfirm={() => { removeIds(dialog.ids); setDialog(null); }}
        />
      )}
    </div>
  );
}

window.TrashDesktop = TrashDesktop;
window.TrashMobile = TrashMobile;
