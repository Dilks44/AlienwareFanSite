import { Link } from 'react-router-dom'
import { getThreads, formatDate } from '../lib/db.js'

export default function Home() {
  const threads = getThreads().slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="container">
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="pulse-dot" />
              Fan Community · Est. 2026
            </div>
            <h1 className="hero__title">
              The Alien<br /><span>Collective</span>
            </h1>
            <p className="hero__desc">
              The premier fan community for Alienware enthusiasts. Guides, mods, galleries, and a community that's been building since the original Area-51.
            </p>
            <div className="hero__actions">
              <Link to="/forum" className="btn btn--primary">Enter Forum</Link>
              <Link to="/gallery" className="btn btn--outline">View Gallery</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-bar">
        {[
          ['12,400+', 'Community Members'],
          ['84,000+', 'Forum Posts'],
          ['3,200+', 'Gallery Uploads'],
          ['147', 'Downloads Available'],
        ].map(([num, label]) => (
          <div className="stats-bar__item" key={label}>
            <span className="stats-bar__num">{num}</span>
            <span className="stats-bar__label">{label}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">⬡ What's Here</div>
            <h2 className="section-title">Everything Alienware</h2>
          </div>
          <div className="features">
            {[
              { icon: '💬', title: 'Community Forum', desc: 'Technical guides, troubleshooting, upgrades, and everything in between. Organized by machine category.', link: '/forum', cta: 'Browse Forum' },
              { icon: '🖼️', title: 'Photo Gallery', desc: 'Setups, internals, restorations, and rare finds. Upload your own and show the community your rig.', link: '/gallery', cta: 'View Gallery' },
              { icon: '⬇️', title: 'Software Archive', desc: 'OS restore disks, drivers, utilities, BIOS updates, and legacy software — all archived for preservation.', link: '/downloads', cta: 'Browse Downloads' },
              { icon: '📖', title: 'Hardware History', desc: 'Every Alienware machine from 1996 to today, with full specs and historical context.', link: '/history', cta: 'Explore History' },
              { icon: '🔧', title: 'Repair Guides', desc: 'Community-written step-by-step repair and upgrade guides for every major Alienware model.', link: '/forum', cta: 'Read Guides' },
              { icon: '👥', title: 'User Accounts', desc: 'Create a free account to post, upload, and connect with thousands of fellow Alienware fans.', link: '/login?tab=register', cta: 'Join Free' },
            ].map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-card__icon">{f.icon}</div>
                <div className="feature-card__title">{f.title}</div>
                <p className="feature-card__desc">{f.desc}</p>
                <Link to={f.link} className="btn btn--outline btn--sm">{f.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Threads */}
      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 24 }}>
            <div>
              <div className="section-eyebrow">⬡ Latest Activity</div>
              <h2 className="section-title">Recent Threads</h2>
            </div>
            <Link to="/forum" className="btn btn--outline btn--sm">All Threads →</Link>
          </div>
          <div>
            {threads.map(t => (
              <Link to="/forum" key={t.id} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="thread-row" style={{ background: 'var(--bg3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 10, borderTop: 'none' }}>
                  <span className="thread-row__icon">💬</span>
                  <div className="thread-row__meta">
                    <div className="thread-row__title">{t.title}</div>
                    <div className="thread-row__sub">by {t.author} · {formatDate(t.date)}</div>
                  </div>
                  <div className="thread-row__counts">
                    <div className="thread-count"><strong>{t.views}</strong>views</div>
                    <div className="thread-count"><strong>{t.likes}</strong>likes</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
