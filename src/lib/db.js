/* ── localStorage helpers for forum & gallery ── */

const THREADS_KEY = 'aw_threads'
const GALLERY_KEY = 'aw_gallery'

/* ── Forum ── */
export const SEED_THREADS = [
  { id:1, cat:'desktops', title:'Area-51 R5 — full PSU replacement walkthrough [GUIDE]', author:'AlienFan92', body:`<p>After months of sourcing parts, I finally completed my Area-51 R5 PSU swap. The stock 875W PSU was failing so I replaced it with a Seasonic Focus GX-850.</p><p><strong>Tools needed:</strong> T10 Torx, Phillips #2, Zip ties, SATA adapter.</p><p>The main challenge is the proprietary Alienware power connector. You'll need the <code>AWPSU-24pin-adapter</code> cable — links in the downloads section.</p>`, date:'2024-01-15T10:30:00', replies:[], views:1200, likes:47, tags:['Area-51','Guide'] },
  { id:2, cat:'desktops', title:'Aurora R7 — GPU support bracket snapped, anyone have a fix?', author:'VoidwalkerX', body:`<p>The GPU support bracket on my Aurora R7 snapped clean off. Has anyone found a replacement or a 3D printable bracket that fits? The GPU is sagging noticeably.</p>`, date:'2024-01-15T06:00:00', replies:[], views:312, likes:9, tags:['Aurora','GPU'] },
  { id:3, cat:'laptops', title:'m17x R4 — definitive thermal repaste guide (drop 30°C)', author:'RetroRig', body:`<p>The m17x R4 runs hot out of the box. I've done this on 6 units and consistently see a 25–35°C drop.</p><p><strong>What you'll need:</strong> Thermal Grizzly Kryonaut, T5/T8 Torx, IPA 99%, lint-free cloth.</p><p><strong>Results:</strong> GPU idle 48°C → 41°C | GPU load 97°C → 68°C ✅</p>`, date:'2024-01-15T08:00:00', replies:[], views:3400, likes:128, tags:['m17x','Thermal'] },
  { id:4, cat:'software', title:'AlienFX broken on Windows 11 — community fix', author:'SpaceCadet77', body:`<p>AlienFX stopped working after Windows 11 22H2. Here's the reliable fix:</p><ol><li>Uninstall current AWCC</li><li>Run <code>sc delete AWCCService</code> in admin CMD</li><li>Download AWCC 5.3.7 from our downloads page</li><li>Install, restart ✅</li></ol>`, date:'2024-01-14T15:00:00', replies:[], views:5200, likes:203, tags:['AlienFX','Software','Windows 11'] },
  { id:5, cat:'showcase', title:"My 2003 Area-51 restoration diary — 6 months in the making", author:'DeltaForce', body:`<p>I picked this up at an estate sale for $40. Completely dead — bad CMOS battery, failed HDD, incompatible RAM. Six months later it's fully restored and running Windows XP MCE 2005.</p><p>Check my gallery for the full photo documentation. 🎉</p>`, date:'2024-01-13T12:00:00', replies:[], views:6700, likes:312, tags:['Area-51','Showcase','Restoration'] },
]

export function getThreads() {
  const stored = localStorage.getItem(THREADS_KEY)
  if (!stored) { localStorage.setItem(THREADS_KEY, JSON.stringify(SEED_THREADS)); return SEED_THREADS }
  return JSON.parse(stored)
}

export function saveThreads(threads) { localStorage.setItem(THREADS_KEY, JSON.stringify(threads)) }

