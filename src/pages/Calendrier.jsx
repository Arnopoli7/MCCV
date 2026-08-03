import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { useToast } from '../contexts/ToastContext'
import Modal from '../components/ui/Modal'
import { MultiFileUpload } from '../components/ui/FileUpload'
import { formatDateLong, parseISO, isBefore, isSameDay, combineDateAndTime } from '../utils/dateUtils'
import '../styles/calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales: { fr },
})

const MESSAGES = {
  today: "Aujourd'hui",
  previous: '‹',
  next: '›',
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Agenda',
  noEventsInRange: 'Aucune séance sur cette période.',
  showMore: n => `+ ${n} de plus`,
}

const TYPE_COLORS = {
  'Cours':          { border: '#3b82f6', badge: '#dbeafe', badgeText: '#1d4ed8' },
  'TD / Exercices': { border: '#f97316', badge: '#ffedd5', badgeText: '#c2410c' },
  'Évaluation':     { border: '#ef4444', badge: '#fee2e2', badgeText: '#b91c1c' },
}

function SeanceEvent({ event, calView }) {
  if (event.isVacances || event.isStage) {
    return <span style={{ fontSize: 11 }}>{event.title}</span>
  }

  if (event.isMerged) {
    if (calView === Views.MONTH) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', padding: '1px 4px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: event.classeCouleur, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {event.title}
          </span>
          <span style={{ fontSize: 9, background: '#e2e8f0', color: '#475569', borderRadius: 4, padding: '0 4px', fontWeight: 700, flexShrink: 0 }}>
            {event.count}
          </span>
        </div>
      )
    }
    return (
      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.title}
        </p>
        <span style={{
          display: 'inline-block',
          fontSize: 9,
          padding: '1px 5px',
          borderRadius: 4,
          backgroundColor: '#e2e8f0',
          color: '#475569',
          fontWeight: 700,
          alignSelf: 'flex-start',
          whiteSpace: 'nowrap',
        }}>
          {event.count} classes
        </span>
      </div>
    )
  }

  const tc = TYPE_COLORS[event.type] || { border: '#94a3b8', badge: '#f1f5f9', badgeText: '#64748b' }

  if (calView === Views.MONTH) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', padding: '1px 4px' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: tc.border, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.title}
        </span>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {event.title}
      </p>
      {event.matiereNom && (
        <p style={{ fontSize: 10, opacity: 0.8, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.matiereNom}
        </p>
      )}
      {event.classeNom && (
        <p style={{ fontSize: 10, opacity: 0.7, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.classeNom}
        </p>
      )}
      {event.type && (
        <span style={{
          display: 'inline-block',
          fontSize: 9,
          padding: '1px 5px',
          borderRadius: 4,
          backgroundColor: tc.badge,
          color: tc.badgeText,
          fontWeight: 700,
          alignSelf: 'flex-start',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          maxWidth: '100%',
          textOverflow: 'ellipsis',
        }}>
          {event.type}
        </span>
      )}
    </div>
  )
}

