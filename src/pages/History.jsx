import { useState } from 'react'

const ERAS = ['All', '1990s', '2000s', '2010s', '2020s']

const HARDWARE = [
  {
    era: '1990s',
    year: '1996',
    machines: [
      { name: 'Area-51', tagline: 'The original alien-themed gaming PC that started it all.', icon: '🛸', color: '#006b1e', specs: [['CPU','Intel Pentium Pro 200MHz'],['RAM','32–64 MB EDO DRAM'],['GPU','3Dfx Voodoo (optional)'],['OS','Windows 95 / NT 4.0'],['Form Factor','Mid-Tower'],['Price','~$2,500 USD']], note: 'The Area-51 was the first product released under the Alienware brand, founded in Miami, FL in 1996 by Nelson Gonzalez and Alex Aguila.' },
    ]
  },
  {
    era: '1990s',
    year: '1999',
    machines: [
      { name: 'Area-51 (1999 Refresh)', tagline: 'Updated for the late-90s gaming scene with upgraded specs.', icon: '🛸', color: '#006b1e', specs: [['CPU','Intel Pentium III 500–800MHz'],['RAM','64–256 MB SDRAM'],['GPU','NVIDIA Riva TNT2 / GeForce 256'],['OS','Windows 98 SE'],['Form Factor','Mid-Tower']] },
    ]
  },
  {
    era: '2000s',
    year: '2001',
    machines: [
      { name: 'Area-51 (2001)', tagline: 'The iconic design era with distinctive alien-themed aesthetics.', icon: '🛸', color: '#006b1e', specs: [['CPU','Intel Pentium 4 1.5–2.0GHz'],['RAM','256 MB – 1 GB RDRAM/DDR'],['GPU','NVIDIA GeForce 3 / ATI Radeon 8500'],['OS','Windows XP'],['Form Factor','Full Tower'],['Special','Alien head front panel']], note: 'The 2001 Area-51 introduced the iconic UFO-shaped logo and alien head styling that defined Alienware\'s brand for years.' },
      { name: 'm7700', tagline: 'Alienware\'s first major gaming laptop — a desktop replacement beast.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Pentium 4-M 2.4GHz'],['RAM','512 MB – 2 GB DDR'],['GPU','NVIDIA GeForce Go 5900'],['Display','17" 1920×1200 UXGA'],['Weight','~4.5 kg'],['OS','Windows XP']], note: 'The m7700 was a desktop replacement laptop that competed with the best desktop systems of its time.' },
    ]
  },
  {
    era: '2000s',
    year: '2005',
    machines: [
      { name: 'Area-51 (2003–2007)', tagline: 'Dell acquisition era — expanded lineup, more mainstream appeal.', icon: '🖥️', color: '#006b1e', specs: [['CPU','Intel Core 2 Duo / Core 2 Extreme'],['RAM','2–8 GB DDR2'],['GPU','NVIDIA 7900 GTX / 8800 GTX'],['OS','Windows Vista'],['PSU','875W proprietary'],['Special','Tri-SLI capable']], note: 'Dell acquired Alienware in 2006 for approximately $60M. The Area-51 continued as a flagship desktop with signature alien styling.' },
      { name: 'm17x (2007)', tagline: 'The first m17x — a legendary powerhouse laptop.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core 2 Duo Extreme X7900'],['RAM','Up to 4 GB DDR2'],['GPU','NVIDIA 8800M GTX (SLI capable)'],['Display','17" 1920×1200'],['Weight','~4.8 kg'],['OS','Windows Vista']], note: 'The m17x became one of the most iconic gaming laptops ever made, known for its dual GPU support and aggressive styling.' },
    ]
  },
  {
    era: '2000s',
    year: '2009',
    machines: [
      { name: 'm11x', tagline: 'The world\'s smallest gaming laptop — still impressive today.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core 2 Duo SU7300 / U7300'],['RAM','Up to 4 GB DDR3'],['GPU','NVIDIA GeForce GT 335M'],['Display','11.6" 1366×768'],['Battery','8-cell, up to 8 hours'],['Weight','~2 kg']], note: 'The m11x was a revolutionary concept — a small form factor laptop that could actually play modern games. It won numerous awards.' },
      { name: 'Aurora ALX', tagline: 'Top-of-the-line desktop with liquid cooling and extreme performance.', icon: '🖥️', color: '#005f8a', blue: true, specs: [['CPU','Intel Core i7 Extreme 975'],['RAM','Up to 12 GB DDR3 Triple-Channel'],['GPU','Dual NVIDIA GTX 295'],['Cooling','Factory liquid cooling'],['Form Factor','Full Tower, 60+ lbs'],['OS','Windows 7']] },
    ]
  },
  {
    era: '2010s',
    year: '2012',
    machines: [
      { name: 'm17x R4', tagline: 'The definitive gaming laptop of its era — the last m17x before the redesign.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core i7-3840QM / 3920XM'],['RAM','Up to 32 GB DDR3'],['GPU','NVIDIA GTX 680M / Dual GPUs via MXM'],['Display','17.3" 1920×1080 120Hz'],['AlienFX','Full RGB zone lighting'],['OS','Windows 7/8']], note: 'The m17x R4 is widely considered the pinnacle of the m-series laptops. It supported two discrete GPUs via MXM slots, a feature no other laptop offered.' },
      { name: 'x51 R1', tagline: 'Console-sized gaming PC — Alienware\'s smallest desktop.', icon: '🖥️', color: '#006b1e', specs: [['CPU','Intel Core i7-2600'],['RAM','Up to 8 GB DDR3'],['GPU','NVIDIA GTX 555 / 560 Ti'],['Form Factor','Console-sized SFF'],['PSU','240W external brick'],['OS','Windows 7/8']], note: 'The x51 was designed to sit next to a TV and compete with gaming consoles, while delivering full PC gaming performance.' },
    ]
  },
  {
    era: '2010s',
    year: '2014',
    machines: [
      { name: 'Aurora R5', tagline: 'New generation Aurora with trident design language.', icon: '🖥️', color: '#006b1e', specs: [['CPU','Intel Core i7-6700K'],['RAM','Up to 64 GB DDR4'],['GPU','NVIDIA GTX 980 / Titan X'],['Form Factor','Trident Mid-Tower'],['AlienFX','Full RGB'],['OS','Windows 10']] },
      { name: 'Alienware 15 R2', tagline: 'Redesigned thin-and-light flagship 15" gaming laptop.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core i7-6700HQ'],['RAM','Up to 16 GB DDR4'],['GPU','NVIDIA GTX 970M / 980M'],['Display','15.6" FHD / QHD'],['Battery','99Wh'],['OS','Windows 10']] },
    ]
  },
  {
    era: '2020s',
    year: '2020',
    machines: [
      { name: 'Aurora R11/R12', tagline: 'Modern Aurora with tool-less design and latest hardware.', icon: '🖥️', color: '#006b1e', specs: [['CPU','Intel Core i9-10900KF / i9-11900KF'],['RAM','Up to 128 GB DDR4'],['GPU','NVIDIA RTX 3090'],['Form Factor','Redesigned Mid-Tower'],['Cooling','Dual 240mm AIO option'],['OS','Windows 10/11']] },
      { name: 'Alienware m17 R4', tagline: 'Flagship 17" laptop with Cherry MX keyboard option.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core i9-10980HK'],['RAM','Up to 32 GB DDR4'],['GPU','NVIDIA RTX 3080'],['Display','17.3" FHD 360Hz / UHD OLED'],['Special','Cherry MX keyboard option'],['OS','Windows 10/11']] },
    ]
  },
  {
    era: '2020s',
    year: '2023',
    machines: [
      { name: 'Aurora R15', tagline: 'Current flagship desktop with RTX 4090 and DDR5 support.', icon: '🖥️', color: '#006b1e', specs: [['CPU','Intel Core i9-13900KF / i9-14900KF'],['RAM','Up to 128 GB DDR5'],['GPU','NVIDIA RTX 4090'],['Form Factor','New Trident Design'],['Cooling','Dual 240mm Liquid Cooling'],['OS','Windows 11']], note: 'The Aurora R15 represents the current pinnacle of Alienware desktop performance, featuring next-gen DDR5 memory and PCIe 5.0 support.' },
      { name: 'Alienware m18', tagline: 'Largest gaming laptop ever — desktop-class performance.', icon: '💻', color: '#8a6000', specs: [['CPU','Intel Core i9-13980HX'],['RAM','Up to 128 GB DDR5'],['GPU','NVIDIA RTX 4090 Laptop'],['Display','18" QHD+ 480Hz'],['Weight','~4.4 kg'],['OS','Windows 11']] },
    ]
  },
]

