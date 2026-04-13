import { useState, useRef } from 'react'
import { useToast } from '../context/ToastContext.jsx'

const DOWNLOADS = {
  os: {
    icon: '💿',
    name: 'OS Install Disks',
    count: 6,
    items: [
      { name: 'AlienRespawn — Windows XP MCE 2005 Restore Disk', desc: 'Original factory restore image for Alienware systems shipped with Windows XP Media Center Edition 2005. Includes all original Alienware software, AlienFX drivers, and Command Center.', size: '2.4 GB', compat: 'Area-51 (2003–2005), m7700', sha: 'a3f1c8…', date: 'Nov 2023', dl: 8241, featured: true, badges: ['Featured', 'ISO'], filename: 'AlienRespawn_XPMCE2005.iso', search: 'alienrespawn windows xp mce 2005 restore disk area-51' },
      { name: 'Alienware OEM — Windows Vista Home Premium 64-bit', desc: 'Factory OEM restore image for early Aurora and Area-51 machines. Includes Alienware-branded setup, utilities, and all first-party drivers for Vista-era hardware.', size: '3.1 GB', compat: 'Aurora R1, Area-51 (2007)', date: 'Oct 2023', dl: 3102, badges: ['ISO'], filename: 'AW_Vista_HP64.iso', search: 'windows vista alienware oem restore disk aurora r1' },
      { name: 'Alienware OEM — Windows 7 Ultimate 64-bit', desc: 'Factory restore image for Aurora R2/R3, m17x R1/R2, and other Windows 7-era Alienware machines. Includes all OEM drivers and Alienware software suite.', size: '4.2 GB', compat: 'Aurora R2/R3, m17x R1/R2, m15x', sha: 'b9d2e7…', date: 'Sep 2023', dl: 12849, badges: ['ISO', 'Popular'], filename: 'AW_Win7_Ult64.iso', search: 'windows 7 alienware restore disk aurora m17x' },
      { name: 'Alienware OEM — Windows 8.1 64-bit', desc: 'OEM restore disk for Aurora R4/R5 and m17x R3/R4 generation machines. Includes AlienFX 3.x, Command Center 2.x, and all factory drivers.', size: '4.7 GB', compat: 'Aurora R4/R5, m17x R3/R4, 17x', date: 'Aug 2023', dl: 6230, badges: ['ISO'], filename: 'AW_Win81_64.iso', search: 'windows 8 alienware restore aurora r4 r5' },
      { name: 'AlienRespawn 3.2 — Windows 10 1903 OEM', desc: 'AlienRespawn recovery image for Windows 10 era Alienware machines (2015–2018). Includes AWCC 4.x, AlienFX SDK, and Alienware peripherals drivers.', size: '8.1 GB', compat: 'Aurora R7/R8, 15 R2/R3, 17 R4/R5', sha: 'f4a9c2…', date: 'Dec 2023', dl: 21450, featured: true, badges: ['Recommended', 'ISO'], filename: 'AlienRespawn_3.2_Win10.iso', search: 'alienrespawn windows 10 restore disk' },
    ]
  },
  drivers: {
    icon: '⚙️',
    name: 'Drivers & Utilities',
    count: 12,
    items: [
      { name: 'Alienware Command Center (AWCC) 5.3.7', desc: 'The last stable version of AWCC before the Windows 11 22H2 compatibility issues. Recommended by the community for older systems. Includes thermal management, AlienFX, and overclocking controls.', size: '284 MB', compat: 'Win 10 / Win 11 (pre-22H2)', date: 'Jan 2024', dl: 44201, featured: true, badges: ['Latest Stable', 'EXE'], filename: 'AWCC_5.3.7.0_Setup.exe', search: 'alienware command center awcc latest' },
      { name: 'AlienFX SDK Wrapper — Windows 11 Compatible', desc: 'Community-built wrapper that allows AlienFX lighting control on Windows 11 without AWCC. Works with all Alienware peripherals and machines with AlienFX hardware. Open source.', size: '12 MB', compat: 'Windows 11 (all versions)', date: 'Jan 2024', dl: 18930, badges: ['Community Build', 'ZIP'], filename: 'AlienFX_SDK_Wrapper_v2.1.zip', search: 'alienfx sdk driver windows 11 fix wrapper', blue: true },
      { name: 'Alienware Thermal Control Utility', desc: 'Standalone thermal and fan control application. Set custom fan curves, monitor temps in real-time, and switch between performance profiles without AWCC.', size: '8.4 MB', compat: 'm17x, m15x, 15 R2/R3, 17 R4/R5', date: 'Nov 2023', dl: 9820, badges: ['EXE'], filename: 'AW_ThermalCtrl_v3.1.exe', search: 'm17x thermal fan control utility' },
      { name: 'Area-51 R5 BIOS Update A05', desc: 'Final BIOS update for the Area-51 R5. Fixes stability issues with NVMe SSDs and improves RAM compatibility with higher-speed kits. Flash from within Windows.', size: '2.1 MB', compat: 'Area-51 R5 only', date: 'N/A', dl: 2341, badges: ['BIOS', 'EXE'], filename: 'Area51_R5_BIOS_A05.exe', search: 'area-51 aurora bios update flash', bios: true },
      { name: 'Alienware OEM NVIDIA Driver Pack (Legacy)', desc: 'Collection of Alienware OEM NVIDIA driver packages for legacy machines. Covers GTX 400/500/600/700/900 series. These include Alienware-specific optimizations not in standard NVIDIA drivers.', size: '1.8 GB', compat: 'Multiple models — see README', date: 'Sep 2023', dl: 7120, badges: ['ZIP'], filename: 'AW_NVIDIA_Legacy_Pack.zip', search: 'alienware aurora graphics driver nvidia' },
    ]
  },
  software: {
    icon: '🛠️',
    name: 'Software & Tools',
    count: 8,
    items: [
      { name: 'AlienFX SDK v4.2 — Developer Kit', desc: 'Official AlienFX SDK for developers. Build custom lighting effects and integrations. Includes C++ headers, sample code, and the legacy v2 compatibility layer.', size: '45 MB', compat: 'Windows 7/8/10/11', date: 'Dec 2023', dl: 5480, badges: ['SDK', 'ZIP'], filename: 'AlienFX_SDK_v4.2.zip', search: 'alienfx sdk developer api', blue: true },
      { name: 'Alienware Hardware Diagnostics Tool', desc: 'Standalone diagnostic utility to test all hardware components on Alienware machines. Tests GPU, CPU, RAM, storage, battery, display, and Alien-specific controllers. Works offline.', size: '22 MB', compat: 'All Alienware (2006+)', date: 'Jan 2024', dl: 14790, badges: ['Free', 'EXE'], filename: 'AW_Diagnostics_v2.4.exe', search: 'alienware m17x diagnostics hardware test' },
      { name: 'Alienware OC Controls — Legacy Edition', desc: 'Overclock utility for older Area-51 and Aurora machines with unlocked multipliers. Control CPU/GPU/RAM overclocking through a simple interface. Community-maintained.', size: '4.1 MB', compat: 'Area-51 R1–R4, Aurora R1–R4', date: 'N/A', dl: 3210, badges: ['Legacy', 'EXE'], filename: 'AW_OC_Legacy_v1.7.exe', search: 'alienware overclocking oc utility area-51 aurora', expert: true },
    ]
  },
  manuals: {
    icon: '📄',
    name: 'Service Manuals & Documentation',
    count: 9,
    items: [
      { name: 'm17x R1–R4 Complete Service Manual', desc: 'Official Dell service manuals for all m17x revisions (R1 through R4). Covers full disassembly, FRU part numbers, diagnostic codes, and schematics.', size: '48 MB', compat: 'm17x R1, R2, R3, R4', date: 'Nov 2023', dl: 11240, badges: ['PDF', 'Free'], filename: 'm17x_ServiceManual_R1-R4.pdf', search: 'service manual m17x repair disassembly' },
      { name: 'Area-51 R3–R7 Service Manual Collection', desc: 'Full service documentation for Area-51 desktop platforms from R3 through R7. Includes cooling system diagrams, cable routing, and PSU specifications.', size: '92 MB', compat: 'Area-51 R3–R7', date: 'Oct 2023', dl: 8450, badges: ['PDF'], filename: 'Area51_R3-R7_ServiceManual.pdf', search: 'area-51 desktop service manual repair' },
    ]
  }
}

