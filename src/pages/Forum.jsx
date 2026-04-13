import { useState } from 'react'
import { getThreads, saveThreads, formatDate } from '../lib/db.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { authIncrementStat } from '../lib/auth.js'

const CATEGORIES = [
  { id: 'desktops', icon: '🖥️', name: 'Desktops', desc: 'Area-51, Aurora, x51 desktops and tower systems' },
  { id: 'laptops',  icon: '💻', name: 'Laptops',  desc: 'm17x, m15x, 15 R series and all laptop models' },
  { id: 'software', icon: '⚙️', name: 'Software',  desc: 'AWCC, AlienFX, drivers, BIOS, Windows compatibility' },
  { id: 'showcase', icon: '🏆', name: 'Showcase',  desc: 'Show off your setup, mods, and restorations' },
]

export default function Forum() {
  const [threads, setThreads] = useState(getThreads)
  const [view, setView] = useState('categories') // 'categories' | 'list' | 'thread'
  const [activeCat, setActiveCat] = useState(null)
  const [activeThread, setActiveThread] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState({ title: '', body: '', cat: 'desktops', tags: '' })
  const [replyBody, setReplyBody] = useState('')
  const { user } = useAuth()
  const { toast } = useToast()

  function openCategory(cat) {
    setActiveCat(cat)
    setView('list')
  }

  function openThread(thread) {
    // Increment view count
    const updated = threads.map(t => t.id === thread.id ? { ...t, views: t.views + 1 } : t)
    setThreads(updated)
    saveThreads(updated)
    setActiveThread({ ...thread, views: thread.views + 1 })
    setView('thread')
  }

  function handleLike(threadId) {
    const updated = threads.map(t => t.id === threadId ? { ...t, likes: t.likes + 1 } : t)
    setThreads(updated)
    saveThreads(updated)
    setActiveThread(t => t ? { ...t, likes: t.likes + 1 } : t)
  }

  function handleReply(e) {
    e.preventDefault()
    if (!user) { toast('Sign in to reply.', 'warning'); return }
    if (!replyBody.trim()) { toast('Reply cannot be empty.', 'error'); return }

    const reply = {
      id: Date.now(),
      author: user.username,
      body: replyBody,
      date: new Date().toISOString(),
      likes: 0,
    }

    const updated = threads.map(t =>
      t.id === activeThread.id
        ? { ...t, replies: [...(t.replies || []), reply] }
        : t
    )
    setThreads(updated)
    saveThreads(updated)
    setActiveThread(t => ({ ...t, replies: [...(t.replies || []), reply] }))
    setReplyBody('')
    authIncrementStat(user.id, 'posts')
    toast('Reply posted!', 'success')
  }

  function handleNewThread(e) {
    e.preventDefault()
    if (!user) { toast('Sign in to post.', 'warning'); return }
    if (!newForm.title.trim() || !newForm.body.trim()) { toast('Title and body are required.', 'error'); return }

    const thread = {
      id: Date.now(),
      cat: newForm.cat,
      title: newForm.title,
      author: user.username,
      body: `<p>${newForm.body.replace(/\n/g, '</p><p>')}</p>`,
      date: new Date().toISOString(),
      replies: [],
      views: 0,
      likes: 0,
      tags: newForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const updated = [thread, ...threads]
    setThreads(updated)
    saveThreads(updated)
    authIncrementStat(user.id, 'posts')
    setShowNew(false)
    setNewForm({ title: '', body: '', cat: 'desktops', tags: '' })
    toast('Thread posted!', 'success')
    setActiveCat(thread.cat)
    setView('list')
  }

  const catThreads = threads.filter(t => t.cat === activeCat)

  return (
    <div className="main-content">
      <div className="page-hero">
        <div className="page-hero__grid" />
        <div className="container">
          <div className="page-hero__content">
            <div className="page-hero__eyebrow">⬡ Community Discussion</div>
            <h1 className="page-hero__title">Forum</h1>
            <p className="page-hero__desc">Technical discussions, guides, repairs, and community showcases for all Alienware hardware.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="forum-layout">
            <div>
              {/* Breadcrumb */}
              <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <span style={{ cursor: 'pointer', color: 'var(--green)' }} onClick={() => setView('categories')}>Forum</span>
                {activeCat && (
                  <>
                    <span>›</span>
                    <span style={{ cursor: view === 'thread' ? 'pointer' : 'default', color: view === 'thread' ? 'var(--green)' : 'var(--text-dim)' }}
                      onClick={() => view === 'thread' && setView('list')}>
                      {CATEGORIES.find(c => c.id === activeCat)?.name}
                    </span>
                  </>
                )}
                {view === 'thread' && activeThread && (
                  <>
                    <span>›</span>
                    <span style={{ color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>{activeThread.title}</span>
                  </>
                )}
              </div>

              {/* Categories View */}
              {view === 'categories' && (
                <div>
                  <div className="flex-between" style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', color: 'var(--text-bright)' }}>Categories</h2>
                    {user && <button className="btn btn--primary btn--sm" onClick={() => setShowNew(true)}>+ New Thread</button>}
                  </div>
                  {CATEGORIES.map(cat => {
                    const catT = threads.filter(t => t.cat === cat.id)
                    return (
                      <div key={cat.id} className="cat-card">
                        <div className="cat-card__header" onClick={() => openCategory(cat.id)}>
                          <span className="cat-card__icon">{cat.icon}</span>
                          <div className="cat-card__info">
                            <div className="cat-card__name">{cat.name}</div>
                            <div className="cat-card__desc">{cat.desc}</div>
                          </div>
                          <div className="cat-card__stats">
                            <div className="cat-stat"><strong>{catT.length}</strong>threads</div>
                            <div className="cat-stat"><strong>{catT.reduce((s, t) => s + (t.replies?.length || 0), 0)}</strong>replies</div>
                          </div>
                        </div>
                        <div className="thread-list">
                          {catT.slice(0, 2).map(t => (
                            <div key={t.id} className="thread-row" onClick={() => openThread(t)}>
                              <span className="thread-row__icon">💬</span>
                              <div className="thread-row__meta">
                                <div className="thread-row__title">{t.title}</div>
                                <div className="thread-row__sub">by {t.author} · {formatDate(t.date)}</div>
                              </div>
                              <div className="thread-row__counts">
                                <div className="thread-count"><strong>{t.replies?.length || 0}</strong>replies</div>
                                <div className="thread-count"><strong>{t.views}</strong>views</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Thread List View */}
              {view === 'list' && (
                <div>
                  <div className="flex-between" style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', color: 'var(--text-bright)' }}>
                      {CATEGORIES.find(c => c.id === activeCat)?.name} — {catThreads.length} threads
                    </h2>
                    {user && <button className="btn btn--primary btn--sm" onClick={() => setShowNew(true)}>+ New Thread</button>}
                  </div>
                  <div className="cat-card">
                    <div className="thread-list">
                      {catThreads.length === 0 && (
                        <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-dim)' }}>No threads yet. Be the first to post!</div>
                      )}
                      {catThreads.map(t => (
                        <div key={t.id} className="thread-row" onClick={() => openThread(t)}>
                          <span className="thread-row__icon">💬</span>
                          <div className="thread-row__meta">
                            <div className="thread-row__title">{t.title}</div>
                            <div className="thread-row__sub">by {t.author} · {formatDate(t.date)}</div>
                          </div>
                          <div className="thread-row__counts">
                            <div className="thread-count"><strong>{t.replies?.length || 0}</strong>replies</div>
                            <div className="thread-count"><strong>{t.views}</strong>views</div>
                            <div className="thread-count"><strong>{t.likes}</strong>likes</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Thread Detail View */}
              {view === 'thread' && activeThread && (
                <div>
                  <div className="flex-between" style={{ marginBottom: 20 }}>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.82rem', color: 'var(--text-bright)', flex: 1, marginRight: 16 }}>{activeThread.title}</h2>
                  </div>

                  {/* Tags */}
                  {activeThread.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                      {activeThread.tags.map(tag => <span key={tag} className="badge badge--dim">{tag}</span>)}
                    </div>
                  )}

                  {/* OP post */}
                  <div className="post-card post-card--op">
                    <div className="post-card__header">
                      <div className="avatar">{activeThread.author.slice(0, 2).toUpperCase()}</div>
                      <div className="post-card__author">
                        <div className="post-card__username">{activeThread.author}</div>
                        <div className="post-card__date">{formatDate(activeThread.date)}</div>
                      </div>
                      <span className="badge badge--green">OP</span>
                    </div>
                    <div className="post-card__body" dangerouslySetInnerHTML={{ __html: activeThread.body }} />
                    <div className="post-card__footer">
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span className="badge badge--dim">Views: {activeThread.views}</span>
                      </div>
                      <button className="btn btn--ghost btn--sm" onClick={() => handleLike(activeThread.id)}>
                        ❤️ {activeThread.likes} Likes
                      </button>
                    </div>
                  </div>

                  {/* Replies */}
                  {(activeThread.replies || []).map((r, i) => (
                    <div key={r.id || i} className="post-card post-card--reply">
                      <div className="post-card__header">
                        <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--blue), var(--green))' }}>
                          {r.author.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="post-card__author">
                          <div className="post-card__username">{r.author}</div>
                          <div className="post-card__date">{formatDate(r.date)}</div>
                        </div>
                        <span className="badge badge--dim">#{i + 1}</span>
                      </div>
                      <div className="post-card__body">
                        <p>{r.body}</p>
                      </div>
                    </div>
                  ))}

                  {/* Reply box */}
                  {user ? (
                    <form onSubmit={handleReply} style={{ marginTop: 24 }}>
                      <div className="form-group">
                        <label className="form-label">Post a Reply</label>
                        <textarea className="form-input" placeholder="Share your thoughts..." value={replyBody} onChange={e => setReplyBody(e.target.value)} />
                      </div>
                      <button type="submit" className="btn btn--primary">Post Reply</button>
                    </form>
                  ) : (
                    <div style={{ marginTop: 24, padding: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', textAlign: 'center', color: 'var(--text-dim)' }}>
                      <a href="/login" style={{ color: 'var(--green)' }}>Sign in</a> to post a reply.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="forum-sidebar">
              <div className="forum-sidebar-widget">
                <div className="forum-sidebar-widget__title">📊 Forum Stats</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['Threads', threads.length],
                    ['Replies', threads.reduce((s, t) => s + (t.replies?.length || 0), 0)],
                    ['Members', 12400],
                  ].map(([label, val]) => (
                    <div key={label} className="flex-between" style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                      <span style={{ color: 'var(--green)', fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem' }}>{val.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="forum-sidebar-widget">
                <div className="forum-sidebar-widget__title">🔥 Hot Threads</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {threads.sort((a, b) => b.views - a.views).slice(0, 4).map(t => (
                    <div key={t.id} style={{ cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => { setActiveCat(t.cat); openThread(t) }}>
                      <div style={{ color: 'var(--text)', lineHeight: 1.4, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{t.views.toLocaleString()} views</div>
                    </div>
                  ))}
                </div>
              </div>

              {!user && (
                <div className="forum-sidebar-widget" style={{ borderColor: 'rgba(0,255,65,0.3)' }}>
                  <div className="forum-sidebar-widget__title">👋 Join In</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.6 }}>Create a free account to post threads, reply, and connect with the community.</p>
                  <a href="/login?tab=register" className="btn btn--primary btn--sm" style={{ width: '100%', justifyContent: 'center' }}>Register Free</a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* New Thread Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={() => setShowNew(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__title">New Thread</div>
              <button className="modal__close" onClick={() => setShowNew(false)}>✕</button>
            </div>
            <form onSubmit={handleNewThread}>
              <div className="modal__body">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={newForm.cat} onChange={e => setNewForm(f => ({ ...f, cat: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" type="text" placeholder="Thread title..." value={newForm.title} onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Body</label>
                  <textarea className="form-input" placeholder="Share your knowledge..." value={newForm.body} onChange={e => setNewForm(f => ({ ...f, body: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma-separated)</label>
                  <input className="form-input" type="text" placeholder="Area-51, Guide, GPU" value={newForm.tags} onChange={e => setNewForm(f => ({ ...f, tags: e.target.value }))} />
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowNew(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Post Thread</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
