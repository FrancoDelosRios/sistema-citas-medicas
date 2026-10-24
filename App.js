import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, 
  Search, Stethoscope, Shield, ChevronRight, X, AlertCircle, 
  MapPin, Star, Award, HeartHandshake, Download, Plus, Filter,
  Trash2, RefreshCw, CalendarDays, Check, Lock, ChevronLeft
} from 'lucide-react';

// --- MOCK DATA ---
const SPECIALTIES = [
  { id: 'cardio', name: 'Cardiología', icon: 'Heart', description: 'Cuidado integral del corazón y sistema cardiovascular.' },
  { id: 'pedia', name: 'Pediatría', icon: 'Baby', description: 'Atención médica especializada para bebés, niños y adolescentes.' },
  { id: 'derma', name: 'Dermatología', icon: 'Sparkles', description: 'Diagnóstico y tratamiento para la salud de la piel y cabello.' },
  { id: 'odonto', name: 'Odontología', icon: 'Smile', description: 'Salud bucal, prevención, ortodoncia y estética dental.' },
  { id: 'neuro', name: 'Neurología', icon: 'Brain', description: 'Especialistas en el sistema nervioso central y periférico.' },
  { id: 'trauma', name: 'Traumatología', icon: 'Bone', description: 'Tratamiento de lesiones óseas, articulares y musculares.' },
];

const DOCTORS = [
  {
    id: 'doc-1',
    name: 'Dr. Alejandro Morales',
    specialtyId: 'cardio',
    specialtyName: 'Cardiología',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 124,
    experience: '12 años de exp.',
    fee: 150,
    hospital: 'Sede Central - San Isidro',
    cmp: 'CMP 45892'
  },
  {
    id: 'doc-2',
    name: 'Dra. Elena Rostova',
    specialtyId: 'derma',
    specialtyName: 'Dermatología',
    avatar: 'https://images.unsplash.com/photo-1594824813566-78a08c02888f?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 98,
    experience: '9 años de exp.',
    fee: 130,
    hospital: 'Sede Miraflores',
    cmp: 'CMP 51204'
  },
  {
    id: 'doc-3',
    name: 'Dr. Roberto Mendoza',
    specialtyId: 'pedia',
    specialtyName: 'Pediatría',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    rating: 5.0,
    reviews: 210,
    experience: '15 años de exp.',
    fee: 120,
    hospital: 'Sede Central - San Isidro',
    cmp: 'CMP 38910'
  },
  {
    id: 'doc-4',
    name: 'Dra. Carmen Salazar',
    specialtyId: 'odonto',
    specialtyName: 'Odontología',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    rating: 4.7,
    reviews: 85,
    experience: '8 años de exp.',
    fee: 110,
    hospital: 'Sede Surco',
    cmp: 'CMP 54120'
  },
  {
    id: 'doc-5',
    name: 'Dr. Fernando Torres',
    specialtyId: 'neuro',
    specialtyName: 'Neurología',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    rating: 4.9,
    reviews: 142,
    experience: '14 años de exp.',
    fee: 180,
    hospital: 'Sede Central - San Isidro',
    cmp: 'CMP 41093'
  },
  {
    id: 'doc-6',
    name: 'Dra. Sofia Vargas',
    specialtyId: 'trauma',
    specialtyName: 'Traumatología',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=400',
    rating: 4.8,
    reviews: 115,
    experience: '10 años de exp.',
    fee: 140,
    hospital: 'Sede Miraflores',
    cmp: 'CMP 48721'
  }
];

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:30 AM', '11:30 AM', 
  '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'CIT-9821',
    doctor: DOCTORS[0],
    specialty: 'Cardiología',
    date: '2026-11-05',
    time: '10:30 AM',
    patientName: 'Carlos Benítez',
    patientDni: '47891234',
    patientPhone: '+51 987 654 321',
    patientEmail: 'carlos.benitez@example.com',
    insurance: 'Rímac EPS',
    reason: 'Chequeo preventivo anual y control de presión arterial.',
    status: 'Confirmada',
    createdAt: '2026-10-20'
  },
  {
    id: 'CIT-8812',
    doctor: DOCTORS[2],
    specialty: 'Pediatría',
    date: '2026-11-12',
    time: '03:30 PM',
    patientName: 'Sofía Benítez (Hija)',
    patientDni: '78129034',
    patientPhone: '+51 987 654 321',
    patientEmail: 'carlos.benitez@example.com',
    insurance: 'Particular',
    reason: 'Evaluación de desarrollo y vacunación.',
    status: 'Pendiente',
    createdAt: '2026-10-22'
  }
];

