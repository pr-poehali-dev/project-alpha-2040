import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Copy,
  Eye,
  EyeOff,
  Check,
  MoreVertical,
  Pencil,
  Trash2,
  Plus,
  Lock,
  Globe,
  Shield,
  CreditCard,
  Mail,
  Wifi,
  ChevronDown,
  ChevronUp,
  X,
  KeyRound,
  List,
  SlidersHorizontal,
  Settings,
  Timer,
  RefreshCw,
  ChevronRight,
} from "lucide-react"

interface PasswordEntry {
  id: number
  site: string
  login: string
  password: string
  group: string
}

const groupIcons: Record<string, React.ElementType> = {
  Все: List,
  Соцсети: Globe,
  Почта: Mail,
  Финансы: CreditCard,
  Работа: Shield,
  Прочее: Lock,
  Сети: Wifi,
}

const groupColors: Record<string, string> = {
  Все: "from-gray-400/20 to-slate-400/20",
  Соцсети: "from-purple-400/30 to-pink-400/30",
  Почта: "from-blue-400/30 to-cyan-400/30",
  Финансы: "from-emerald-400/30 to-teal-400/30",
  Работа: "from-orange-400/30 to-amber-400/30",
  Прочее: "from-slate-400/30 to-gray-400/30",
  Сети: "from-violet-400/30 to-indigo-400/30",
}

const groupAccent: Record<string, string> = {
  Все: "rgba(100,116,139,0.8)",
  Соцсети: "rgba(147,51,234,0.8)",
  Почта: "rgba(59,130,246,0.8)",
  Финансы: "rgba(16,185,129,0.8)",
  Работа: "rgba(249,115,22,0.8)",
  Прочее: "rgba(100,116,139,0.8)",
  Сети: "rgba(139,92,246,0.8)",
}

const ALL_GROUPS = ["Соцсети", "Почта", "Финансы", "Работа", "Прочее", "Сети"]
const LOCK_TIMES = [
  { label: "1 минута", value: 1 },
  { label: "5 минут", value: 5 },
  { label: "15 минут", value: 15 },
  { label: "30 минут", value: 30 },
  { label: "1 час", value: 60 },
  { label: "Никогда", value: 0 },
]

const initialPasswords: PasswordEntry[] = [
  { id: 1, site: "instagram.com", login: "user@mail.ru", password: "Insta$ecure99", group: "Соцсети" },
  { id: 2, site: "vk.com", login: "vkuser123", password: "VkP@ss2024!", group: "Соцсети" },
  { id: 3, site: "gmail.com", login: "mymail@gmail.com", password: "GmailStr0ng#", group: "Почта" },
  { id: 4, site: "yandex.ru", login: "ya.user@ya.ru", password: "YaP@ssword1!", group: "Почта" },
  { id: 5, site: "sberbank.ru", login: "79001234567", password: "Sber$afe2024", group: "Финансы" },
  { id: 6, site: "tinkoff.ru", login: "tinkoff@mail.ru", password: "T!nk0ffBank", group: "Финансы" },
  { id: 7, site: "slack.com", login: "work.user@corp.com", password: "Sl@ckWork99", group: "Работа" },
  { id: 8, site: "wi-fi домашний", login: "HomeNet", password: "H0meW1fi#Safe", group: "Сети" },
]

// Мягкая рассеянная тень без угловатости
const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow: [
    "inset 0 1px 1px rgba(255,255,255,0.95)",
    "0 2px 8px rgba(0,0,0,0.04)",
    "0 8px 24px rgba(0,0,0,0.06)",
    "0 20px 40px rgba(0,0,0,0.05)",
  ].join(", "),
  border: "1px solid rgba(255,255,255,0.65)",
  borderRadius: "20px",
}

const glassModal: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(50px) saturate(200%)",
  WebkitBackdropFilter: "blur(50px) saturate(200%)",
  boxShadow: [
    "inset 0 1px 1px rgba(255,255,255,0.95)",
    "0 8px 32px rgba(0,0,0,0.08)",
    "0 32px 80px rgba(0,0,0,0.12)",
    "0 0 0 1px rgba(255,255,255,0.6)",
  ].join(", "),
  border: "1px solid rgba(255,255,255,0.7)",
}

const glassBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.95), 0 2px 8px rgba(0,0,0,0.05)",
}

const glassInput: React.CSSProperties = {
  background: "rgba(248,250,252,0.8)",
  border: "1px solid rgba(226,232,240,0.8)",
  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03), 0 1px 2px rgba(255,255,255,0.8)",
  outline: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#1e293b",
  width: "100%",
}

type ViewMode = "manager" | "simple"

// ─── Copy Button ────────────────────────────────────────────────────────────
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
      className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors shrink-0"
      whileTap={{ scale: 0.9 }} title="Копировать"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied
          ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} /></motion.span>
          : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy className="h-3.5 w-3.5" strokeWidth={2} /></motion.span>
        }
      </AnimatePresence>
    </motion.button>
  )
}

// ─── Password Card ───────────────────────────────────────────────────────────
function PasswordCard({ entry, viewMode, onDelete }: { entry: PasswordEntry; viewMode: ViewMode; onDelete: (id: number) => void }) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const showPassword = viewMode === "simple" || visible

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      style={glassCard} className="px-4 py-3.5 relative overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, transparent 100%)", borderRadius: "20px 20px 0 0" }} />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Сайт</span>
            <span className="text-[13px] font-semibold text-gray-800 truncate flex-1">{entry.site}</span>
            <CopyButton text={entry.site} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Логин</span>
            <span className="text-[13px] text-gray-700 truncate flex-1">{entry.login}</span>
            <CopyButton text={entry.login} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Пароль</span>
            <span className="text-[13px] font-mono text-gray-700 truncate flex-1">
              {showPassword ? entry.password : "•".repeat(Math.min(entry.password.length, 12))}
            </span>
            {viewMode === "manager" && (
              <motion.button onClick={() => setVisible(!visible)} style={glassBtn}
                className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors shrink-0" whileTap={{ scale: 0.9 }}>
                {visible ? <EyeOff className="h-3.5 w-3.5" strokeWidth={2} /> : <Eye className="h-3.5 w-3.5" strokeWidth={2} />}
              </motion.button>
            )}
            <CopyButton text={entry.password} />
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <motion.button onClick={() => setMenuOpen(!menuOpen)} style={glassBtn}
            className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors" whileTap={{ scale: 0.9 }}>
            <MoreVertical className="h-4 w-4" strokeWidth={2} />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.95)" }}
                className="absolute right-0 top-8 z-50 rounded-[16px] py-1.5 min-w-[160px] overflow-hidden"
              >
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-white/60 transition-colors">
                  <Pencil className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />Редактировать
                </button>
                <div className="mx-3 my-1 h-px bg-gray-200/60" />
                <button onClick={() => { onDelete(entry.id); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50/60 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />Удалить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Group Section ───────────────────────────────────────────────────────────
function GroupSection({ group, entries, viewMode, onDelete }: {
  group: string; entries: PasswordEntry[]; viewMode: ViewMode; onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(true)
  const Icon = groupIcons[group] || Lock
  const gradient = groupColors[group] || "from-gray-400/20 to-slate-400/20"

  return (
    <motion.div layout className="space-y-2">
      <motion.button onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[16px] bg-gradient-to-r ${gradient}`}
        style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.55)", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.85), 0 2px 12px rgba(0,0,0,0.04)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-xl shrink-0"
          style={{ background: "rgba(255,255,255,0.85)", boxShadow: "inset 0 1px 2px rgba(255,255,255,1), 0 2px 6px rgba(0,0,0,0.05)" }}>
          <Icon className="h-4 w-4 text-gray-600" strokeWidth={1.75} />
        </div>
        <span className="flex-1 text-left text-[14px] font-semibold text-gray-800">{group}</span>
        <span className="text-[11px] font-semibold text-gray-500 px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.75)" }}>
          {entries.length}
        </span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" strokeWidth={2} /> : <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-2 pl-2 overflow-hidden">
            <AnimatePresence>
              {entries.map((entry) => <PasswordCard key={entry.id} entry={entry} viewMode={viewMode} onDelete={onDelete} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Add Entry Modal ─────────────────────────────────────────────────────────
function AddEntryModal({ onClose, onAdd, defaultGroup }: {
  onClose: () => void
  onAdd: (entry: Omit<PasswordEntry, "id">) => void
  defaultGroup: string
}) {
  const [site, setSite] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [group, setGroup] = useState(defaultGroup === "Все" ? "Прочее" : defaultGroup)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    setPassword(Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""))
  }

  const handleSubmit = () => {
    if (!site.trim()) { setError("Введите сайт или название"); return }
    if (!login.trim()) { setError("Введите логин"); return }
    if (!password.trim()) { setError("Введите пароль"); return }
    onAdd({ site: site.trim(), login: login.trim(), password: password.trim(), group })
    onClose()
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Backdrop */}
      <motion.div className="absolute inset-0 bg-black/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} onClick={onClose} style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />

      <motion.div style={{ ...glassModal, borderRadius: "28px" }}
        className="relative w-full max-w-[440px] p-6 z-10"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {/* Glare */}
        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "28px 28px 0 0" }} />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))", boxShadow: "0 4px 14px rgba(147,51,234,0.3)" }}>
                <Plus className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-gray-900">Новая запись</h2>
                <p className="text-[12px] text-gray-500">Заполните данные</p>
              </div>
            </div>
            <motion.button onClick={onClose} style={glassBtn}
              className="rounded-[12px] p-2 text-gray-500 hover:text-gray-800 transition-colors" whileTap={{ scale: 0.9 }}>
              <X className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>

          <div className="space-y-4">
            {/* Site */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Сайт / Название</label>
              <input style={glassInput} value={site} onChange={e => { setSite(e.target.value); setError("") }}
                placeholder="instagram.com" autoFocus />
            </div>

            {/* Login */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Логин / Email</label>
              <input style={glassInput} value={login} onChange={e => { setLogin(e.target.value); setError("") }}
                placeholder="user@mail.ru" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Пароль</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input style={{ ...glassInput, paddingRight: "40px" }} type={showPass ? "text" : "password"}
                    value={password} onChange={e => { setPassword(e.target.value); setError("") }}
                    placeholder="••••••••••••" />
                  <button onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
                  </button>
                </div>
                <motion.button onClick={generatePassword} style={glassBtn}
                  className="flex items-center gap-1.5 rounded-[12px] px-3 text-[12px] font-medium text-gray-600 shrink-0 whitespace-nowrap"
                  whileTap={{ scale: 0.95 }} title="Сгенерировать пароль">
                  <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                  Сгенерировать
                </motion.button>
              </div>
            </div>

            {/* Group */}
            <div>
              <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Группа</label>
              <div className="flex flex-wrap gap-2">
                {ALL_GROUPS.map(g => {
                  const Icon = groupIcons[g] || Lock
                  const isSelected = group === g
                  const accent = groupAccent[g]
                  return (
                    <motion.button key={g} onClick={() => setGroup(g)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-semibold transition-all"
                      style={isSelected
                        ? { background: accent, color: "white", boxShadow: `0 3px 10px ${accent}55` }
                        : { background: "rgba(241,245,249,0.8)", color: "#6b7280" }}
                      whileTap={{ scale: 0.95 }}>
                      <Icon className="h-3 w-3" strokeWidth={2} />{g}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="text-[12px] text-red-500 font-medium">{error}</motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button onClick={handleSubmit}
              className="w-full py-3 rounded-[14px] text-white text-[14px] font-bold mt-2"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))",
                boxShadow: "0 4px 20px rgba(147,51,234,0.3), inset 0 1px 1px rgba(255,255,255,0.25)" }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Сохранить запись
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Settings Panel ──────────────────────────────────────────────────────────
function SettingsPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"master" | "lock">("master")
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [lockTime, setLockTime] = useState(15)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  const handleSaveMaster = () => {
    if (!currentPass) { setError("Введите текущий пароль"); return }
    if (newPass.length < 6) { setError("Новый пароль: минимум 6 символов"); return }
    if (newPass !== confirmPass) { setError("Пароли не совпадают"); return }
    setError("")
    setSaved(true)
    setTimeout(() => { setSaved(false); setCurrentPass(""); setNewPass(""); setConfirmPass("") }, 2000)
  }

  const handleSaveLock = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="absolute inset-0 bg-black/20" onClick={onClose}
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }} />

      <motion.div style={{ ...glassModal, borderRadius: "28px" }}
        className="relative w-full max-w-[460px] z-10"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "28px 28px 0 0" }} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[14px]"
                style={{ background: "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(71,85,105,0.9))", boxShadow: "0 4px 14px rgba(30,41,59,0.25)" }}>
                <Settings className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-gray-900">Настройки</h2>
                <p className="text-[12px] text-gray-500">Безопасность и доступ</p>
              </div>
            </div>
            <motion.button onClick={onClose} style={glassBtn}
              className="rounded-[12px] p-2 text-gray-500 hover:text-gray-800 transition-colors" whileTap={{ scale: 0.9 }}>
              <X className="h-4 w-4" strokeWidth={2} />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 p-1 rounded-[14px]"
            style={{ background: "rgba(241,245,249,0.8)", border: "1px solid rgba(226,232,240,0.6)" }}>
            {([
              { key: "master", icon: KeyRound, label: "Мастер-пароль" },
              { key: "lock", icon: Timer, label: "Авто-блокировка" },
            ] as const).map(({ key, icon: Icon, label }) => (
              <motion.button key={key} onClick={() => { setTab(key); setError(""); setSaved(false) }}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[11px] text-[13px] font-semibold transition-all"
                style={tab === key
                  ? { background: "white", color: "#1e293b", boxShadow: "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.95)" }
                  : { color: "#94a3b8" }}
                whileTap={{ scale: 0.97 }}>
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />{label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Master password tab */}
            {tab === "master" && (
              <motion.div key="master" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.18 }} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Текущий пароль</label>
                  <div className="relative">
                    <input style={{ ...glassInput, paddingRight: "40px" }} type={showCurrent ? "text" : "password"}
                      value={currentPass} onChange={e => { setCurrentPass(e.target.value); setError("") }} placeholder="••••••••" />
                    <button onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                      {showCurrent ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Новый пароль</label>
                  <div className="relative">
                    <input style={{ ...glassInput, paddingRight: "40px" }} type={showNew ? "text" : "password"}
                      value={newPass} onChange={e => { setNewPass(e.target.value); setError("") }} placeholder="Минимум 6 символов" />
                    <button onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                      {showNew ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Повторите пароль</label>
                  <input style={glassInput} type="password" value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setError("") }} placeholder="••••••••" />
                </div>
                <AnimatePresence>
                  {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[12px] text-red-500 font-medium">{error}</motion.p>}
                </AnimatePresence>
                <motion.button onClick={handleSaveMaster}
                  className="w-full py-3 rounded-[14px] text-white text-[14px] font-bold flex items-center justify-center gap-2"
                  style={{ background: saved ? "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))" : "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(71,85,105,0.9))",
                    boxShadow: "0 4px 20px rgba(30,41,59,0.2), inset 0 1px 1px rgba(255,255,255,0.2)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saved ? <><Check className="h-4 w-4" strokeWidth={2.5} />Сохранено!</> : "Сменить пароль"}
                </motion.button>
              </motion.div>
            )}

            {/* Auto-lock tab */}
            {tab === "lock" && (
              <motion.div key="lock" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }} className="space-y-3">
                <p className="text-[13px] text-gray-500 mb-4">Приложение заблокируется автоматически через указанное время бездействия.</p>
                <div className="space-y-2">
                  {LOCK_TIMES.map(({ label, value }) => (
                    <motion.button key={value} onClick={() => setLockTime(value)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[14px] transition-all"
                      style={lockTime === value
                        ? { background: "linear-gradient(135deg, rgba(30,41,59,0.85), rgba(71,85,105,0.85))",
                            boxShadow: "0 4px 14px rgba(30,41,59,0.2)", color: "white" }
                        : { ...glassBtn, color: "#374151" }}
                      whileTap={{ scale: 0.98 }}>
                      <div className="flex items-center gap-3">
                        <Timer className="h-4 w-4" strokeWidth={2} style={{ color: lockTime === value ? "rgba(255,255,255,0.7)" : "#9ca3af" }} />
                        <span className="text-[14px] font-semibold">{label}</span>
                      </div>
                      {lockTime === value && <Check className="h-4 w-4" strokeWidth={2.5} />}
                    </motion.button>
                  ))}
                </div>
                <motion.button onClick={handleSaveLock}
                  className="w-full py-3 rounded-[14px] text-white text-[14px] font-bold flex items-center justify-center gap-2 mt-2"
                  style={{ background: saved ? "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(5,150,105,0.9))" : "linear-gradient(135deg, rgba(30,41,59,0.9), rgba(71,85,105,0.9))",
                    boxShadow: "0 4px 20px rgba(30,41,59,0.2), inset 0 1px 1px rgba(255,255,255,0.2)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saved ? <><Check className="h-4 w-4" strokeWidth={2.5} />Сохранено!</> : "Применить"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } },
}

export function PasswordPage() {
  const [search, setSearch] = useState("")
  const [passwords, setPasswords] = useState(initialPasswords)
  const [activeGroup, setActiveGroup] = useState("Все")
  const [viewMode, setViewMode] = useState<ViewMode>("manager")
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const modeMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modeMenuRef.current && !modeMenuRef.current.contains(e.target as Node)) setModeMenuOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const allGroups = ["Все", ...Array.from(new Set(passwords.map((p) => p.group)))]

  const filtered = passwords.filter((p) => {
    const matchGroup = activeGroup === "Все" || p.group === activeGroup
    const matchSearch =
      p.site.toLowerCase().includes(search.toLowerCase()) ||
      p.login.toLowerCase().includes(search.toLowerCase()) ||
      p.group.toLowerCase().includes(search.toLowerCase())
    return matchGroup && matchSearch
  })

  const visibleGroups = activeGroup === "Все" ? Array.from(new Set(filtered.map((p) => p.group))) : [activeGroup]

  const handleDelete = (id: number) => setPasswords((prev) => prev.filter((p) => p.id !== id))
  const handleAdd = (entry: Omit<PasswordEntry, "id">) => {
    setPasswords((prev) => [...prev, { ...entry, id: Date.now() }])
  }

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
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
        {/* LEFT sidebar */}
        <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col py-8 px-4 gap-1 z-20"
          style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(40px) saturate(180%)", WebkitBackdropFilter: "blur(40px) saturate(180%)",
            borderRight: "1px solid rgba(255,255,255,0.6)", boxShadow: "inset -1px 0 0 rgba(255,255,255,0.8), 4px 0 24px rgba(0,0,0,0.04)" }}>

          <div className="flex items-center gap-2.5 px-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-[12px] shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))", boxShadow: "0 3px 10px rgba(147,51,234,0.35)" }}>
              <Lock className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-bold text-gray-800 tracking-tight">Пароли</span>
          </div>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 mb-2">Группы</p>

          <div className="flex-1 space-y-0.5">
            {allGroups.map((group) => {
              const Icon = groupIcons[group] || Lock
              const isActive = activeGroup === group
              const accent = groupAccent[group] || "rgba(100,116,139,0.8)"
              const count = group === "Все" ? passwords.length : passwords.filter((p) => p.group === group).length
              return (
                <motion.button key={group} onClick={() => setActiveGroup(group)}
                  className="relative flex items-center gap-3 w-full px-3 py-2.5 rounded-[13px] transition-all text-left"
                  style={isActive ? { background: accent, boxShadow: `0 4px 14px ${accent}44, inset 0 1px 1px rgba(255,255,255,0.25)` } : { background: "transparent" }}
                  whileHover={isActive ? {} : { background: "rgba(255,255,255,0.6)" }}
                  whileTap={{ scale: 0.98 }}>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                    style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.75)",
                      boxShadow: isActive ? "none" : "inset 0 1px 1px rgba(255,255,255,1), 0 1px 3px rgba(0,0,0,0.06)" }}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={isActive ? 2.2 : 1.75} style={{ color: isActive ? "white" : "#6b7280" }} />
                  </div>
                  <span className="flex-1 text-[13px] font-semibold" style={{ color: isActive ? "white" : "#374151" }}>{group}</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                    style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)", color: isActive ? "white" : "#9ca3af" }}>
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Settings button at bottom */}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <motion.button onClick={() => setShowSettings(true)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[13px] transition-all text-left"
              whileHover={{ background: "rgba(255,255,255,0.6)" }} whileTap={{ scale: 0.98 }}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
                style={{ background: "rgba(255,255,255,0.75)", boxShadow: "inset 0 1px 1px rgba(255,255,255,1), 0 1px 3px rgba(0,0,0,0.06)" }}>
                <Settings className="h-3.5 w-3.5 text-gray-500" strokeWidth={1.75} />
              </div>
              <span className="flex-1 text-[13px] font-semibold text-gray-600">Настройки</span>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
            </motion.button>
          </div>
        </aside>

        {/* Main content */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants}
          className="flex-1 flex flex-col gap-5 px-6 py-8 ml-[220px]">

          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
            <div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-tight">
                {activeGroup === "Все" ? "Все пароли" : activeGroup}
              </h1>
              <p className="text-[12px] text-gray-500">{filtered.length} записей</p>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="relative" ref={modeMenuRef}>
                <motion.button onClick={() => setModeMenuOpen(!modeMenuOpen)} style={glassBtn}
                  className="flex items-center gap-1.5 rounded-[12px] px-3 py-2.5 text-gray-600 text-[12px] font-medium"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>{viewMode === "manager" ? "Менеджер" : "Обычный"}</span>
                </motion.button>

                <AnimatePresence>
                  {modeMenuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
                        border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.95)" }}
                      className="absolute right-0 top-11 z-50 rounded-[18px] py-2 min-w-[210px] overflow-hidden">
                      <div className="px-3.5 pb-1.5">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Режим отображения</span>
                      </div>
                      {([
                        { mode: "manager" as ViewMode, icon: KeyRound, label: "Менеджер паролей", desc: "Пароли скрыты, нужен глаз", accent: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))", check: "text-purple-500" },
                        { mode: "simple" as ViewMode, icon: List, label: "Обычный список", desc: "Все пароли видны сразу", accent: "linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85))", check: "text-blue-500" },
                      ]).map(({ mode, icon: Icon, label, desc, accent, check }) => (
                        <button key={mode} onClick={() => { setViewMode(mode); setModeMenuOpen(false) }}
                          className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-white/60 transition-colors">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]"
                            style={{ background: viewMode === mode ? accent : "rgba(241,245,249,1)" }}>
                            <Icon className="h-3.5 w-3.5" strokeWidth={2} style={{ color: viewMode === mode ? "white" : "#6b7280" }} />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-[13px] font-semibold text-gray-800">{label}</p>
                            <p className="text-[11px] text-gray-500 leading-tight">{desc}</p>
                          </div>
                          {viewMode === mode && <Check className={`h-4 w-4 ${check} ml-auto mt-1 shrink-0`} strokeWidth={2.5} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add button */}
              <motion.button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 rounded-[14px] px-4 py-2.5 text-white text-[13px] font-semibold"
                style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))",
                  boxShadow: "0 4px 14px rgba(147,51,234,0.3), inset 0 1px 1px rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.3)" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Добавить
              </motion.button>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <div style={glassCard} className="flex items-center gap-3 px-4 py-3">
              <Search className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={2} />
              <input type="text" placeholder="Поиск по сайту, логину..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder-gray-400 outline-none" />
              <AnimatePresence>
                {search && (
                  <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }} onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="h-4 w-4" strokeWidth={2} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Groups + entries */}
          <motion.div variants={containerVariants} className="space-y-4">
            <AnimatePresence>
              {visibleGroups.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={glassCard} className="px-6 py-10 text-center">
                  <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[14px] text-gray-500">Ничего не найдено</p>
                </motion.div>
              ) : (
                visibleGroups.map((group) => (
                  <motion.div key={group} variants={itemVariants}>
                    <GroupSection group={group} entries={filtered.filter((p) => p.group === group)}
                      viewMode={viewMode} onDelete={handleDelete} />
                  </motion.div>
                ))
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
          <AddEntryModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} defaultGroup={activeGroup} />
        )}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>
    </main>
  )
}