const BADGE_CLASS = { 'Featured': 'badge--green', 'Recommended': 'badge--green', 'Latest Stable': 'badge--green', 'Free': 'badge--green', 'Popular': 'badge--blue', 'Community Build': 'badge--blue', 'SDK': 'badge--blue', 'Legacy': 'badge--yellow', 'BIOS': 'badge--yellow', 'ISO': 'badge--dim', 'EXE': 'badge--dim', 'ZIP': 'badge--dim', 'PDF': 'badge--dim' }

export default function Downloads() {
  const [query, setQuery] = useState('')
  const [dlModal, setDlModal] = useState(null)
  const [progress, setProgress] = useState(0)
  const [dlLabel, setDlLabel] = useState('')
  const [dlDone, setDlDone] = useState(false)
  const timerRef = useRef(null)
  const { toast } = useToast()

  function startDownload(filename, size) {
    setDlModal({ filename, size })
    setProgress(0)
    setDlLabel('Preparing download...')
    setDlDone(false)

    const steps = [[20,'Verifying file integrity...'],[45,'Connecting to mirror...'],[70,'Downloading...'],[90,'Verifying checksum...'],[100,'Download complete!']]
    let prog = 0
    let stepIdx = 0

    timerRef.current = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearInterval(timerRef.current)
        setDlDone(true)
        toast(`${filename} downloaded!`, 'success')
        return
      }
      const [target, msg] = steps[stepIdx]
      prog = Math.min(prog + 4, target)
      setProgress(prog)
      setDlLabel(msg)
      if (prog >= target) stepIdx++
    }, 80)
  }

  function cancelDl() {
    clearInterval(timerRef.current)
    setDlModal(null)
  }

  const q = query.toLowerCase()

  function visible(item) {
    if (!q) return true
    return (item.search + item.name + item.desc + item.compat).toLowerCase().includes(q)
  }

  return (
    <div className="main-content">
      <div className="page-hero">
        <div className="page-hero__grid" />
        <div className="container">
          <div className="page-hero__content">
            <div className="page-hero__eyebrow">⬡ Software Archive</div>
            <h1 className="page-hero__title">Downloads</h1>
            <p className="page-hero__desc">OS install disks, drivers, utilities, BIOS updates, and legacy software for all Alienware machines.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="search-bar">
            <input className="search-bar__input" type="text" placeholder="Search downloads by name, model, or OS..." value={query} onChange={e => setQuery(e.target.value)} />
            <span className="search-bar__icon">🔍</span>
          </div>

          <div className="warning-banner">
            <span className="warning-banner__icon">⚠️</span>
            <div className="warning-banner__text">
              <strong>Important Notice:</strong> All software provided here is archived community-sourced content for preservation purposes. Always verify checksums before installing. Some files may be links to third-party community archives. This site is not affiliated with Dell or Alienware.
            </div>
          </div>

          <div className="downloads-layout">
            <div>
              {Object.entries(DOWNLOADS).map(([key, section]) => {
                const visibleItems = section.items.filter(visible)
                if (q && visibleItems.length === 0) return null
                return (
                  <div key={key} className="dl-section">
                    <div className="dl-section__title">
                      <span className="dl-section__icon">{section.icon}</span>
                      <div className="dl-section__name">{section.name}</div>
                      <div className="dl-section__count">{section.count} files</div>
                    </div>
                    {(q ? visibleItems : section.items).map(item => (
                      <div key={item.filename} className={`dl-card${item.featured ? ' dl-card--featured' : ''}`}>
                        <div className="dl-card__icon">
                          {item.badges[0] === 'PDF' ? '📄' : item.badges[0] === 'EXE' ? '⚙️' : item.badges[0] === 'ZIP' ? '📦' : section.icon}
                        </div>
                        <div className="dl-card__info">
                          <div className="dl-card__header">
                            <div className="dl-card__name">{item.name}</div>
                            <div className="dl-card__badges">
                              {item.badges.map(b => <span key={b} className={`badge ${BADGE_CLASS[b] || 'badge--dim'}`}>{b}</span>)}
                            </div>
                          </div>
                          <div className="dl-card__desc">{item.desc}</div>
                          <div className="dl-card__meta">
                            <div className="dl-meta-item">📦 <strong>{item.size}</strong></div>
                            <div className="dl-meta-item">🖥️ <strong>{item.compat}</strong></div>
                            {item.sha && <div className="dl-meta-item">🔐 SHA256: <strong>{item.sha}</strong></div>}
                            {item.date !== 'N/A' && <div className="dl-meta-item">📅 <strong>{item.date}</strong></div>}
                            {item.bios && <div className="dl-meta-item" style={{ color: 'var(--yellow)' }}>⚠️ <strong>Flash at your own risk</strong></div>}
                            {item.expert && <div className="dl-meta-item" style={{ color: 'var(--yellow)' }}>⚠️ <strong>Expert use only</strong></div>}
                          </div>
                        </div>
                        <div className="dl-card__actions">
                          <button className={`btn btn--sm ${item.featured ? 'btn--primary' : item.blue ? 'btn--outline-blue' : 'btn--outline'}`}
                            onClick={() => startDownload(item.filename, item.size)}>
                            ⬇ Download
                          </button>
                          <div className="dl-count"><strong>{item.dl.toLocaleString()}</strong>downloads</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })}
              {q && !Object.values(DOWNLOADS).some(s => s.items.some(visible)) && (
                <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</div>
                  <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem' }}>No downloads found matching your search.</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="dl-sidebar">
              <div className="dl-sidebar-widget">
                <div className="dl-sidebar-widget__title">📊 Download Stats</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['Total Files','147'],['Total Downloads','284K+'],['Archive Size','~620 GB']].map(([l,v]) => (
                    <div key={l} className="flex-between" style={{ fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{l}</span>
                      <span style={{ color: 'var(--green)', fontFamily: "'Orbitron', sans-serif", fontSize: '0.8rem' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dl-sidebar-widget">
                <div className="dl-sidebar-widget__title">🏷️ Filter by Model</div>
                <div>
                  {['area-51','aurora','m17x','m15x','x51','alienware 15','alienware 17','m11x'].map(m => (
                    <button key={m} className={`compat-tag${query === m ? ' active' : ''}`} onClick={() => setQuery(query === m ? '' : m)}>
                      {m === 'alienware 15' ? 'AW15' : m === 'alienware 17' ? 'AW17' : m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="dl-sidebar-widget">
                <div className="dl-sidebar-widget__title">🔽 Filter by OS</div>
                <div>
                  {[['windows xp','Windows XP'],['windows vista','Vista'],['windows 7','Windows 7'],['windows 8','Windows 8'],['windows 10','Windows 10'],['windows 11','Windows 11']].map(([val,label]) => (
                    <button key={val} className={`compat-tag${query === val ? ' active' : ''}`} onClick={() => setQuery(query === val ? '' : val)}>{label}</button>
                  ))}
                </div>
              </div>

              <div className="dl-sidebar-widget">
                <div className="dl-sidebar-widget__title">📥 Top Downloads</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[['AlienRespawn 3.2', 21450, 48],['AWCC 5.3.7', 44201, 100],['Win7 OEM Restore', 12849, 29]].map(([name, dl, pct]) => (
                    <div key={name} style={{ fontSize: '0.85rem' }}>
                      <div style={{ color: 'var(--text)' }}>{name}</div>
                      <div className="progress-bar mt-8"><div className="progress-bar__fill" style={{ width: `${pct}%` }} /></div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{dl.toLocaleString()} downloads</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dl-sidebar-widget" style={{ borderColor: 'rgba(0,255,65,0.3)' }}>
                <div className="dl-sidebar-widget__title">📤 Submit a File</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.6 }}>Have a driver, utility, or document we're missing? Submit it to the archive.</p>
                <a href="/forum" className="btn btn--outline btn--sm" style={{ width: '100%', justifyContent: 'center' }}>Post in Forum →</a>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Download progress modal */}
      {dlModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal__header">
              <div className="modal__title">DOWNLOAD</div>
            </div>
            <div className="modal__body">
              <div className="dl-progress">
                <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '0.9rem', color: 'var(--text-bright)', marginBottom: 4 }}>{dlModal.filename}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: 16 }}>{dlModal.size}</div>
                <div className="dl-progress__bar">
                  <div className="dl-progress__fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="dl-progress__label">{dlLabel}</div>
                <div style={{ marginTop: 20, fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--yellow)' }}>⚠ Note:</strong> This is a fan archive site. Downloads are linked to community-maintained mirrors. Verify file checksums before installing.
                </div>
              </div>
            </div>
            <div className="modal__footer">
              {!dlDone && <button className="btn btn--ghost" onClick={cancelDl}>Cancel</button>}
              {dlDone && <button className="btn btn--primary" onClick={() => setDlModal(null)}>Done</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
