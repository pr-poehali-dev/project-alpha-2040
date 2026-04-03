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

const glassCard: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.45)",
  backdropFilter: "blur(40px) saturate(180%)",
  WebkitBackdropFilter: "blur(40px) saturate(180%)",
  boxShadow:
    "inset 0 1px 1px rgba(255,255,255,0.9), 0 0 0 1px rgba(255,255,255,0.6), 0 4px 16px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.5)",
}

const glassBtn: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.6)",
  boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 2px 6px rgba(0,0,0,0.06)",
}

type ViewMode = "manager" | "simple"

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <motion.button
      onClick={copy}
      style={glassBtn}
      className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors shrink-0"
      whileTap={{ scale: 0.9 }}
      title="Копировать"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
            <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function PasswordCard({
  entry,
  viewMode,
  onDelete,
}: {
  entry: PasswordEntry
  viewMode: ViewMode
  onDelete: (id: number) => void
}) {
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={glassCard}
      className="rounded-[20px] px-4 py-3.5 relative overflow-hidden"
    >
      <div
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none rounded-t-[20px]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)" }}
      />

      <div className="relative flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-2">
          {/* Site */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Сайт</span>
            <span className="text-[13px] font-semibold text-gray-800 truncate flex-1">{entry.site}</span>
            <CopyButton text={entry.site} />
          </div>
          {/* Login */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Логин</span>
            <span className="text-[13px] text-gray-700 truncate flex-1">{entry.login}</span>
            <CopyButton text={entry.login} />
          </div>
          {/* Password */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider w-14 shrink-0">Пароль</span>
            <span className="text-[13px] font-mono text-gray-700 truncate flex-1">
              {showPassword ? entry.password : "•".repeat(Math.min(entry.password.length, 12))}
            </span>
            {viewMode === "manager" && (
              <motion.button
                onClick={() => setVisible(!visible)}
                style={glassBtn}
                className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors shrink-0"
                whileTap={{ scale: 0.9 }}
              >
                {visible ? (
                  <EyeOff className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </motion.button>
            )}
            <CopyButton text={entry.password} />
          </div>
        </div>

        {/* Context menu */}
        <div className="relative" ref={menuRef}>
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            style={glassBtn}
            className="rounded-xl p-1.5 text-gray-500 hover:text-gray-800 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <MoreVertical className="h-4 w-4" strokeWidth={2} />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                }}
                className="absolute right-0 top-8 z-50 rounded-[16px] py-1.5 min-w-[160px] overflow-hidden"
              >
                <button className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-gray-700 hover:bg-white/60 transition-colors">
                  <Pencil className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
                  Редактировать
                </button>
                <div className="mx-3 my-1 h-px bg-gray-200/60" />
                <button
                  onClick={() => {
                    onDelete(entry.id)
                    setMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-[13px] text-red-500 hover:bg-red-50/60 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                  Удалить
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function GroupSection({
  group,
  entries,
  viewMode,
  onDelete,
}: {
  group: string
  entries: PasswordEntry[]
  viewMode: ViewMode
  onDelete: (id: number) => void
}) {
  const [open, setOpen] = useState(true)
  const Icon = groupIcons[group] || Lock
  const gradient = groupColors[group] || "from-gray-400/20 to-slate-400/20"

  return (
    <motion.div layout className="space-y-2">
      <motion.button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[16px] bg-gradient-to-r ${gradient}`}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.04)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="flex h-7 w-7 items-center justify-center rounded-xl shrink-0"
          style={{
            background: "rgba(255,255,255,0.8)",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.06)",
          }}
        >
          <Icon className="h-4 w-4 text-gray-600" strokeWidth={1.75} />
        </div>
        <span className="flex-1 text-left text-[14px] font-semibold text-gray-800">{group}</span>
        <span
          className="text-[11px] font-semibold text-gray-500 px-2 py-0.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.7)" }}
        >
          {entries.length}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" strokeWidth={2} />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-2 pl-2 overflow-hidden"
          >
            <AnimatePresence>
              {entries.map((entry) => (
                <PasswordCard key={entry.id} entry={entry} viewMode={viewMode} onDelete={onDelete} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

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

  const visibleGroups =
    activeGroup === "Все" ? Array.from(new Set(filtered.map((p) => p.group))) : [activeGroup]

  const handleDelete = (id: number) => setPasswords((prev) => prev.filter((p) => p.id !== id))

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)", filter: "blur(80px)", top: "30%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(70px)", bottom: "-5%", left: "20%" }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Layout: sidebar + content */}
      <div className="relative z-10 flex min-h-screen">
        {/* RIGHT sidebar — groups */}
        <aside className="fixed right-0 top-0 h-full w-[68px] flex flex-col items-center py-8 gap-2 z-20">
          <div
            className="flex flex-col items-center gap-2 px-2 py-3 rounded-[22px]"
            style={{
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(30px) saturate(180%)",
              WebkitBackdropFilter: "blur(30px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9), 0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {allGroups.map((group) => {
              const Icon = groupIcons[group] || Lock
              const isActive = activeGroup === group
              const accent = groupAccent[group] || "rgba(100,116,139,0.8)"
              return (
                <motion.button
                  key={group}
                  onClick={() => setActiveGroup(group)}
                  title={group}
                  className="relative flex flex-col items-center gap-1 w-12 py-2 rounded-[14px] transition-all"
                  style={
                    isActive
                      ? {
                          background: accent,
                          boxShadow: `0 4px 14px ${accent}55, inset 0 1px 1px rgba(255,255,255,0.3)`,
                        }
                      : {
                          background: "rgba(255,255,255,0.5)",
                          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.9)",
                        }
                  }
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <Icon
                    className="h-4 w-4"
                    strokeWidth={isActive ? 2.2 : 1.75}
                    style={{ color: isActive ? "white" : "#6b7280" }}
                  />
                  <span
                    className="text-[9px] font-semibold leading-tight text-center"
                    style={{ color: isActive ? "white" : "#9ca3af" }}
                  >
                    {group === "Финансы" ? "Фин." : group === "Прочее" ? "Проч." : group.slice(0, 5)}
                  </span>
                  {/* count badge */}
                  <span
                    className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                      color: isActive ? "white" : "#6b7280",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      display: group === "Все" ? "none" : "flex",
                    }}
                  >
                    {passwords.filter((p) => p.group === group).length}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </aside>

        {/* Main content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 mx-auto max-w-[460px] w-full flex flex-col gap-5 px-4 py-8 pr-[84px]"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-[18px] shrink-0"
                style={{
                  background: "linear-gradient(135deg, rgba(147,51,234,0.9), rgba(236,72,153,0.9))",
                  boxShadow: "0 4px 16px rgba(147,51,234,0.35), inset 0 1px 1px rgba(255,255,255,0.3)",
                }}
              >
                <Lock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-[20px] font-bold text-gray-900 tracking-tight leading-tight">Мои пароли</h1>
                <p className="text-[12px] text-gray-500">{passwords.length} записей</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="relative" ref={modeMenuRef}>
                <motion.button
                  onClick={() => setModeMenuOpen(!modeMenuOpen)}
                  style={glassBtn}
                  className="flex items-center gap-1.5 rounded-[12px] px-3 py-2.5 text-gray-600 text-[12px] font-medium"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  title="Режим отображения"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
                  <span className="hidden sm:inline">
                    {viewMode === "manager" ? "Менеджер" : "Обычный"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {modeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(30px)",
                        WebkitBackdropFilter: "blur(30px)",
                        border: "1px solid rgba(255,255,255,0.7)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
                      }}
                      className="absolute right-0 top-11 z-50 rounded-[18px] py-2 min-w-[200px] overflow-hidden"
                    >
                      <div className="px-3.5 pb-1.5">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Режим отображения
                        </span>
                      </div>

                      <button
                        onClick={() => { setViewMode("manager"); setModeMenuOpen(false) }}
                        className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-white/60 transition-colors"
                      >
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]"
                          style={{
                            background: viewMode === "manager"
                              ? "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))"
                              : "rgba(241,245,249,1)",
                          }}
                        >
                          <KeyRound
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            style={{ color: viewMode === "manager" ? "white" : "#6b7280" }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[13px] font-semibold text-gray-800">Менеджер паролей</p>
                          <p className="text-[11px] text-gray-500 leading-tight">Пароли скрыты, нужен глаз</p>
                        </div>
                        {viewMode === "manager" && (
                          <Check className="h-4 w-4 text-purple-500 ml-auto mt-1 shrink-0" strokeWidth={2.5} />
                        )}
                      </button>

                      <button
                        onClick={() => { setViewMode("simple"); setModeMenuOpen(false) }}
                        className="w-full flex items-start gap-3 px-3.5 py-2.5 hover:bg-white/60 transition-colors"
                      >
                        <div
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px]"
                          style={{
                            background: viewMode === "simple"
                              ? "linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85))"
                              : "rgba(241,245,249,1)",
                          }}
                        >
                          <List
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            style={{ color: viewMode === "simple" ? "white" : "#6b7280" }}
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-[13px] font-semibold text-gray-800">Обычный список</p>
                          <p className="text-[11px] text-gray-500 leading-tight">Все пароли видны сразу</p>
                        </div>
                        {viewMode === "simple" && (
                          <Check className="h-4 w-4 text-blue-500 ml-auto mt-1 shrink-0" strokeWidth={2.5} />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add button */}
              <motion.button
                style={{
                  background: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))",
                  boxShadow: "0 4px 14px rgba(147,51,234,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                className="flex items-center gap-1.5 rounded-[14px] px-3.5 py-2.5 text-white text-[13px] font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                <span className="hidden sm:inline">Добавить</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Active group label */}
          <AnimatePresence mode="wait">
            {activeGroup !== "Все" && (
              <motion.div
                key={activeGroup}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-2"
              >
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[12px] font-semibold"
                  style={{
                    background: groupAccent[activeGroup] || "rgba(100,116,139,0.8)",
                    boxShadow: `0 2px 10px ${groupAccent[activeGroup]}55`,
                  }}
                >
                  {(() => { const Icon = groupIcons[activeGroup] || Lock; return <Icon className="h-3.5 w-3.5" strokeWidth={2} /> })()}
                  {activeGroup}
                </div>
                <button
                  onClick={() => setActiveGroup("Все")}
                  className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Показать все
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search */}
          <motion.div variants={itemVariants}>
            <div style={glassCard} className="rounded-[18px] flex items-center gap-3 px-4 py-3">
              <Search className="h-4 w-4 text-gray-400 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Поиск по сайту, логину..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-gray-800 placeholder-gray-400 outline-none"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={glassCard}
                  className="rounded-[20px] px-6 py-10 text-center"
                >
                  <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[14px] text-gray-500">Ничего не найдено</p>
                </motion.div>
              ) : (
                visibleGroups.map((group) => (
                  <motion.div key={group} variants={itemVariants}>
                    <GroupSection
                      group={group}
                      entries={filtered.filter((p) => p.group === group)}
                      viewMode={viewMode}
                      onDelete={handleDelete}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="text-center pb-4">
            <p className="text-[11px] text-gray-400">🔐 Данные хранятся локально</p>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