/* ── Gallery ── */
export const SEED_GALLERY = [
  { id:1, title:'Area-51 R5 PSU Transplant', desc:'Replaced the failing stock PSU with a Seasonic Focus GX-850.', cat:'internals', author:'AlienFan92', date:'2024-01-15T10:00:00', likes:47, color:'#006b1e', icon:'🖥️', label:'AREA-51 R5 · INTERNALS', image:'/images/LucyxCrystal.jpeg' },
  { id:2, title:'My 2003 Area-51 Restored', desc:'Six months of restoration work. Original green LEDs, Windows XP MCE 2005.', cat:'desktops', author:'DeltaForce', date:'2024-01-14T12:00:00', likes:312, color:'#005f8a', icon:'🏆', label:'2003 AREA-51 · RESTORED' },
  { id:3, title:'Dual-GPU Battle Station', desc:'Aurora R7 with twin RTX 4090s. Custom AlienFX theme took 3 weeks.', cat:'stations', author:'NeonCrawler', date:'2024-01-13T09:00:00', likes:228, color:'#6600aa', icon:'⚡', label:'AURORA R7 · BATTLE STATION' },
  { id:4, title:'m17x R4 After Repaste', desc:'GPU dropped from 97°C to 68°C under load.', cat:'internals', author:'RetroRig', date:'2024-01-12T15:00:00', likes:88, color:'#8a6000', icon:'🌡️', label:'m17x R4 · THERMAL' },
  { id:5, title:'x51 R3 with GTX 1650 Super', desc:'Custom bracket fab required to fit in the tiny chassis.', cat:'desktops', author:'XenonBuilder', date:'2024-01-11T11:00:00', likes:156, color:'#006b1e', icon:'🔧', label:'x51 R3 · MOD' },
  { id:6, title:'Rare Area-51 m15x Prototype', desc:'Pre-production unit with different hinge mechanism. Found at estate sale.', cat:'rare', author:'VintageVault', date:'2024-01-10T14:00:00', likes:441, color:'#8a3000', icon:'🦄', label:'m15x PROTOTYPE · RARE' },
  { id:7, title:'Alienware 17 R4 Full Teardown', desc:'Complete disassembly for LCD replacement. All 63 screws mapped.', cat:'internals', author:'ByteSmith', date:'2024-01-09T08:00:00', likes:67, color:'#005f8a', icon:'🔩', label:'AW17 R4 · TEARDOWN' },
  { id:8, title:'Collection: 2001–2015 Laptops', desc:'14 machines spanning 14 years of Alienware laptops.', cat:'rare', author:'VintageVault', date:'2024-01-08T16:00:00', likes:389, color:'#006b1e', icon:'📚', label:'COLLECTION · 14 UNITS' },
  { id:9, title:'Aurora R3 Water Cooling Mod', desc:'Custom loop dropped temps 45°C. Required significant case modification.', cat:'desktops', author:'GreenMachine99', date:'2024-01-07T10:00:00', likes:203, color:'#005f8a', icon:'💧', label:'AURORA R3 · WATER COOL' },
  { id:10, title:'Alienware 13 OLED Edition', desc:'One of only 500 units made with the OLED display.', cat:'laptops', author:'SpaceCadet77', date:'2024-01-06T12:00:00', likes:177, color:'#6600aa', icon:'✨', label:'AW13 OLED · SPECIAL EDITION' },
  { id:11, title:'Ultimate Battle Station 2024', desc:'Aurora R15 + two 27" QD-OLED displays. Full Alienware peripherals.', cat:'stations', author:'AlienFan92', date:'2024-01-05T09:00:00', likes:521, color:'#006b1e', icon:'🖥️', label:'AURORA R15 · STATION' },
  { id:12, title:"m11x — World's Smallest Gaming Laptop", desc:'Still runs surprisingly well with an SSD upgrade.', cat:'laptops', author:'RetroRig', date:'2024-01-04T14:00:00', likes:298, color:'#8a6000', icon:'🎮', label:'m11x · CLASSIC' },
]

export function getGallery() {
  const stored = localStorage.getItem(GALLERY_KEY)
  if (!stored) { localStorage.setItem(GALLERY_KEY, JSON.stringify(SEED_GALLERY)); return SEED_GALLERY }
  const data = JSON.parse(stored)
  // Merge seed images (URL paths) into stored items — lets you add images to
  // seed entries without requiring the user to clear localStorage.
  const seedImages = Object.fromEntries(SEED_GALLERY.map(s => [s.id, s.image]))
  return data.map(item => ({ ...item, image: item.image ?? seedImages[item.id] ?? null }))
}

export function saveGallery(items) { localStorage.setItem(GALLERY_KEY, JSON.stringify(items)) }

/* ── Formatting ── */
export function formatDate(iso) {
  const d    = new Date(iso)
  const diff = Date.now() - d
  if (diff < 60000)     return 'Just now'
  if (diff < 3600000)   return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000)  return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
