import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Copy, Eye, EyeOff, Check, MoreVertical, Pencil, Trash2, Plus,
  Lock, Globe, Shield, CreditCard, Mail, Wifi, ChevronDown, ChevronUp,
  X, KeyRound, List, SlidersHorizontal, Settings, Timer, RefreshCw,
  ChevronRight, Download, Upload, Smartphone, FolderPlus, Folder,
  Star, Heart, Zap, Home, Briefcase, ShoppingCart, Camera, Music,
  BookOpen, Car, Coffee, Gamepad2, Plane, Sun, GripVertical,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────
interface PasswordEntry {
  id: number
  site: string
  login: string
  password: string
  groupId: string
}

interface Group {
  id: string
  name: string
  icon: string
  accent: string
  parentId?: string
}

// ─── Available icons for groups ─────────────────────────────────────────────
const AVAILABLE_ICONS: { name: string; component: React.ElementType }[] = [
  { name: "Globe", component: Globe },
  { name: "Mail", component: Mail },
  { name: "CreditCard", component: CreditCard },
  { name: "Shield", component: Shield },
  { name: "Lock", component: Lock },
  { name: "Wifi", component: Wifi },
  { name: "Star", component: Star },
  { name: "Heart", component: Heart },
  { name: "Zap", component: Zap },
  { name: "Home", component: Home },
  { name: "Briefcase", component: Briefcase },
  { name: "ShoppingCart", component: ShoppingCart },
  { name: "Camera", component: Camera },
  { name: "Music", component: Music },
  { name: "BookOpen", component: BookOpen },
  { name: "Car", component: Car },
  { name: "Coffee", component: Coffee },
  { name: "Gamepad2", component: Gamepad2 },
  { name: "Plane", component: Plane },
  { name: "Sun", component: Sun },
  { name: "Folder", component: Folder },
  { name: "KeyRound", component: KeyRound },
]

const AVAILABLE_ACCENTS = [
  "rgba(147,51,234,0.85)",
  "rgba(59,130,246,0.85)",
  "rgba(16,185,129,0.85)",
  "rgba(249,115,22,0.85)",
  "rgba(239,68,68,0.85)",
  "rgba(236,72,153,0.85)",
  "rgba(139,92,246,0.85)",
  "rgba(20,184,166,0.85)",
  "rgba(100,116,139,0.85)",
  "rgba(234,179,8,0.85)",
]

const LOCK_TIMES = [
  { label: "1 минута", value: 1 },
  { label: "5 минут", value: 5 },
  { label: "15 минут", value: 15 },
  { label: "30 минут", value: 30 },
  { label: "1 час", value: 60 },
  { label: "Никогда", value: 0 },
]

// ─── Initial data ────────────────────────────────────────────────────────────
const initialGroups: Group[] = [
  { id: "social", name: "Соцсети", icon: "Globe", accent: "rgba(147,51,234,0.85)" },
  { id: "mail", name: "Почта", icon: "Mail", accent: "rgba(59,130,246,0.85)" },
  { id: "finance", name: "Финансы", icon: "CreditCard", accent: "rgba(16,185,129,0.85)" },
  { id: "work", name: "Работа", icon: "Briefcase", accent: "rgba(249,115,22,0.85)" },
  { id: "net", name: "Сети", icon: "Wifi", accent: "rgba(139,92,246,0.85)" },
  { id: "other", name: "Прочее", icon: "Lock", accent: "rgba(100,116,139,0.85)" },
]

const initialPasswords: PasswordEntry[] = [
  { id: 1, site: "instagram.com", login: "user@mail.ru", password: "Insta$ecure99", groupId: "social" },
  { id: 2, site: "vk.com", login: "vkuser123", password: "VkP@ss2024!", groupId: "social" },
  { id: 3, site: "gmail.com", login: "mymail@gmail.com", password: "GmailStr0ng#", groupId: "mail" },
  { id: 4, site: "yandex.ru", login: "ya.user@ya.ru", password: "YaP@ssword1!", groupId: "mail" },
  { id: 5, site: "sberbank.ru", login: "79001234567", password: "Sber$afe2024", groupId: "finance" },
  { id: 6, site: "tinkoff.ru", login: "tinkoff@mail.ru", password: "T!nk0ffBank", groupId: "finance" },
  { id: 7, site: "slack.com", login: "work.user@corp.com", password: "Sl@ckWork99", groupId: "work" },
  { id: 8, site: "wi-fi домашний", login: "HomeNet", password: "H0meW1fi#Safe", groupId: "net" },
]

// ─── Styles ──────────────────────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.95), 0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
  border: "1px solid rgba(255,255,255,0.65)",
  borderRadius: "16px",
}

const glassModal: React.CSSProperties = {
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(50px) saturate(200%)",
  WebkitBackdropFilter: "blur(50px) saturate(200%)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.95), 0 8px 40px rgba(0,0,0,0.10), 0 32px 80px rgba(0,0,0,0.10)",
  border: "1px solid rgba(255,255,255,0.7)",
}

const glassBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.95), 0 2px 6px rgba(0,0,0,0.05)",
}

const glassInput: React.CSSProperties = {
  background: "rgba(248,250,252,0.85)",
  border: "1px solid rgba(226,232,240,0.8)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
  outline: "none",
  borderRadius: "11px",
  padding: "9px 13px",
  fontSize: "13px",
  color: "#1e293b",
  width: "100%",
}

type ViewMode = "manager" | "simple"

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getIconComponent(name: string): React.ElementType {
  return AVAILABLE_ICONS.find(i => i.name === name)?.component || Folder
}