export default function History() {
  const [era, setEra] = useState('All')
  const [expanded, setExpanded] = useState({})

  const filtered = era === 'All' ? HARDWARE : HARDWARE.filter(h => h.era === era)

  function toggle(key) {
    setExpanded(e => ({ ...e, [key]: !e[key] }))
  }

  return (
    <div className="main-content">
      <div className="page-hero">
        <div className="page-hero__grid" />
        <div className="container">
          <div className="page-hero__content">
            <div className="page-hero__eyebrow">⬡ Machine Archive</div>
            <h1 className="page-hero__title">Hardware History</h1>
            <p className="page-hero__desc">From the original 1996 Area-51 to today — every Alienware machine documented with full specifications.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="era-nav">
            {ERAS.map(e => (
              <button key={e} className={`era-btn${era === e ? ' active' : ''}`} onClick={() => setEra(e)}>{e}</button>
            ))}
          </div>

          <div className="timeline">
            {filtered.map((item, idx) => (
              <div key={item.year + item.era} className="timeline-item">
                <div className="timeline-year">⬡ {item.year}</div>
                {item.machines.map((m, mi) => {
                  const key = `${item.year}-${mi}`
                  const open = expanded[key]
                  return (
                    <div key={key} className={`hw-card${m.blue ? ' hw-card--blue' : ''}`}>
                      <div className="hw-card__header" onClick={() => toggle(key)}>
                        <div className="hw-card__visual" style={{ background: m.color }}>
                          <span>{m.icon}</span>
                        </div>
                        <div className="hw-card__info">
                          <div className="hw-card__name">{m.name}</div>
                          <div className="hw-card__tagline">{m.tagline}</div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                            <span className={`badge ${m.blue ? 'badge--blue' : 'badge--green'}`}>{item.year}</span>
                            <span className="badge badge--dim">{m.specs[0][1].includes('Intel') || m.specs[0][1].includes('AMD') ? 'Desktop' : 'Laptop'}</span>
                          </div>
                        </div>
                        <div style={{ color: 'var(--text-dim)', fontSize: '1.2rem' }}>{open ? '▲' : '▼'}</div>
                      </div>
                      {open && (
                        <div className="hw-card__body">
                          {m.note && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.7, marginTop: 16, padding: '12px 16px', background: 'var(--bg2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--green)' }}>
                              {m.note}
                            </p>
                          )}
                          <table className="hw-specs">
                            <tbody>
                              {m.specs.map(([label, val]) => (
                                <tr key={label}>
                                  <td>{label}</td>
                                  <td>{val}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