function CalToolbar({ onNavigate, label, view, onView }) {
  return (
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        >
          <ChevronRight size={15} />
        </button>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 ml-2 capitalize">
          {label}
        </span>
      </div>
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onView(Views.DAY)}
          className={`px-2 md:px-3 py-1 text-xs rounded-md font-medium transition-colors ${
            view === Views.DAY
              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Jour
        </button>
        <button
          onClick={() => onView(Views.WEEK)}
          className={`px-2 md:px-3 py-1 text-xs rounded-md font-medium transition-colors ${
            view === Views.WEEK
              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Semaine
        </button>
        <button
          onClick={() => onView(Views.MONTH)}
          className={`px-2 md:px-3 py-1 text-xs rounded-md font-medium transition-colors ${
            view === Views.MONTH
              ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Mois
        </button>
      </div>
    </div>
  )
}

export default function Calendrier() {
  const navigate = useNavigate()
  const { classes, seancesCalendrier, rubanPedagogique, vacances, stages, getAnneeActive, update, cleanOrphanCalendarEvents } = useData()
  const toast = useToast()

  const [calView, setCalView] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768 ? Views.DAY : Views.WEEK
  )
  const [calDate, setCalDate] = useState(new Date())
  const [filterClasseId, setFilterClasseId] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [mergedSlotKey, setMergedSlotKey] = useState(null)

  const anneeActive = getAnneeActive()

  useEffect(() => { cleanOrphanCalendarEvents(anneeActive?.id) }, [anneeActive?.id]) // eslint-disable-line
  const anneeId = anneeActive?.id

  const allClasses = classes()
  const allRubans = rubanPedagogique()
  const vacancesList = vacances(anneeId)
  const stagesList = stages(anneeId)

  function getSeanceInfo(s) {
    if (s.titre) return { titre: s.titre, type: s.type }
    for (const rb of allRubans) {
      for (const seq of (rb.sequences || [])) {
        const found = (seq.seances || []).find(rs => rs.id === s.seanceRubanId)
        if (found) return { titre: found.titre, type: found.type }
      }
    }
    return { titre: 'Séance', type: null }
  }

  function getStatut(s) {
    if (s.statut === 'faite') return 'faite'
    try {
      const d = parseISO(s.date)
      if (isBefore(d, new Date()) && !isSameDay(d, new Date())) return 'en retard'
    } catch {}
    return 'à faire'
  }

  let allSeances = seancesCalendrier(anneeId ? { anneeScolaireId: anneeId } : {})
  if (filterClasseId !== 'all') {
    allSeances = allSeances.filter(s => s.classeId === filterClasseId)
  }

  // Group séances by slot (date + heureDebut + heureFin)
  const slotMap = {}
  allSeances.forEach(s => {
    const key = `${s.date}|${s.heureDebut}|${s.heureFin}`
    if (!slotMap[key]) slotMap[key] = []
    slotMap[key].push(s)
  })

  const seanceEvents = Object.values(slotMap).map(group => {
    const s0 = group[0]
    const start = combineDateAndTime(s0.date, s0.heureDebut || '08:00')
    const end = combineDateAndTime(s0.date, s0.heureFin || '09:00')

    if (group.length === 1) {
      const s = group[0]
      const info = getSeanceInfo(s)
      const classe = allClasses.find(c => c.id === s.classeId)
      const matiereNom = s.matiereId
        ? (classe?.matieres?.find(m => m.id === s.matiereId)?.nom || 'Non définie')
        : 'Matière non définie'
      return {
        id: s.id,
        title: info.titre,
        start, end,
        resource: s,
        type: info.type,
        classeNom: classe?.nom || '',
        classeCouleur: classe?.couleur || '#94a3b8',
        matiereNom,
        statut: getStatut(s),
        isVacances: false,
      }
    }

    // Merged event: multiple classes at same slot
    const groupClasses = group.map(s => allClasses.find(c => c.id === s.classeId))
    const classesNoms = groupClasses.map(c => c?.nom || '?')
    const infos = group.map(s => getSeanceInfo(s))
    const uniqueTitres = [...new Set(infos.map(i => i.titre))]
    const matiereNoms = group.map((s, i) => {
      const cl = groupClasses[i]
      return s.matiereId ? (cl?.matieres?.find(m => m.id === s.matiereId)?.nom || null) : null
    })
    const uniqueMatieres = [...new Set(matiereNoms.filter(Boolean))]

    let title
    if (uniqueTitres.length === 1 && uniqueMatieres.length === 1) {
      title = `${uniqueMatieres[0]} — ${classesNoms.join(' / ')}`
    } else if (uniqueTitres.length === 1) {
      title = `${uniqueTitres[0]} — ${classesNoms.join(' / ')}`
    } else {
      title = classesNoms.join(' / ')
    }

    return {
      id: `merged_${s0.date}_${s0.heureDebut}`,
      title,
      start, end,
      isMerged: true,
      mergedSeances: group,
      mergedClasses: groupClasses,
      classesNoms,
      classeCouleur: groupClasses[0]?.couleur || '#94a3b8',
      count: group.length,
      isVacances: false,
    }
  })

  const vacanceEvents = vacancesList.map(v => ({
    id: v.id,
    title: `🏖 ${v.nom}`,
    start: parseISO(v.dateDebut),
    end: parseISO(v.dateFin),
    resource: v,
    isVacances: true,
    allDay: true,
  }))

  const stageEvents = stagesList.map(s => ({
    id: s.id,
    title: `Stage : ${s.nom}`,
    start: parseISO(s.dateDebut),
    end: parseISO(s.dateFin),
    resource: s,
    isStage: true,
    allDay: true,
  }))

  const allEvents = [...seanceEvents, ...vacanceEvents, ...stageEvents]

  function eventStyleGetter(event) {
    if (event.isVacances) {
      return {
        style: {
          backgroundColor: '#f1f5f9',
          color: '#94a3b8',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.7rem',
        }
      }
    }
    if (event.isStage) {
      return {
        style: {
          backgroundColor: '#fed7aa',
          color: '#c2410c',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.7rem',
          fontWeight: 600,
        }
      }
    }
    if (event.isMerged) {
      return {
        style: {
          backgroundColor: event.classeCouleur + 'aa',
          borderLeft: `4px solid ${event.classeCouleur}`,
          borderTop: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          borderRadius: '10px',
          color: '#1e293b',
          fontSize: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }
      }
    }
    const tc = TYPE_COLORS[event.type] || { border: '#94a3b8' }
    const bgColor = event.statut === 'en retard' ? '#fee2e2' : (event.classeCouleur + 'cc')
    const textColor = event.statut === 'en retard' ? '#991b1b' : '#1e293b'
    return {
      style: {
        backgroundColor: bgColor,
        borderLeft: `4px solid ${tc.border}`,
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: '10px',
        color: textColor,
        fontSize: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }
    }
  }

  function handleSelectEvent(event) {
    if (event.isVacances || event.isStage) return
    if (event.isMerged) {
      setMergedSlotKey(event.id)
      return
    }
    setSelectedEvent({ seance: event.resource, info: getSeanceInfo(event.resource) })
  }

  function toggleStatut() {
    if (!selectedEvent) return
    const { seance } = selectedEvent
    const current = getStatut(seance)
    const newStatut = current === 'faite' ? 'à faire' : 'faite'
    update('seancesCalendrier', seance.id, { statut: newStatut })
    setSelectedEvent(prev => prev
      ? { ...prev, seance: { ...prev.seance, statut: newStatut } }
      : null
    )
    toast.success(newStatut === 'faite' ? 'Séance marquée faite ✓' : 'Séance remise à faire.')
  }

  function addDoc(doc) {
    if (!selectedEvent) return
    const { seance } = selectedEvent
    const docs = [...(seance.documents || []), doc]
    update('seancesCalendrier', seance.id, { documents: docs })
    setSelectedEvent(prev => prev ? { ...prev, seance: { ...prev.seance, documents: docs } } : null)
    toast.success('Document ajouté.')
  }

  function removeDoc(idx) {
    if (!selectedEvent) return
    const { seance } = selectedEvent
    const docs = (seance.documents || []).filter((_, i) => i !== idx)
    update('seancesCalendrier', seance.id, { documents: docs })
    setSelectedEvent(prev => prev ? { ...prev, seance: { ...prev.seance, documents: docs } } : null)
    toast.info('Document supprimé.')
  }

  // Derived merged event — always reads from up-to-date seanceEvents
  const mergedEvent = mergedSlotKey ? seanceEvents.find(e => e.id === mergedSlotKey) : null

  function markAllDone() {
    if (!mergedEvent) return
    mergedEvent.mergedSeances.forEach(s => {
      if (getStatut(s) !== 'faite') {
        update('seancesCalendrier', s.id, { statut: 'faite' })
      }
    })
    toast.success('Toutes les séances marquées comme faites ✓')
  }

  const selSeance = selectedEvent?.seance || null
  const selInfo = selectedEvent?.info || null
  const selStatut = selSeance ? getStatut(selSeance) : null
  const selClasse = selSeance ? allClasses.find(c => c.id === selSeance.classeId) : null
  const selMatiereNom = selSeance?.matiereId
    ? (selClasse?.matieres?.find(m => m.id === selSeance.matiereId)?.nom || 'Non définie')
    : null

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calendrier global</h1>

        <select
          value={filterClasseId}
          onChange={e => setFilterClasseId(e.target.value)}
          className="input max-w-xs"
        >
          <option value="all">Toutes les classes</option>
          {allClasses.map(c => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      {allClasses.length > 0 && filterClasseId === 'all' && (
        <div className="flex flex-wrap gap-3">
          {allClasses.map(c => (
            <button
              key={c.id}
              onClick={() => setFilterClasseId(c.id)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80"
              style={{ borderColor: c.couleur, color: c.couleur, backgroundColor: c.couleur + '22' }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: c.couleur, display: 'inline-block' }} />
              {c.nom}
            </button>
          ))}
        </div>
      )}

      <div className="card p-4">
        {allSeances.length === 0 && (
          <div className="text-center text-sm text-gray-400 mb-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            Aucune séance déployée sur le calendrier pour l'année en cours.
          </div>
        )}
        <Calendar
          localizer={localizer}
          events={allEvents}
          view={calView}
          onView={setCalView}
          date={calDate}
          onNavigate={setCalDate}
          views={[Views.WEEK, Views.MONTH]}
          culture="fr"
          messages={MESSAGES}
          style={{ height: 660 }}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 18, 0, 0)}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          components={{
            event: (props) => <SeanceEvent {...props} calView={calView} />,
            toolbar: CalToolbar,
          }}
          popup
          tooltipAccessor={event => {
            if (event.isVacances || event.isStage) return event.title
            if (event.isMerged) return `${event.title} — ${event.count} classes`
            return `${event.title}${event.matiereNom ? ` — ${event.matiereNom}` : ''}${event.type ? ` — ${event.type}` : ''} (${event.classeNom})`
          }}
        />
      </div>

      {/* Modal créneau fusionné */}
      <Modal
        isOpen={!!mergedSlotKey}
        onClose={() => setMergedSlotKey(null)}
        title={mergedEvent ? `${mergedEvent.count} classes — même créneau` : ''}
        size="lg"
      >
        {mergedEvent && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(mergedEvent.start, 'EEEE d MMMM yyyy', { locale: fr })} · {mergedEvent.mergedSeances[0]?.heureDebut} – {mergedEvent.mergedSeances[0]?.heureFin}
            </p>

            <div className="space-y-2">
              {mergedEvent.mergedSeances.map((s, i) => {
                const cl = mergedEvent.mergedClasses[i]
                const info = getSeanceInfo(s)
                const statut = getStatut(s)
                const matiereNom = s.matiereId
                  ? (cl?.matieres?.find(m => m.id === s.matiereId)?.nom || null)
                  : null
                return (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      statut === 'faite'
                        ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                        : statut === 'en retard'
                        ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    {cl && (
                      <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: cl.couleur }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {cl && (
                          <span className="text-xs font-bold shrink-0" style={{ color: cl.couleur }}>{cl.nom}</span>
                        )}
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{info.titre}</span>
                        {matiereNom && (
                          <span className="text-xs text-gray-400 truncate">{matiereNom}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          statut === 'faite' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : statut === 'en retard' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        }`}>
                          {statut === 'faite' ? '✓ Faite' : statut === 'en retard' ? 'En retard' : 'À faire'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          const newStatut = statut === 'faite' ? 'à faire' : 'faite'
                          update('seancesCalendrier', s.id, { statut: newStatut })
                          toast.success(newStatut === 'faite' ? 'Séance marquée faite ✓' : 'Séance remise à faire.')
                        }}
                        className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                          statut === 'faite'
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-orange-100 hover:text-orange-600'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200'
                        }`}
                        title={statut === 'faite' ? 'Remettre à faire' : 'Marquer faite'}
                      >
                        {statut === 'faite' ? <Clock size={14} /> : <CheckCircle size={14} />}
                      </button>
                      {cl && (
                        <button
                          onClick={() => { setMergedSlotKey(null); navigate(`/classes/${cl.id}?tab=seances`) }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium"
                        >
                          Fiche →
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {mergedEvent.mergedSeances.some(s => getStatut(s) !== 'faite') && (
              <button
                onClick={markAllDone}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-sm transition-colors"
              >
                <CheckCircle size={16} /> Tout marquer comme fait
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Modal détail séance */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selInfo?.titre || 'Fiche séance'}
        size="md"
      >
        {selSeance && selInfo && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {selClasse && (
                <div>
                  <p className="text-gray-400 mb-0.5">Classe</p>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: selClasse.couleur }}
                    />
                    <p className="font-medium text-gray-800 dark:text-gray-100">{selClasse.nom}</p>
                  </div>
                </div>
              )}
              {selMatiereNom && (
                <div>
                  <p className="text-gray-400 mb-0.5">Matière</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selMatiereNom}</p>
                </div>
              )}
              {selInfo.type && (
                <div>
                  <p className="text-gray-400 mb-0.5">Type</p>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{selInfo.type}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 mb-0.5">Date</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">{formatDateLong(selSeance.date)}</p>
              </div>
              <div>
                <p className="text-gray-400 mb-0.5">Horaire</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {selSeance.heureDebut} – {selSeance.heureFin}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Statut</p>
              <button
                onClick={toggleStatut}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm border-2 transition-all
                  ${selStatut === 'faite'
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  }`}
              >
                {selStatut === 'faite'
                  ? <><CheckCircle size={16} /> Faite — cliquer pour remettre à faire</>
                  : <><Clock size={16} /> À faire — cliquer pour marquer faite</>
                }
              </button>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                Documents ({(selSeance.documents || []).length})
              </p>
              <MultiFileUpload
                files={selSeance.documents || []}
                onAdd={addDoc}
                onRemove={removeDoc}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
