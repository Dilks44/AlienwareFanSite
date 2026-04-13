import { useState } from 'react'
import { getGallery, saveGallery, formatDate } from '../lib/db.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { authIncrementStat } from '../lib/auth.js'
import GalleryPlaceholder from '../components/GalleryPlaceholder.jsx'

const CATS = ['all', 'desktops', 'laptops', 'stations', 'internals', 'rare']

export default function Gallery() {
  const [items, setItems] = useState(getGallery)
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('date')
  const [lightbox, setLightbox] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [form, setForm] = useState({ title: '', desc: '', cat: 'desktops' })
  const [imageData, setImageData] = useState(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const filtered = items
    .filter(i => cat === 'all' || i.cat === cat)
    .sort((a, b) => sort === 'likes' ? b.likes - a.likes : new Date(b.date) - new Date(a.date))

  function handleLike(id) {
    const updated = items.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i)
    setItems(updated)
    saveGallery(updated)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setImageData(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleUpload(e) {
    e.preventDefault()
    if (!user) { toast('Sign in to upload photos.', 'warning'); return }
    if (!form.title) { toast('Please add a title.', 'error'); return }

    const icons = { desktops: '🖥️', laptops: '💻', stations: '🖥️', internals: '🔧', rare: '🦄' }
    const colors = { desktops: '#006b1e', laptops: '#8a6000', stations: '#6600aa', internals: '#005f8a', rare: '#8a3000' }

    const newItem = {
      id: Date.now(),
      title: form.title,
      desc: form.desc,
      cat: form.cat,
      author: user.username,
      date: new Date().toISOString(),
      likes: 0,
      color: colors[form.cat] || '#006b1e',
      icon: imageData ? null : (icons[form.cat] || '🖥️'),
      label: `${form.cat.toUpperCase()} · UPLOAD`,
      image: imageData || null,
    }

    const updated = [newItem, ...items]
    setItems(updated)
    saveGallery(updated)
    authIncrementStat(user.id, 'uploads')
    setForm({ title: '', desc: '', cat: 'desktops' })
    setImageData(null)
    setShowUpload(false)
    toast('Photo uploaded!', 'success')
  }

  return (
    <div className="main-content">
      <div className="page-hero">
        <div className="page-hero__grid" />
        <div className="container">
          <div className="page-hero__content">
            <div className="page-hero__eyebrow">⬡ Community Photos</div>
            <h1 className="page-hero__title">Gallery</h1>
            <p className="page-hero__desc">Setups, internals, mods, and rare finds from the Alienware community.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Controls */}
          <div className="flex-between" style={{ marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div className="filter-bar" style={{ marginBottom: 0 }}>
              {CATS.map(c => (
                <button key={c} className={`filter-btn${cat === c ? ' active' : ''}`} onClick={() => setCat(c)}>
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select className="form-input" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="date">Newest First</option>
                <option value="likes">Most Liked</option>
              </select>
              {user && (
                <button className="btn btn--primary btn--sm" onClick={() => setShowUpload(true)}>
                  + Upload
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="gallery-grid">
            {filtered.map(item => (
              <div key={item.id} className="gallery-card" onClick={() => setLightbox(item)}>
                <div className="gallery-card__visual" style={{ background: '#0a0a10' }}>
                  {item.image
                    ? <img src={item.image} alt={item.title} />
                    : <GalleryPlaceholder color={item.color} label={item.label} slot={item.id} />
                  }
                  <div className="gallery-card__label">{item.label}</div>
                </div>
                <div className="gallery-card__info">
                  <div className="gallery-card__title">{item.title}</div>
                  <div className="gallery-card__desc">{item.desc}</div>
                  <div className="gallery-card__meta">
                    <span>by {item.author}</span>
                    <span
                      onClick={e => { e.stopPropagation(); handleLike(item.id) }}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      ❤️ {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-dim)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🖼️</div>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem' }}>No items in this category.</div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="modal-overlay" onClick={() => setLightbox(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__title">{lightbox.title}</div>
              <button className="modal__close" onClick={() => setLightbox(null)}>✕</button>
            </div>
            <div style={{ aspectRatio: '16/9', background: '#0a0a10', position: 'relative', overflow: 'hidden' }}>
              {lightbox.image
                ? <img src={lightbox.image} alt={lightbox.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                : <GalleryPlaceholder color={lightbox.color} label={lightbox.label} slot={lightbox.id} />
              }
            </div>
            <div className="modal__body">
              <p style={{ color: 'var(--text-dim)', marginBottom: 12 }}>{lightbox.desc}</p>
              <div className="flex-between" style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                <span>by <strong style={{ color: 'var(--text)' }}>{lightbox.author}</strong></span>
                <span>{formatDate(lightbox.date)}</span>
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--ghost" onClick={() => setLightbox(null)}>Close</button>
              <button className="btn btn--outline btn--sm" onClick={() => { handleLike(lightbox.id); setLightbox(l => ({ ...l, likes: l.likes + 1 })) }}>
                ❤️ Like · {lightbox.likes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div className="modal__title">Upload Photo</div>
              <button className="modal__close" onClick={() => setShowUpload(false)}>✕</button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="modal__body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-input" type="text" placeholder="My Alienware Setup" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" placeholder="Tell us about it..." value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} style={{ minHeight: 80 }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.cat} onChange={e => setForm(f => ({ ...f, cat: e.target.value }))}>
                    <option value="desktops">Desktops</option>
                    <option value="laptops">Laptops</option>
                    <option value="stations">Battle Stations</option>
                    <option value="internals">Internals</option>
                    <option value="rare">Rare / Vintage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Image (optional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }} />
                  {imageData && <img src={imageData} alt="preview" style={{ marginTop: 10, maxHeight: 120, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />}
                </div>
              </div>
              <div className="modal__footer">
                <button type="button" className="btn btn--ghost" onClick={() => setShowUpload(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