// ─── Copy Button ─────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <motion.button onClick={copy} style={glassBtn}
      className="rounded-[10px] p-1.5 text-gray-400 hover:text-gray-700 transition-colors shrink-0"
      whileTap={{ scale: 0.9 }}>
      <AnimatePresence mode="wait" initial={false}>
        {copied
          ? <motion.span key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} /></motion.span>
          : <motion.span key="d" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy className="h-3 w-3" strokeWidth={2} /></motion.span>}
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Password Card ────────────────────────────────────────────────────────────
function PasswordCard({ entry, viewMode, onDelete }: {
  entry: PasswordEntry; viewMode: ViewMode; onDelete: (id: number) => void
}) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const showPw = viewMode === "simple" || visible

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={glassCard} className="px-3.5 py-2.5 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />

      <div className="relative flex items-center justify-between gap-2">
        {/* Fields compact */}
        <div className="flex-1 min-w-0 grid grid-cols-[52px_1fr_auto] gap-x-2 gap-y-1 items-center">
          {/* Site */}
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Сайт</span>
          <span className="text-[12px] font-semibold text-gray-800 truncate">{entry.site}</span>
          <CopyButton text={entry.site} />
          {/* Login */}
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Логин</span>
          <span className="text-[12px] text-gray-600 truncate">{entry.login}</span>
          <CopyButton text={entry.login} />
          {/* Password */}
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Пароль</span>
          <span className="text-[12px] font-mono text-gray-700 truncate">
            {showPw ? entry.password : "•".repeat(Math.min(entry.password.length, 10))}
          </span>
          <div className="flex items-center gap-1">
            {viewMode === "manager" && (
              <motion.button onClick={() => setVisible(!visible)} style={glassBtn}
                className="rounded-[10px] p-1.5 text-gray-400 hover:text-gray-700 transition-colors" whileTap={{ scale: 0.9 }}>
                {visible ? <EyeOff className="h-3 w-3" strokeWidth={2} /> : <Eye className="h-3 w-3" strokeWidth={2} />}
              </motion.button>
            )}
            <CopyButton text={entry.password} />
          </div>
        </div>

        {/* Menu */}
        <div className="relative self-start" ref={menuRef}>
          <motion.button onClick={() => setMenuOpen(!menuOpen)} style={glassBtn}
            className="rounded-[10px] p-1.5 text-gray-400 hover:text-gray-700 transition-colors" whileTap={{ scale: 0.9 }}>
            <MoreVertical className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)" }}
                className="absolute right-0 top-8 z-50 rounded-[14px] py-1.5 min-w-[150px] overflow-hidden">
                <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-white/60 transition-colors">
                  <Pencil className="h-3 w-3 text-blue-500" strokeWidth={2} />Редактировать
                </button>
                <div className="mx-3 my-1 h-px bg-gray-200/60" />
                <button onClick={() => { onDelete(entry.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] text-red-500 hover:bg-red-50/60 transition-colors">
                  <Trash2 className="h-3 w-3" strokeWidth={2} />Удалить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Group Section ────────────────────────────────────────────────────────────
function GroupSection({ group, entries, viewMode, subgroups, allEntries, onDelete }: {
  group: Group; entries: PasswordEntry[]; viewMode: ViewMode
  subgroups: Group[]; allEntries: PasswordEntry[]; onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(true)
  const Icon = getIconComponent(group.icon)

  return (
    <motion.div layout className="space-y-1.5">
      <motion.button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-[13px]"
        style={{ background: `${group.accent.replace("0.85", "0.12")}`,
          border: `1px solid ${group.accent.replace("0.85", "0.2")}`,
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8)" }}
        whileTap={{ scale: 0.98 }}>
        <div className="flex h-6 w-6 items-center justify-center rounded-[8px] shrink-0"
          style={{ background: "rgba(255,255,255,0.85)", boxShadow: "inset 0 1px 1px rgba(255,255,255,1), 0 1px 4px rgba(0,0,0,0.06)" }}>
          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} style={{ color: group.accent.replace("0.85", "1") }} />
        </div>
        <span className="flex-1 text-left text-[13px] font-semibold text-gray-800">{group.name}</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.7)", color: "#6b7280" }}>
          {entries.length + subgroups.reduce((acc, sg) => acc + allEntries.filter(e => e.groupId === sg.id).length, 0)}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-1.5 pl-3 overflow-hidden">
            {entries.map(e => <PasswordCard key={e.id} entry={e} viewMode={viewMode} onDelete={onDelete} />)}
            {/* Subgroups */}
            {subgroups.map(sg => {
              const subEntries = allEntries.filter(e => e.groupId === sg.id)
              const SubIcon = getIconComponent(sg.icon)
              return (
                <div key={sg.id} className="space-y-1.5">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="h-px flex-1" style={{ background: `${sg.accent.replace("0.85", "0.2")}` }} />
                    <div className="flex items-center gap-1.5">
                      <SubIcon className="h-3 w-3" strokeWidth={2} style={{ color: sg.accent.replace("0.85", "0.8") }} />
                      <span className="text-[11px] font-semibold text-gray-500">{sg.name}</span>
                      <span className="text-[10px] text-gray-400">({subEntries.length})</span>
                    </div>
                    <div className="h-px flex-1" style={{ background: `${sg.accent.replace("0.85", "0.2")}` }} />
                  </div>
                  <div className="space-y-1.5 pl-2">
                    {subEntries.map(e => <PasswordCard key={e.id} entry={e} viewMode={viewMode} onDelete={onDelete} />)}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Add Entry Modal ──────────────────────────────────────────────────────────
function AddEntryModal({ onClose, onAdd, groups, defaultGroupId }: {
  onClose: () => void; onAdd: (e: Omit<PasswordEntry, "id">) => void
  groups: Group[]; defaultGroupId: string
}) {
  const [site, setSite] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [groupId, setGroupId] = useState(defaultGroupId === "all" ? (groups[0]?.id || "") : defaultGroupId)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")

  const generate = () => {
    const c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    setPassword(Array.from({ length: 16 }, () => c[Math.floor(Math.random() * c.length)]).join(""))
  }

  const submit = () => {
    if (!site.trim()) { setError("Введите сайт или название"); return }
    if (!login.trim()) { setError("Введите логин"); return }
    if (!password.trim()) { setError("Введите пароль"); return }
    onAdd({ site: site.trim(), login: login.trim(), password: password.trim(), groupId })
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />
      <motion.div style={{ ...glassModal, borderRadius: "24px" }} className="relative w-full max-w-[420px] p-5 z-10"
        initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}>
        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "24px 24px 0 0" }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px]"
                style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))", boxShadow: "0 4px 12px rgba(147,51,234,0.28)" }}>
                <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">Новая запись</h2>
                <p className="text-[11px] text-gray-500">Заполните данные</p>
              </div>
            </div>
            <motion.button onClick={onClose} style={glassBtn} className="rounded-[10px] p-1.5 text-gray-500" whileTap={{ scale: 0.9 }}>
              <X className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Сайт / Название</label>
              <input style={glassInput} value={site} onChange={e => { setSite(e.target.value); setError("") }} placeholder="instagram.com" autoFocus />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Логин / Email</label>
              <input style={glassInput} value={login} onChange={e => { setLogin(e.target.value); setError("") }} placeholder="user@mail.ru" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Пароль</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input style={{ ...glassInput, paddingRight: "36px" }} type={showPw ? "text" : "password"}
                    value={password} onChange={e => { setPassword(e.target.value); setError("") }} placeholder="••••••••••••" />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    {showPw ? <EyeOff className="h-3.5 w-3.5" strokeWidth={2} /> : <Eye className="h-3.5 w-3.5" strokeWidth={2} />}
                  </button>
                </div>
                <motion.button onClick={generate} style={glassBtn}
                  className="flex items-center gap-1 rounded-[11px] px-2.5 text-[11px] font-medium text-gray-600 shrink-0" whileTap={{ scale: 0.95 }}>
                  <RefreshCw className="h-3 w-3" strokeWidth={2} />Создать
                </motion.button>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Группа</label>
              <div className="flex flex-wrap gap-1.5">
                {groups.map(g => {
                  const Icon = getIconComponent(g.icon)
                  const isSel = groupId === g.id
                  return (
                    <motion.button key={g.id} onClick={() => setGroupId(g.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-[9px] text-[11px] font-semibold"
                      style={isSel ? { background: g.accent, color: "white", boxShadow: `0 3px 8px ${g.accent.replace("0.85","0.3")}` } : { background: "rgba(241,245,249,0.8)", color: "#6b7280" }}
                      whileTap={{ scale: 0.95 }}>
                      <Icon className="h-3 w-3" strokeWidth={2} />{g.name}
                    </motion.button>
                  )
                })}
              </div>
            </div>
            <AnimatePresence>
              {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-[11px] text-red-500 font-medium">{error}</motion.p>}
            </AnimatePresence>
            <motion.button onClick={submit}
              className="w-full py-2.5 rounded-[13px] text-white text-[13px] font-bold"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))", boxShadow: "0 4px 16px rgba(147,51,234,0.28)" }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Сохранить запись
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Group Editor Modal ───────────────────────────────────────────────────────
function GroupEditorModal({ group, groups, onClose, onSave, onDelete }: {
  group?: Group; groups: Group[]
  onClose: () => void
  onSave: (g: Group) => void
  onDelete?: (id: string) => void
}) {
  const isNew = !group
  const parentGroups = groups.filter(g => !g.parentId)
  const [name, setName] = useState(group?.name || "")
  const [icon, setIcon] = useState(group?.icon || "Folder")
  const [accent, setAccent] = useState(group?.accent || AVAILABLE_ACCENTS[0])
  const [parentId, setParentId] = useState(group?.parentId || "")

  const save = () => {
    if (!name.trim()) return
    onSave({
      id: group?.id || `group_${Date.now()}`,
      name: name.trim(),
      icon,
      accent,
      parentId: parentId || undefined,
    })
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />
      <motion.div style={{ ...glassModal, borderRadius: "24px" }} className="relative w-full max-w-[400px] p-5 z-10"
        initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}>
        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "24px 24px 0 0" }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              {/* Preview */}
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px]"
                style={{ background: accent, boxShadow: `0 4px 12px ${accent.replace("0.85","0.3")}` }}>
                {(() => { const I = getIconComponent(icon); return <I className="h-4 w-4 text-white" strokeWidth={2} /> })()}
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">{isNew ? "Новая группа" : "Изменить группу"}</h2>
                <p className="text-[11px] text-gray-500">Настройте внешний вид</p>
              </div>
            </div>
            <motion.button onClick={onClose} style={glassBtn} className="rounded-[10px] p-1.5 text-gray-500" whileTap={{ scale: 0.9 }}>
              <X className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Название</label>
              <input style={glassInput} value={name} onChange={e => setName(e.target.value)} placeholder="Название группы" autoFocus />
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Иконка</label>
              <div className="grid grid-cols-8 gap-1.5">
                {AVAILABLE_ICONS.map(({ name: n, component: Ic }) => (
                  <motion.button key={n} onClick={() => setIcon(n)}
                    className="flex h-8 w-8 items-center justify-center rounded-[9px] transition-all"
                    style={icon === n ? { background: accent, boxShadow: `0 2px 8px ${accent.replace("0.85","0.3")}` } : { background: "rgba(241,245,249,0.85)" }}
                    whileTap={{ scale: 0.9 }}>
                    <Ic className="h-3.5 w-3.5" strokeWidth={1.75} style={{ color: icon === n ? "white" : "#6b7280" }} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Цвет</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ACCENTS.map(a => (
                  <motion.button key={a} onClick={() => setAccent(a)}
                    className="h-7 w-7 rounded-full flex items-center justify-center"
                    style={{ background: a, boxShadow: accent === a ? `0 0 0 2px white, 0 0 0 4px ${a}` : "none" }}
                    whileTap={{ scale: 0.9 }}>
                    {accent === a && <Check className="h-3 w-3 text-white" strokeWidth={2.5} />}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Parent group (subgroup) */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Подгруппа в</label>
              <div className="flex flex-wrap gap-1.5">
                <motion.button onClick={() => setParentId("")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[9px] text-[11px] font-semibold"
                  style={!parentId ? { background: "rgba(30,41,59,0.8)", color: "white" } : { background: "rgba(241,245,249,0.8)", color: "#6b7280" }}
                  whileTap={{ scale: 0.95 }}>
                  <Folder className="h-3 w-3" strokeWidth={2} />Корневая
                </motion.button>
                {parentGroups.filter(g => g.id !== group?.id).map(g => {
                  const Icon = getIconComponent(g.icon)
                  return (
                    <motion.button key={g.id} onClick={() => setParentId(g.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-[9px] text-[11px] font-semibold"
                      style={parentId === g.id ? { background: g.accent, color: "white" } : { background: "rgba(241,245,249,0.8)", color: "#6b7280" }}
                      whileTap={{ scale: 0.95 }}>
                      <Icon className="h-3 w-3" strokeWidth={2} />{g.name}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            <div className="flex gap-2">
              {!isNew && onDelete && (
                <motion.button onClick={() => { onDelete(group!.id); onClose() }}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-[13px] text-red-500 text-[12px] font-semibold"
                  style={{ background: "rgba(254,242,242,0.8)", border: "1px solid rgba(252,165,165,0.4)" }}
                  whileTap={{ scale: 0.97 }}>
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />Удалить
                </motion.button>
              )}
              <motion.button onClick={save}
                className="flex-1 py-2.5 rounded-[13px] text-white text-[13px] font-bold"
                style={{ background: accent, boxShadow: `0 4px 14px ${accent.replace("0.85","0.25")}` }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {isNew ? "Создать группу" : "Сохранить"}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ onClose, passwords }: { onClose: () => void; passwords: PasswordEntry[] }) {
  const [tab, setTab] = useState<"master" | "lock" | "data">("master")
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [lockTime, setLockTime] = useState(15)
  const [lockOnMinimize, setLockOnMinimize] = useState(true)
  const [lockOnFocusLoss, setLockOnFocusLoss] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const saveMaster = () => {
    if (!currentPass) { setError("Введите текущий пароль"); return }
    if (newPass.length < 6) { setError("Минимум 6 символов"); return }
    if (newPass !== confirmPass) { setError("Пароли не совпадают"); return }
    setError(""); setSaved(true)
    setTimeout(() => { setSaved(false); setCurrentPass(""); setNewPass(""); setConfirmPass("") }, 2000)
  }

  const saveLock = () => { setSaved(true); setTimeout(() => setSaved(false), 1500) }

  const exportData = () => {
    const json = JSON.stringify(passwords, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "passwords_export.json"; a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement("input")
    input.type = "file"; input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => { alert("Импорт: " + reader.result?.toString().slice(0, 60) + "...") }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />

      <motion.div style={{ ...glassModal, borderRadius: "24px" }} className="relative w-full max-w-[440px] z-10"
        initial={{ opacity: 0, scale: 0.93, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 16 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}>
        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "24px 24px 0 0" }} />

        <div className="relative p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[12px]"
                style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(71,85,105,0.9))", boxShadow: "0 4px 12px rgba(30,41,59,0.22)" }}>
                <Settings className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-gray-900">Настройки</h2>
                <p className="text-[11px] text-gray-500">Безопасность и данные</p>
              </div>
            </div>
            <motion.button onClick={onClose} style={glassBtn} className="rounded-[10px] p-1.5 text-gray-500" whileTap={{ scale: 0.9 }}>
              <X className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 p-1 rounded-[12px]"
            style={{ background: "rgba(241,245,249,0.8)", border: "1px solid rgba(226,232,240,0.6)" }}>
            {([
              { key: "master" as const, icon: KeyRound, label: "Пароль" },
              { key: "lock" as const, icon: Timer, label: "Блокировка" },
              { key: "data" as const, icon: Download, label: "Данные" },
            ]).map(({ key, icon: Icon, label }) => (
              <motion.button key={key} onClick={() => { setTab(key); setError(""); setSaved(false) }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[9px] text-[12px] font-semibold"
                style={tab === key ? { background: "white", color: "#1e293b", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" } : { color: "#94a3b8" }}
                whileTap={{ scale: 0.97 }}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />{label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Master password */}
            {tab === "master" && (
              <motion.div key="m" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }} className="space-y-3">
                {[
                  { label: "Текущий пароль", val: currentPass, set: setCurrentPass, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                  { label: "Новый пароль", val: newPass, set: setNewPass, show: showNew, toggle: () => setShowNew(!showNew) },
                ].map(({ label, val, set, show, toggle }) => (
                  <div key={label}>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                    <div className="relative">
                      <input style={{ ...glassInput, paddingRight: "36px" }} type={show ? "text" : "password"}
                        value={val} onChange={e => { set(e.target.value); setError("") }} placeholder="••••••••" />
                      <button onClick={toggle} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                        {show ? <EyeOff className="h-3.5 w-3.5" strokeWidth={2} /> : <Eye className="h-3.5 w-3.5" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Повторите новый</label>
                  <input style={glassInput} type="password" value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setError("") }} placeholder="••••••••" />
                </div>
                <AnimatePresence>
                  {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[11px] text-red-500 font-medium">{error}</motion.p>}
                </AnimatePresence>
                <SaveButton saved={saved} onClick={saveMaster} label="Сменить пароль" />
              </motion.div>
            )}

            {/* Lock settings */}
            {tab === "lock" && (
              <motion.div key="l" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }} className="space-y-3">
                {/* Checkboxes */}
                <div className="space-y-2">
                  {[
                    { label: "Блокировать при сворачивании", desc: "Запрашивать мастер-пароль при открытии", val: lockOnMinimize, set: setLockOnMinimize, icon: Smartphone },
                    { label: "Блокировать при потере фокуса", desc: "Когда окно стало неактивным", val: lockOnFocusLoss, set: setLockOnFocusLoss, icon: Lock },
                  ].map(({ label, desc, val, set, icon: Icon }) => (
                    <motion.button key={label} onClick={() => set(!val)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[13px] text-left"
                      style={val ? { background: "rgba(30,41,59,0.06)", border: "1px solid rgba(30,41,59,0.12)" } : { ...glassBtn }}
                      whileTap={{ scale: 0.98 }}>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                        style={{ background: val ? "rgba(30,41,59,0.85)" : "rgba(241,245,249,1)", boxShadow: val ? "0 2px 6px rgba(30,41,59,0.2)" : "none" }}>
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: val ? "white" : "#9ca3af" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                        <p className="text-[11px] text-gray-500 truncate">{desc}</p>
                      </div>
                      <div className="shrink-0 h-5 w-9 rounded-full flex items-center transition-all px-0.5"
                        style={{ background: val ? "rgba(30,41,59,0.85)" : "rgba(203,213,225,1)" }}>
                        <motion.div className="h-4 w-4 rounded-full bg-white shadow"
                          animate={{ x: val ? 16 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-0.5">Время бездействия</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {LOCK_TIMES.map(({ label, value }) => (
                    <motion.button key={value} onClick={() => setLockTime(value)}
                      className="flex items-center justify-between px-3 py-2 rounded-[11px] text-[12px] font-semibold"
                      style={lockTime === value
                        ? { background: "rgba(30,41,59,0.85)", color: "white", boxShadow: "0 3px 10px rgba(30,41,59,0.2)" }
                        : { ...glassBtn, color: "#374151" }}
                      whileTap={{ scale: 0.97 }}>
                      {label}
                      {lockTime === value && <Check className="h-3 w-3" strokeWidth={2.5} />}
                    </motion.button>
                  ))}
                </div>
                <SaveButton saved={saved} onClick={saveLock} label="Применить" />
              </motion.div>
            )}

            {/* Data: export/import */}
            {tab === "data" && (
              <motion.div key="d" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }} className="space-y-3">
                <p className="text-[12px] text-gray-500">Экспортируйте все пароли в файл или восстановите из резервной копии.</p>
                {[
                  { label: "Экспорт паролей", desc: `${passwords.length} записей → passwords_export.json`, icon: Download, fn: exportData, color: "rgba(16,185,129,0.85)" },
                  { label: "Импорт паролей", desc: "Загрузить из .json файла", icon: Upload, fn: importData, color: "rgba(59,130,246,0.85)" },
                ].map(({ label, desc, icon: Icon, fn, color }) => (
                  <motion.button key={label} onClick={fn}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left"
                    style={{ background: color.replace("0.85", "0.08"), border: `1px solid ${color.replace("0.85","0.2")}` }}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]"
                      style={{ background: color, boxShadow: `0 3px 10px ${color.replace("0.85","0.25")}` }}>
                      <Icon className="h-4 w-4 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                      <p className="text-[11px] text-gray-500">{desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto shrink-0" strokeWidth={2} />
                  </motion.button>
                ))}
                <div className="rounded-[12px] px-3.5 py-2.5"
                  style={{ background: "rgba(254,243,199,0.6)", border: "1px solid rgba(252,211,77,0.4)" }}>
                  <p className="text-[11px] text-amber-700 font-medium">⚠️ Файл экспорта не зашифрован. Храните его в безопасном месте.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

function SaveButton({ saved, onClick, label }: { saved: boolean; onClick: () => void; label: string }) {
  return (
    <motion.button onClick={onClick}
      className="w-full py-2.5 rounded-[13px] text-white text-[13px] font-bold flex items-center justify-center gap-2"
      style={{ background: saved ? "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))" : "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(71,85,105,0.9))",
        boxShadow: "0 4px 16px rgba(30,41,59,0.18)" }}
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      {saved ? <><Check className="h-4 w-4" strokeWidth={2.5} />Сохранено!</> : label}
    </motion.button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
}

// ─── Context Menu ─────────────────────────────────────────────────────────────
interface CtxMenu { x: number; y: number; group: Group }

function GroupContextMenu({ menu, onEdit, onDelete, onAddSub, onClose }: {
  menu: CtxMenu
  onEdit: (g: Group) => void
  onDelete: (id: string) => void
  onAddSub: (parentId: string) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("mousedown", h)
    document.addEventListener("keydown", k)
    return () => { document.removeEventListener("mousedown", h); document.removeEventListener("keydown", k) }
  }, [onClose])

  // Keep inside viewport
  const left = Math.min(menu.x, window.innerWidth - 170)
  const top = Math.min(menu.y, window.innerHeight - 140)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed z-[100] rounded-[14px] py-1.5 min-w-[160px] overflow-hidden"
      style={{ left, top, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
        border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)" }}>
      <div className="px-3 py-1.5 border-b border-gray-100">
        <p className="text-[11px] font-semibold text-gray-400 truncate max-w-[140px]">{menu.group.name}</p>
      </div>
      <button onClick={() => { onEdit(menu.group); onClose() }}
        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
        <Pencil className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />Редактировать
      </button>
      {!menu.group.parentId && (
        <button onClick={() => { onAddSub(menu.group.id); onClose() }}
          className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-gray-700 hover:bg-gray-50 transition-colors">
          <FolderPlus className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2} />Добавить подгруппу
        </button>
      )}
      <div className="mx-3 my-1 h-px bg-gray-100" />
      <button onClick={() => { onDelete(menu.group.id); onClose() }}
        className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 transition-colors">
        <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />Удалить группу
      </button>
    </motion.div>
  )
}

export function PasswordPage() {
  const [search, setSearch] = useState("")
  const [passwords, setPasswords] = useState(initialPasswords)
  const [groups, setGroups] = useState(initialGroups)
  const [activeGroupId, setActiveGroupId] = useState("all")
  const [viewMode, setViewMode] = useState<ViewMode>("manager")
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | undefined>(undefined)
  const [newGroupParentId, setNewGroupParentId] = useState<string | undefined>(undefined)
  const [showGroupEditor, setShowGroupEditor] = useState(false)
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null)
  // DnD state
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const modeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) setModeMenuOpen(false) }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  // Close ctx menu on scroll
  useEffect(() => {
    const h = () => setCtxMenu(null)
    window.addEventListener("scroll", h, true)
    return () => window.removeEventListener("scroll", h, true)
  }, [])

  const openCtxMenu = (e: React.MouseEvent, group: Group) => {
    e.preventDefault()
    e.stopPropagation()
    setCtxMenu({ x: e.clientX, y: e.clientY, group })
  }

  // DnD handlers — reorder rootGroups, or move subgroups between parents
  const handleDragStart = (id: string) => setDragId(id)
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOverId(id) }
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!dragId || dragId === targetId) { setDragId(null); setDragOverId(null); return }
    setGroups(prev => {
      const dragged = prev.find(g => g.id === dragId)
      const target = prev.find(g => g.id === targetId)
      if (!dragged || !target) return prev
      // Same level reorder
      if (dragged.parentId === target.parentId) {
        const list = [...prev]
        const from = list.findIndex(g => g.id === dragId)
        const to = list.findIndex(g => g.id === targetId)
        list.splice(from, 1)
        list.splice(to, 0, dragged)
        return list
      }
      // Move subgroup to another parent (drop subgroup onto root = move)
      if (dragged.parentId && !target.parentId) {
        return prev.map(g => g.id === dragId ? { ...g, parentId: target.id } : g)
      }
      return prev
    })
    setDragId(null)
    setDragOverId(null)
  }
  const handleDragEnd = () => { setDragId(null); setDragOverId(null) }

  const rootGroups = groups.filter(g => !g.parentId)
  const getSubgroups = (parentId: string) => groups.filter(g => g.parentId === parentId)
  const getGroupEntries = (gid: string) => passwords.filter(p => p.groupId === gid)

  const filtered = passwords.filter(p => {
    const g = groups.find(g => g.id === p.groupId)
    const matchGroup = activeGroupId === "all" || p.groupId === activeGroupId ||
      (g?.parentId === activeGroupId) || getSubgroups(activeGroupId).some(sg => sg.id === p.groupId)
    const q = search.toLowerCase()
    const matchSearch = p.site.toLowerCase().includes(q) || p.login.toLowerCase().includes(q) ||
      (g?.name.toLowerCase().includes(q) ?? false)
    return matchGroup && matchSearch
  })

  const visibleRootGroups = activeGroupId === "all"
    ? rootGroups.filter(g => {
        const subs = getSubgroups(g.id)
        return filtered.some(p => p.groupId === g.id || subs.some(sg => sg.id === p.groupId))
      })
    : rootGroups.filter(g => {
        const subs = getSubgroups(g.id)
        return g.id === activeGroupId || subs.some(sg => sg.id === activeGroupId)
      })

  const handleDelete = (id: number) => setPasswords(prev => prev.filter(p => p.id !== id))
  const handleAdd = (entry: Omit<PasswordEntry, "id">) => setPasswords(prev => [...prev, { ...entry, id: Date.now() }])
  const handleSaveGroup = (g: Group) => setGroups(prev => {
    const idx = prev.findIndex(x => x.id === g.id)
    return idx >= 0 ? prev.map(x => x.id === g.id ? g : x) : [...prev, g]
  })
  const handleDeleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id && g.parentId !== id))
    setPasswords(prev => prev.map(p => p.groupId === id ? { ...p, groupId: "other" } : p))
    if (activeGroupId === id) setActiveGroupId("all")
  }

  const openGroupEditor = (group?: Group, parentId?: string) => {
    setEditingGroup(group)
    setNewGroupParentId(parentId)
    setShowGroupEditor(true)
  }

  const activeGroupObj = groups.find(g => g.id === activeGroupId)

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(70px)", bottom: "-5%", left: "20%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      <div className="pointer-events-none fixed inset-0 z-[1]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, opacity: 0.025 }} />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col py-7 px-3 z-20"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)",
            borderRight: "1px solid rgba(255,255,255,0.6)", boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[11px] shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))", boxShadow: "0 3px 10px rgba(147,51,234,0.35)" }}>
              <Lock className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold text-gray-800 tracking-tight">Пароли</span>
          </div>

          {/* All */}
          <motion.button onClick={() => setActiveGroupId("all")}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[11px] mb-1"
            style={activeGroupId === "all"
              ? { background: "rgba(30,41,59,0.8)", boxShadow: "0 3px 10px rgba(30,41,59,0.2)" }
              : { background: "transparent" }}
            whileHover={activeGroupId === "all" ? {} : { background: "rgba(255,255,255,0.55)" }}
            whileTap={{ scale: 0.98 }}>
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: activeGroupId === "all" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)", boxShadow: activeGroupId !== "all" ? "inset 0 1px 1px rgba(255,255,255,1)" : "none" }}>
              <List className="h-3.5 w-3.5" strokeWidth={2} style={{ color: activeGroupId === "all" ? "white" : "#6b7280" }} />
            </div>
            <span className="flex-1 text-[13px] font-semibold" style={{ color: activeGroupId === "all" ? "white" : "#374151" }}>Все пароли</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: activeGroupId === "all" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)", color: activeGroupId === "all" ? "white" : "#9ca3af" }}>
              {passwords.length}
            </span>
          </motion.button>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-1 mt-2">Группы</p>

          {/* Groups tree with DnD */}
          <div className="flex-1 overflow-y-auto space-y-0.5 pr-0.5">
            {rootGroups.map(group => {
              const Icon = getIconComponent(group.icon)
              const isActive = activeGroupId === group.id
              const subs = getSubgroups(group.id)
              const count = getGroupEntries(group.id).length + subs.reduce((a, sg) => a + getGroupEntries(sg.id).length, 0)
              const isDragOver = dragOverId === group.id && dragId !== group.id

              return (
                <div key={group.id}
                  draggable
                  onDragStart={() => handleDragStart(group.id)}
                  onDragOver={e => handleDragOver(e, group.id)}
                  onDrop={e => handleDrop(e, group.id)}
                  onDragEnd={handleDragEnd}
                  style={{ opacity: dragId === group.id ? 0.4 : 1, transition: "opacity 0.15s" }}
                >
                  <div
                    className="flex items-center gap-2.5 w-full px-2 py-2 rounded-[11px] cursor-pointer group/row select-none"
                    style={isActive
                      ? { background: group.accent, boxShadow: `0 3px 12px ${group.accent.replace("0.85","0.3")}` }
                      : isDragOver
                        ? { background: "rgba(147,51,234,0.12)", border: "1.5px dashed rgba(147,51,234,0.4)" }
                        : { background: "transparent" }}
                    onClick={() => setActiveGroupId(group.id)}
                    onContextMenu={e => openCtxMenu(e, group)}
                  >
                    {/* Drag handle */}
                    <GripVertical className="h-3 w-3 shrink-0 opacity-0 group-hover/row:opacity-40 cursor-grab active:cursor-grabbing transition-opacity"
                      style={{ color: isActive ? "white" : "#9ca3af" }} strokeWidth={2} />
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
                      style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.8)", boxShadow: !isActive ? "inset 0 1px 1px rgba(255,255,255,1)" : "none" }}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={isActive ? 2.2 : 1.75} style={{ color: isActive ? "white" : "#6b7280" }} />
                    </div>
                    <span className="flex-1 text-[13px] font-semibold truncate" style={{ color: isActive ? "white" : "#374151" }}>{group.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)", color: isActive ? "white" : "#9ca3af" }}>{count}</span>
                  </div>

                  {/* Subgroups */}
                  {subs.map(sg => {
                    const SubIcon = getIconComponent(sg.icon)
                    const isSub = activeGroupId === sg.id
                    const subCount = getGroupEntries(sg.id).length
                    const isSubDragOver = dragOverId === sg.id && dragId !== sg.id
                    return (
                      <div key={sg.id}
                        draggable
                        onDragStart={e => { e.stopPropagation(); handleDragStart(sg.id) }}
                        onDragOver={e => { e.stopPropagation(); handleDragOver(e, sg.id) }}
                        onDrop={e => { e.stopPropagation(); handleDrop(e, sg.id) }}
                        onDragEnd={handleDragEnd}
                        style={{ opacity: dragId === sg.id ? 0.4 : 1, transition: "opacity 0.15s" }}
                      >
                        <div
                          className="flex items-center gap-2 w-full pl-6 pr-2 py-1.5 rounded-[11px] cursor-pointer group/sub select-none"
                          style={isSub
                            ? { background: sg.accent, boxShadow: `0 2px 8px ${sg.accent.replace("0.85","0.25")}` }
                            : isSubDragOver
                              ? { background: "rgba(147,51,234,0.10)", border: "1.5px dashed rgba(147,51,234,0.35)" }
                              : {}}
                          onClick={() => setActiveGroupId(sg.id)}
                          onContextMenu={e => openCtxMenu(e, sg)}
                        >
                          <GripVertical className="h-2.5 w-2.5 shrink-0 opacity-0 group-hover/sub:opacity-40 cursor-grab transition-opacity"
                            style={{ color: isSub ? "white" : "#9ca3af" }} strokeWidth={2} />
                          <SubIcon className="h-3 w-3 shrink-0" strokeWidth={2} style={{ color: isSub ? "white" : "#9ca3af" }} />
                          <span className="flex-1 text-[12px] font-medium truncate" style={{ color: isSub ? "white" : "#6b7280" }}>{sg.name}</span>
                          <span className="text-[10px] font-bold px-1 py-0.5 rounded-full"
                            style={{ background: isSub ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)", color: isSub ? "white" : "#9ca3af" }}>{subCount}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Add group button */}
          <div className="pt-2 mt-2" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <motion.button onClick={() => openGroupEditor(undefined, undefined)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[11px] mb-1"
              whileHover={{ background: "rgba(255,255,255,0.6)" }} whileTap={{ scale: 0.98 }}>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
                style={{ background: "rgba(255,255,255,0.8)", boxShadow: "inset 0 1px 1px rgba(255,255,255,1)" }}>
                <FolderPlus className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.75} />
              </div>
              <span className="text-[13px] font-semibold text-gray-500">Новая группа</span>
            </motion.button>
            <motion.button onClick={() => setShowSettings(true)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-[11px]"
              whileHover={{ background: "rgba(255,255,255,0.6)" }} whileTap={{ scale: 0.98 }}>
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px]"
                style={{ background: "rgba(255,255,255,0.8)", boxShadow: "inset 0 1px 1px rgba(255,255,255,1)" }}>
                <Settings className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.75} />
              </div>
              <span className="flex-1 text-[13px] font-semibold text-gray-500">Настройки</span>
              <ChevronRight className="h-3 w-3 text-gray-400" strokeWidth={2} />
            </motion.button>
          </div>
        </aside>

        {/* Main */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants}
          className="flex-1 flex flex-col gap-4 px-6 py-7 ml-[220px]">

          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              {activeGroupObj && (
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px]"
                  style={{ background: activeGroupObj.accent, boxShadow: `0 3px 12px ${activeGroupObj.accent.replace("0.85","0.3")}` }}>
                  {(() => { const I = getIconComponent(activeGroupObj.icon); return <I className="h-4 w-4 text-white" strokeWidth={2} /> })()}
                </div>
              )}
              <div>
                <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
                  {activeGroupId === "all" ? "Все пароли" : activeGroupObj?.name}
                </h1>
                <p className="text-[11px] text-gray-500">{filtered.length} записей</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative" ref={modeMenuRef}>
                <motion.button onClick={() => setModeMenuOpen(!modeMenuOpen)} style={glassBtn}
                  className="flex items-center gap-1.5 rounded-[11px] px-3 py-2 text-gray-600 text-[12px] font-medium"
                  whileTap={{ scale: 0.97 }}>
                  <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
                  {viewMode === "manager" ? "Менеджер" : "Обычный"}
                </motion.button>
                <AnimatePresence>
                  {modeMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{ background: "rgba(255,255,255,0.94)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
                        border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 32px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04)" }}
                      className="absolute right-0 top-10 z-50 rounded-[16px] py-2 min-w-[200px] overflow-hidden">
                      <div className="px-3 pb-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Режим</span></div>
                      {([
                        { mode: "manager" as ViewMode, icon: KeyRound, label: "Менеджер паролей", desc: "Пароли скрыты", accent: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))", check: "text-purple-500" },
                        { mode: "simple" as ViewMode, icon: List, label: "Обычный список", desc: "Пароли видны сразу", accent: "linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85))", check: "text-blue-500" },
                      ]).map(({ mode, icon: Icon, label, desc, accent, check }) => (
                        <button key={mode} onClick={() => { setViewMode(mode); setModeMenuOpen(false) }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/60 transition-colors">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                            style={{ background: viewMode === mode ? accent : "rgba(241,245,249,1)" }}>
                            <Icon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: viewMode === mode ? "white" : "#6b7280" }} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-[12px] font-semibold text-gray-800">{label}</p>
                            <p className="text-[11px] text-gray-500">{desc}</p>
                          </div>
                          {viewMode === mode && <Check className={`h-3.5 w-3.5 ${check} shrink-0`} strokeWidth={2.5} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-[13px] px-4 py-2 text-white text-[13px] font-semibold"
                style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))",
                  boxShadow: "0 4px 14px rgba(147,51,234,0.28)", border: "1px solid rgba(255,255,255,0.25)" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Plus className="h-4 w-4" strokeWidth={2.5} />Добавить
              </motion.button>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <div style={glassCard} className="flex items-center gap-2.5 px-3.5 py-2.5">
              <Search className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={2} />
              <input type="text" placeholder="Поиск по сайту, логину..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[13px] text-gray-800 placeholder-gray-400 outline-none" />
              <AnimatePresence>
                {search && (
                  <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" strokeWidth={2} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Entries */}
          <motion.div variants={containerVariants} className="space-y-3">
            <AnimatePresence>
              {visibleRootGroups.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={glassCard} className="px-6 py-10 text-center">
                  <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[13px] text-gray-500">Ничего не найдено</p>
                </motion.div>
              ) : (
                visibleRootGroups.map(group => {
                  const subs = getSubgroups(group.id)
                  const groupEntries = filtered.filter(p => p.groupId === group.id)
                  return (
                    <motion.div key={group.id} variants={itemVariants}>
                      <GroupSection group={group} entries={groupEntries} viewMode={viewMode}
                        subgroups={subs} allEntries={filtered} onDelete={handleDelete} />
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pb-4">
            <p className="text-[11px] text-gray-400">🔐 Данные хранятся локально</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddEntryModal onClose={() => setShowAddModal(false)} onAdd={handleAdd}
            groups={groups} defaultGroupId={activeGroupId} />
        )}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} passwords={passwords} />
        )}
        {showGroupEditor && (
          <GroupEditorModal
            group={editingGroup}
            groups={groups}
            onClose={() => { setShowGroupEditor(false); setNewGroupParentId(undefined) }}
            onSave={g => {
              // если создаём новую с parentId — проставляем
              handleSaveGroup(newGroupParentId && !g.parentId ? { ...g, parentId: newGroupParentId } : g)
            }}
            onDelete={editingGroup ? handleDeleteGroup : undefined}
          />
        )}
        {ctxMenu && (
          <GroupContextMenu
            menu={ctxMenu}
            onEdit={g => openGroupEditor(g)}
            onDelete={handleDeleteGroup}
            onAddSub={parentId => openGroupEditor(undefined, parentId)}
            onClose={() => setCtxMenu(null)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}