export default function App() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState('inicio'); // 'inicio', 'especialidades', 'medicos', 'citas'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  
  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Appointments State
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [appointmentFilter, setAppointmentFilter] = useState('todas'); // 'todas', 'Confirmada', 'Pendiente', 'Cancelada'

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    specialty: '',
    doctorId: '',
    date: '',
    time: '',
    patientName: '',
    patientDni: '',
    patientPhone: '',
    patientEmail: '',
    insurance: 'Particular',
    reason: ''
  });

  // Directory Filters
  const [doctorSearch, setDoctorSearch] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('todos');

  // Helper for step navigation
  const handleOpenBooking = (specialtyId = '', doctorId = '') => {
    setBookingData({
      specialty: specialtyId,
      doctorId: doctorId,
      date: new Date().toISOString().split('T')[0],
      time: '',
      patientName: '',
      patientDni: '',
      patientPhone: '',
      patientEmail: '',
      insurance: 'Particular',
      reason: ''
    });

    if (doctorId) {
      const doc = DOCTORS.find(d => d.id === doctorId);
      if (doc) {
        setBookingData(prev => ({ ...prev, specialty: doc.specialtyId, doctorId: doc.id }));
        setStep(3);
      } else {
        setStep(1);
      }
    } else if (specialtyId) {
      setStep(2);
    } else {
      setStep(1);
    }

    setIsModalOpen(true);
  };

  const handleNextStep = () => {
    if (step === 1 && !bookingData.specialty) {
      showToast('Por favor selecciona una especialidad.', 'error');
      return;
    }
    if (step === 2 && !bookingData.doctorId) {
      showToast('Por favor elige a un médico.', 'error');
      return;
    }
    if (step === 3 && (!bookingData.date || !bookingData.time)) {
      showToast('Selecciona la fecha y la hora para tu cita.', 'error');
      return;
    }
    if (step === 4) {
      if (!bookingData.patientName || !bookingData.patientDni || !bookingData.patientPhone) {
        showToast('Completa los campos obligatorios del paciente.', 'error');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleConfirmBooking = () => {
    const selectedDoc = DOCTORS.find(d => d.id === bookingData.doctorId);
    const selectedSpec = SPECIALTIES.find(s => s.id === bookingData.specialty);

    const newAppointment = {
      id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctor: selectedDoc,
      specialty: selectedSpec ? selectedSpec.name : selectedDoc.specialtyName,
      date: bookingData.date,
      time: bookingData.time,
      patientName: bookingData.patientName,
      patientDni: bookingData.patientDni,
      patientPhone: bookingData.patientPhone,
      patientEmail: bookingData.patientEmail,
      insurance: bookingData.insurance,
      reason: bookingData.reason,
      status: 'Confirmada',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAppointments([newAppointment, ...appointments]);
    setStep(5); // Show ticket/confirmation
    showToast('¡Cita agendada con éxito!');
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: 'Cancelada' } : app
    ));
    showToast('La cita ha sido cancelada.', 'info');
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                            doc.specialtyName.toLowerCase().includes(doctorSearch.toLowerCase());
      const matchesSpec = selectedSpecialtyFilter === 'todos' || doc.specialtyId === selectedSpecialtyFilter;
      return matchesSearch && matchesSpec;
    });
  }, [doctorSearch, selectedSpecialtyFilter]);

  // Filtered User Appointments
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'todas') return appointments;
    return appointments.filter(a => a.status === appointmentFilter);
  }, [appointments, appointmentFilter]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-direction-col relative">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium transition-all transform duration-300 ${
          toast.type === 'error' ? 'bg-red-600' : toast.type === 'info' ? 'bg-amber-600' : 'bg-teal-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inicio')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">SaludPlus</span>
              <span className="block text-xs font-semibold text-teal-600 tracking-wider uppercase">Portal Médico</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('inicio')}
              className={`font-semibold text-sm transition-colors ${activeTab === 'inicio' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Inicio
            </button>
            <button 
              onClick={() => setActiveTab('especialidades')}
              className={`font-semibold text-sm transition-colors ${activeTab === 'especialidades' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Especialidades
            </button>
            <button 
              onClick={() => setActiveTab('medicos')}
              className={`font-semibold text-sm transition-colors ${activeTab === 'medicos' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Staff Médico
            </button>
            <button 
              onClick={() => setActiveTab('citas')}
              className={`font-semibold text-sm transition-colors relative ${activeTab === 'citas' ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Mis Citas
              {appointments.filter(a => a.status === 'Confirmada').length > 0 && (
                <span className="absolute -top-2 -right-3 bg-teal-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {appointments.filter(a => a.status === 'Confirmada').length}
                </span>
              )}
            </button>
          </nav>

          {/* CTA Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenBooking()}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/20 transition-all transform active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agendar Cita</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-grow">
        
        {/* --- VIEW: INICIO --- */}
        {activeTab === 'inicio' && (
          <div>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-slate-900 py-20 lg:py-28 text-white">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
                
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6">
                    <Shield className="w-4 h-4" />
                    <span>Atención Médica Digital & Presencial</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white mb-6">
                    Tu salud en las <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">mejores manos.</span>
                  </h1>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    Reserva tu cita médica presencial o virtual en segundos. Accede a más de 100 especialistas de primer nivel, disponibilidad en tiempo real y gestión sin complicaciones.
                  </p>

                  {/* Quick Search Bar Box */}
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="grid sm:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Especialidad</label>
                        <select 
                          className="w-full bg-slate-800 text-white text-sm rounded-lg p-2.5 border border-slate-700 focus:ring-2 focus:ring-teal-400 outline-none"
                          onChange={(e) => setBookingData(prev => ({ ...prev, specialty: e.target.value }))}
                        >
                          <option value="">Todas las especialidades</option>
                          {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Médico</label>
                        <select 
                          className="w-full bg-slate-800 text-white text-sm rounded-lg p-2.5 border border-slate-700 focus:ring-2 focus:ring-teal-400 outline-none"
                          onChange={(e) => setBookingData(prev => ({ ...prev, doctorId: e.target.value }))}
                        >
                          <option value="">Cualquier médico disponible</option>
                          {DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Fecha Preferida</label>
                        <input 
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-slate-800 text-white text-sm rounded-lg p-2.5 border border-slate-700 focus:ring-2 focus:ring-teal-400 outline-none"
                          onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => handleOpenBooking(bookingData.specialty, bookingData.doctorId)}
                      className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-sm py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Search className="w-4 h-4" />
                      <span>Buscar Disponibilidad y Reservar</span>
                    </button>
                  </div>
                </div>

                {/* Hero Illustration / Feature Visual */}
                <div className="relative hidden lg:block">
                  <div className="relative mx-auto w-full max-w-md bg-gradient-to-b from-teal-500/20 to-transparent p-1 rounded-3xl border border-teal-500/30">
                    <div className="bg-slate-900/90 rounded-[22px] p-6 shadow-2xl">
                      <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                        <img src={DOCTORS[0].avatar} alt="Dr." className="w-14 h-14 rounded-full object-cover border-2 border-teal-400" />
                        <div>
                          <h4 className="font-bold text-white text-base">{DOCTORS[0].name}</h4>
                          <p className="text-teal-400 text-xs font-medium">{DOCTORS[0].specialtyName}</p>
                          <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span className="font-bold text-white">4.9</span>
                            <span className="text-slate-400">(124 valoraciones)</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60">
                          <span className="text-slate-400">Sede</span>
                          <span className="text-slate-200 font-medium">San Isidro</span>
                        </div>
                        <div className="flex justify-between text-xs py-1.5 border-b border-slate-800/60">
                          <span className="text-slate-400">Próximo turno</span>
                          <span className="text-emerald-400 font-bold">Hoy 10:30 AM</span>
                        </div>
                        <div className="flex justify-between text-xs py-1.5">
                          <span className="text-slate-400">Costo Consulta</span>
                          <span className="text-teal-300 font-bold">S/ 150.00</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleOpenBooking('cardio', 'doc-1')}
                        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Reservar con Dr. Morales</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* SPECIALTIES GRID PREVIEW */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Especialidades</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Nuestras áreas médicas principales</h2>
                <p className="text-slate-600 mt-2 text-sm">Contamos con equipamiento de vanguardia y médicos certificados para cada etapa de tu vida.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {SPECIALTIES.map((spec) => (
                  <div 
                    key={spec.id}
                    onClick={() => handleOpenBooking(spec.id)}
                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-600 transition-colors">{spec.name}</h3>
                      <p className="text-slate-600 text-xs mt-2 leading-relaxed">{spec.description}</p>
                    </div>
                    <div className="mt-6 flex items-center text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                      <span>Agendar Cita</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURED DOCTORS PREVIEW */}
            <section className="py-20 bg-slate-100/70 border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Equipo Médico</span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mt-3">Especialistas Destacados</h2>
                  </div>
                  <button 
                    onClick={() => setActiveTab('medicos')}
                    className="mt-4 md:mt-0 text-teal-600 font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    <span>Ver todos los médicos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {DOCTORS.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-500" />
                          <div>
                            <h3 className="font-bold text-slate-900">{doc.name}</h3>
                            <span className="inline-block bg-teal-50 text-teal-700 font-semibold text-xs px-2.5 py-0.5 rounded-md mt-1">{doc.specialtyName}</span>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{doc.rating}</span>
                              <span className="text-slate-400 font-normal">({doc.reviews} opiniones)</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-teal-600" /> Experiencia</span>
                            <span className="font-semibold text-slate-800">{doc.experience}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-600" /> Ubicación</span>
                            <span className="font-semibold text-slate-800">{doc.hospital}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Consulta</span>
                          <span className="text-sm font-extrabold text-slate-900">S/ {doc.fee}.00</span>
                        </div>
                        <button
                          onClick={() => handleOpenBooking(doc.specialtyId, doc.id)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                        >
                          Reservar Cita
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- VIEW: ESPECIALIDADES --- */}
        {activeTab === 'especialidades' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900">Directorio de Especialidades</h1>
              <p className="text-slate-600 text-sm mt-1">Selecciona una especialidad para conocer los médicos asignados y agendar tu consulta.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SPECIALTIES.map(spec => {
                const specDocs = DOCTORS.filter(d => d.specialtyId === spec.id);
                return (
                  <div key={spec.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-xl text-slate-900">{spec.name}</h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">{spec.description}</p>
                      
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-500">Médicos disponibles:</span>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            {specDocs.map(d => (
                              <img key={d.id} src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                            ))}
                          </div>
                          <span className="text-xs text-slate-600 font-medium">{specDocs.length} Especialista(s)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(spec.id)}
                      className="mt-6 w-full bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs py-3 rounded-xl transition-colors"
                    >
                      Buscar Cita en {spec.name}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- VIEW: MEDICOS --- */}
        {activeTab === 'medicos' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Staff Médico Certificado</h1>
                <p className="text-slate-600 text-sm mt-1">Elige al profesional de tu preferencia y consulta sus horarios disponibles.</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Buscar médico o especialidad..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <select
                  value={selectedSpecialtyFilter}
                  onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="todos">Todas las Especialidades</option>
                  {SPECIALTIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <img src={doc.avatar} alt={doc.name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-500" />
                      <div>
                        <h3 className="font-bold text-slate-900">{doc.name}</h3>
                        <span className="inline-block bg-teal-50 text-teal-700 font-semibold text-xs px-2.5 py-0.5 rounded-md mt-1">{doc.specialtyName}</span>
                        <p className="text-[11px] text-slate-400 mt-1">{doc.cmp}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Experiencia:</span>
                        <span className="font-semibold text-slate-800">{doc.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Sede:</span>
                        <span className="font-semibold text-slate-800">{doc.hospital}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Calificación:</span>
                        <span className="font-bold text-amber-500 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {doc.rating} ({doc.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Costo Particular</span>
                      <span className="text-sm font-extrabold text-slate-900">S/ {doc.fee}.00</span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(doc.specialtyId, doc.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                    >
                      Agendar Cita
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- VIEW: MIS CITAS --- */}
        {activeTab === 'citas' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Gestión de Citas Médicas</h1>
                <p className="text-slate-600 text-sm mt-1">Revisa el historial de tus consultas programadas o canceladas.</p>
              </div>

              {/* Status Tabs */}
              <div className="flex bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
                {['todas', 'Confirmada', 'Pendiente', 'Cancelada'].map(status => (
                  <button
                    key={status}
                    onClick={() => setAppointmentFilter(status)}
                    className={`px-4 py-2 rounded-lg capitalize transition-all ${
                      appointmentFilter === status 
                        ? 'bg-white text-slate-900 shadow-sm font-bold' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
                <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No se encontraron citas</h3>
                <p className="text-slate-500 text-xs mt-1 mb-6">No hay registros con el estado seleccionado en este momento.</p>
                <button
                  onClick={() => handleOpenBooking()}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
                >
                  Agendar Nueva Cita
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map(app => (
                  <div key={app.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
                    
                    <div className="flex items-start gap-4">
                      <img src={app.doctor.avatar} alt={app.doctor.name} className="w-14 h-14 rounded-full object-cover border-2 border-teal-500 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-base">{app.doctor.name}</span>
                          <span className="text-xs bg-slate-100 font-semibold px-2.5 py-0.5 rounded-md text-slate-600">{app.specialty}</span>
                          <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            app.status === 'Confirmada' ? 'bg-emerald-100 text-emerald-800' :
                            app.status === 'Pendiente' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs text-slate-600">
                          <p className="flex items-center gap-1.5 font-medium text-slate-800">
                            <Calendar className="w-3.5 h-3.5 text-teal-600" />
                            <span>{app.date} - {app.time}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-teal-600" />
                            <span>Paciente: {app.patientName} (DNI: {app.patientDni})</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-teal-600" />
                            <span>{app.doctor.hospital}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-teal-600" />
                            <span>Seguro: {app.insurance}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0 justify-end">
                      {app.status !== 'Cancelada' && (
                        <button
                          onClick={() => handleCancelAppointment(app.id)}
                          className="text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancelar Cita</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleOpenBooking(app.doctor.specialtyId, app.doctor.id);
                        }}
                        className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reagendar</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* --- APPOINTMENT STEPPER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 transition-all transform my-8">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-400">Reserva de Cita</span>
                <h3 className="text-lg font-bold">Paso {step} de 5: {
                  step === 1 ? 'Especialidad' :
                  step === 2 ? 'Seleccionar Médico' :
                  step === 3 ? 'Fecha y Hora' :
                  step === 4 ? 'Datos del Paciente' : 'Confirmación'
                }</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5">
              <div 
                className="bg-teal-500 h-1.5 transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              
              {/* STEP 1: Select Specialty */}
              {step === 1 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-4">Elige la especialidad requerida:</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SPECIALTIES.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setBookingData(prev => ({ ...prev, specialty: s.id, doctorId: '' }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          bookingData.specialty === s.id 
                            ? 'border-teal-600 bg-teal-50/50 text-teal-900' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          bookingData.specialty === s.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-slate-900">{s.name}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Doctor */}
              {step === 2 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-4">Selecciona al médico de tu preferencia:</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {DOCTORS.filter(d => !bookingData.specialty || d.specialtyId === bookingData.specialty).map(d => (
                      <div
                        key={d.id}
                        onClick={() => setBookingData(prev => ({ ...prev, doctorId: d.id }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          bookingData.doctorId === d.id 
                            ? 'border-teal-600 bg-teal-50/50' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={d.avatar} alt={d.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <h5 className="font-bold text-sm text-slate-900">{d.name}</h5>
                            <p className="text-xs text-teal-600 font-medium">{d.specialtyName}</p>
                            <p className="text-[11px] text-slate-500">{d.hospital} • {d.experience}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block font-extrabold text-sm text-slate-900">S/ {d.fee}.00</span>
                          <span className="text-[11px] text-amber-500 font-bold">★ {d.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Select Date & Time */}
              {step === 3 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-4">Selecciona fecha y turno:</h4>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-700 mb-2">Fecha de atención</label>
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingData.date}
                      onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Horarios Disponibles</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setBookingData(prev => ({ ...prev, time: slot }))}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                            bookingData.time === slot
                              ? 'bg-teal-600 text-white shadow-md'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Patient Info */}
              {step === 4 && (
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-4">Datos del Paciente</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                      <input 
                        type="text"
                        placeholder="Ej. Juan Pérez"
                        value={bookingData.patientName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, patientName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DNI / Documento *</label>
                      <input 
                        type="text"
                        placeholder="8 dígitos"
                        value={bookingData.patientDni}
                        onChange={(e) => setBookingData(prev => ({ ...prev, patientDni: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp *</label>
                      <input 
                        type="tel"
                        placeholder="+51 900 000 000"
                        value={bookingData.patientPhone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, patientPhone: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                      <input 
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={bookingData.patientEmail}
                        onChange={(e) => setBookingData(prev => ({ ...prev, patientEmail: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Atención / Seguro</label>
                      <select 
                        value={bookingData.insurance}
                        onChange={(e) => setBookingData(prev => ({ ...prev, insurance: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none"
                      >
                        <option value="Particular">Particular</option>
                        <option value="Rímac EPS">Rímac EPS</option>
                        <option value="Pacifico EPS">Pacífico EPS</option>
                        <option value="Sanitas">Sanitas</option>
                        <option value="La Positiva">La Positiva</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Motivo de Consulta (Opcional)</label>
                      <textarea 
                        rows="2"
                        placeholder="Breve descripción de síntomas o motivo de la visita..."
                        value={bookingData.reason}
                        onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Ticket & Confirmation */}
              {step === 5 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">¡Cita Confirmada!</h3>
                  <p className="text-slate-500 text-xs mt-1">Hemos registrado tu reserva y enviado los detalles a tu WhatsApp/correo.</p>

                  {/* Simulated Ticket Card */}
                  <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
                    <div className="flex justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Médico</span>
                        <span className="font-bold text-sm text-slate-800">
                          {DOCTORS.find(d => d.id === bookingData.doctorId)?.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Especialidad</span>
                        <span className="font-semibold text-xs text-teal-600">
                          {SPECIALTIES.find(s => s.id === bookingData.specialty)?.name}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500 block">Fecha y Hora:</span>
                        <span className="font-bold text-slate-800">{bookingData.date} - {bookingData.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Paciente:</span>
                        <span className="font-bold text-slate-800">{bookingData.patientName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setActiveTab('citas');
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-colors"
                    >
                      Ir a Mis Citas
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Controls */}
            {step < 5 && (
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
                <button
                  disabled={step === 1}
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirmar Cita</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              <span className="font-bold text-base text-white">SaludPlus</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Plataforma médica líder en reserva y gestión de citas de salud presenciales y virtuales.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Especialidades</h4>
            <ul className="space-y-2">
              <li>Cardiología</li>
              <li>Pediatría</li>
              <li>Dermatología</li>
              <li>Odontología</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Atención</h4>
            <ul className="space-y-2">
              <li>Central Telefónica: (01) 619-0000</li>
              <li>Sede Principal: Av. Javier Prado 1200</li>
              <li>Urgencias 24/7</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Seguridad</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Tus datos médicos se manejan con estricta confidencialidad bajo normas de seguridad de la salud.
            </p>
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Lock className="w-4 h-4" />
              <span>Conexión Cifrada SSL</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 text-center text-slate-600">
          © {new Date().getFullYear()} SaludPlus Portal Médico. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}