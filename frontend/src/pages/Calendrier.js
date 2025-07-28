import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/fr'; // Importer la locale française
import { FaCalendarAlt, FaCar, FaUser, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';

// Dictionnaire de traductions
const translations = {
  calendarTitle: {
    fr: "Calendrier des Réservations",
    en: "Booking Calendar",
    ar: "تقويم الحجوزات"
  },
  calendarDesc: {
    fr: "Consultez et gérez toutes les réservations sur un calendrier.",
    en: "View and manage all bookings on a calendar.",
    ar: "عرض وإدارة جميع الحجوزات على تقويم."
  },
  today: {
    fr: "Aujourd'hui",
    en: "Today",
    ar: "اليوم"
  },
  month: {
    fr: "Mois",
    en: "Month",
    ar: "شهر"
  },
  week: {
    fr: "Semaine",
    en: "Week",
    ar: "أسبوع"
  },
  day: {
    fr: "Jour",
    en: "Day",
    ar: "يوم"
  },
  car: {
    fr: "Voiture",
    en: "Car",
    ar: "سيارة"
  },
  client: {
    fr: "Client",
    en: "Client",
    ar: "عميل"
  },
  location: {
    fr: "Emplacement",
    en: "Location",
    ar: "موقع"
  },
  status: {
    fr: "Statut",
    en: "Status",
    ar: "الحالة"
  },
  pending: {
    fr: "En attente",
    en: "Pending",
    ar: "قيد الانتظار"
  },
  approved: {
    fr: "Approuvé",
    en: "Approved",
    ar: "موافق عليه"
  },
  completed: {
    fr: "Terminé",
    en: "Completed",
    ar: "مكتمل"
  },
  cancelled: {
    fr: "Annulé",
    en: "Cancelled",
    ar: "ملغى"
  },
  denied: {
    fr: "Refusé",
    en: "Denied",
    ar: "مرفوض"
  },
  unknown: {
    fr: "Inconnu",
    en: "Unknown",
    ar: "غير معروف"
  },
  noBookings: {
    fr: "Aucune réservation pour cette période.",
    en: "No bookings for this period.",
    ar: "لا توجد حجوزات لهذه الفترة."
  },
  all: {
    fr: "Tous",
    en: "All",
    ar: "الكل"
  },
  allBookings: {
    fr: "Toutes les réservations",
    en: "All Bookings",
    ar: "جميع الحجوزات"
  },
};

// Style dynamique CSS pour la page
const CalendarStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .calendar-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      }
      
      .tab-button:hover {
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};

const Calendrier = () => {
  const [language, setLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState('month');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showDateBookings, setShowDateBookings] = useState(false);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  // API URL
  const API_URL = process.env.REACT_APP_API_URL;

  // Référence pour détecter les clics en dehors du pop-up
  const infoPopupRef = React.useRef(null);
  const dateBookingsPopupRef = React.useRef(null);

  useEffect(() => {
    // Forcer l'utilisation du français pour les dates
    moment.locale('fr');
    
    const lang = localStorage.getItem('language') || 'en';
    setLanguage(lang);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setCarsLoading(true);
        const res = await axios.get(`${API_URL}/cars`);
        setCars(res.data);
        setCarsLoading(false);
      } catch (err) {
        setCars([]);
        setCarsLoading(false);
      }
    };
    fetchCars();
  }, [API_URL]);

  // Gestionnaire de clic global pour fermer les pop-ups
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoPopupRef.current && !infoPopupRef.current.contains(event.target)) {
        setShowInfo(false);
      }
      if (dateBookingsPopupRef.current && !dateBookingsPopupRef.current.contains(event.target)) {
        setShowDateBookings(false);
      }
    };

    // Ajouter/supprimer le gestionnaire d'événements de clic sur le document
    if (showInfo || showDateBookings) {
      document.addEventListener('mousedown', handleClickOutside);
      // Bloquer le défilement quand un pop-up est ouvert
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [showInfo, showDateBookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Utilisation de l'option include pour récupérer les relations
      const response = await axios.get(`${API_URL}/bookings?include=Car,User`);
      console.log("Réponse API des réservations:", response.data);
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      setLoading(false);
    }
  };

  const goToToday = () => {
    setCurrentDate(moment());
  };

  const nextDate = () => {
    if (view === 'month') {
      setCurrentDate(moment(currentDate).add(1, 'month'));
    } else if (view === 'week') {
      setCurrentDate(moment(currentDate).add(1, 'week'));
    } else {
      setCurrentDate(moment(currentDate).add(1, 'day'));
    }
  };

  const prevDate = () => {
    if (view === 'month') {
      setCurrentDate(moment(currentDate).subtract(1, 'month'));
    } else if (view === 'week') {
      setCurrentDate(moment(currentDate).subtract(1, 'week'));
    } else {
      setCurrentDate(moment(currentDate).subtract(1, 'day'));
    }
  };

  const renderCalendarHeader = () => {
    let title;
    
    if (view === 'month') {
      title = currentDate.locale('fr').format('MMMM YYYY');
    } else if (view === 'week') {
      const startOfWeek = moment(currentDate).startOf('week');
      const endOfWeek = moment(currentDate).endOf('week');
      title = `${startOfWeek.locale('fr').format('D MMM')} - ${endOfWeek.locale('fr').format('D MMM YYYY')}`;
    } else {
      title = currentDate.locale('fr').format('dddd, D MMMM YYYY');
    }
    
    return (
      <div style={styles.calendarHeader}>
        <div style={styles.calendarTitle}>{title}</div>
        <div style={styles.calendarActions}>
          <button style={styles.calendarButton} onClick={prevDate}>&lt;</button>
          <button style={styles.calendarButton} onClick={goToToday}>
            {translations.today[language]}
          </button>
          <button style={styles.calendarButton} onClick={nextDate}>&gt;</button>
        </div>
      </div>
    );
  };

  const renderViewTabs = () => {
    return (
      <div style={styles.viewTabs}>
        <button 
          style={view === 'month' ? styles.activeTab : styles.viewTab} 
          onClick={() => setView('month')}
        >
          {translations.month[language]}
        </button>
        <button 
          style={view === 'week' ? styles.activeTab : styles.viewTab} 
          onClick={() => setView('week')}
        >
          {translations.week[language]}
        </button>
        <button 
          style={view === 'day' ? styles.activeTab : styles.viewTab} 
          onClick={() => setView('day')}
        >
          {translations.day[language]}
        </button>
        <button 
          style={view === 'all' ? styles.activeTab : styles.viewTab} 
          onClick={() => setView('all')}
        >
          {translations.all[language]}
        </button>
      </div>
    );
  };

  const getBookingsForDate = (date) => {
    // Retourne les réservations qui commencent ou se terminent à cette date précise
    // (toutes les réservations, pas seulement les "pending")
    return bookings.filter(booking => {
      const bookingStart = moment(booking.start_date).startOf('day');
      const bookingEnd = moment(booking.end_date).startOf('day');
      const currentDay = date.startOf('day');
      
      // Vérifier si c'est le jour de début OU le jour de fin de la réservation
      return (bookingStart.isSame(currentDay) || bookingEnd.isSame(currentDay));
    });
  };

  // Générer une couleur unique basée sur l'ID de réservation
  const getBookingColor = (bookingId, opacity = 1) => {
    // Utiliser les 6 premiers caractères de l'ID (ou l'ID entier s'il est court)
    // comme base pour générer une couleur
    const hash = String(bookingId).substring(0, 6);
    let color = '#';
    
    // Convertir les caractères en valeurs hexadécimales
    for (let i = 0; i < 3; i++) {
      // Extraire deux caractères à la fois ou utiliser une valeur par défaut
      const value = parseInt(hash.substring(i * 2, i * 2 + 2), 36) || 8 + i * 5;
      // Convertir en valeur hexadécimale entre 50 et 200 pour éviter les couleurs trop claires ou trop foncées
      const hex = Math.min(Math.max(50, value * 5), 200).toString(16);
      color += hex.length === 1 ? '0' + hex : hex;
    }
    
    return opacity < 1 ? color + Math.floor(opacity * 255).toString(16) : color;
  };

  // Gérer l'ouverture de l'infobulle
  const handleInfoClick = (event, booking) => {
    event.stopPropagation();
    setSelectedBooking(booking);
    setShowInfo(true);
  };

  // Gérer la fermeture de l'infobulle
  const handleCloseInfo = () => {
    setShowInfo(false);
  };

  // Gérer l'affichage des réservations d'une journée
  const handleShowDateBookings = (event, bookings, date) => {
    event.stopPropagation();
    setSelectedDateBookings(bookings);
    setShowDateBookings(true);
  };

  // Gérer la fermeture du popup des réservations
  const handleCloseDateBookings = () => {
    setShowDateBookings(false);
  };

  // Composant pour l'infobulle
  const InfoTooltip = () => {
    if (!selectedBooking || !showInfo) return null;
    
    return (
      <div className="popup-overlay" style={{ ...styles.popupOverlay, background: 'rgba(0,0,0,0.25)' }}>
        <div 
          ref={infoPopupRef}
          style={{
            ...styles.infoTooltipCentered,
            maxWidth: 420,
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(24, 144, 255, 0.18)',
            background: 'linear-gradient(120deg, #fafdff 80%, #e6f7ff 100%)',
            padding: 0,
          }}
        >
          <div style={{
            ...styles.infoHeader,
            background: 'linear-gradient(90deg, #1890ff 60%, #40a9ff 100%)',
            color: '#fff',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: '18px 28px',
            borderBottom: 'none',
          }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>Détails de la réservation</h3>
            <button style={{ ...styles.closeButton, color: '#fff', fontSize: 28 }} onClick={handleCloseInfo}>×</button>
          </div>
          <div style={{
            padding: '28px 28px 18px 28px',
            display: 'grid',
            gridTemplateColumns: '140px 1fr',
            rowGap: 14,
            columnGap: 10,
            fontSize: 15,
            color: '#222',
            background: 'transparent',
          }}>
            <div style={{ fontWeight: 600, color: '#888' }}>ID Réservation:</div>
            <div style={{ fontWeight: 500 }}>{selectedBooking.id || 'Non spécifié'}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Voiture:</div>
            <div style={{ fontWeight: 500 }}>{selectedBooking.Car ? selectedBooking.Car.name : 'Non spécifié'}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Matricule:</div>
            <div style={{ fontWeight: 500 }}>{selectedBooking.Car && selectedBooking.Car.matricule ? selectedBooking.Car.matricule : 'Non spécifié'}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Client:</div>
            <div style={{ fontWeight: 500 }}>{selectedBooking.User ? selectedBooking.User.name : 'Non spécifié'}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Téléphone:</div>
            <div style={{ fontWeight: 500 }}>{selectedBooking.User && selectedBooking.User.phone ? selectedBooking.User.phone : 'Non spécifié'}</div>
            <div style={{ gridColumn: '1 / span 2', borderTop: '1px solid #e6f7ff', margin: '8px 0' }}></div>
            <div style={{ fontWeight: 600, color: '#888' }}>Début:</div>
            <div style={{ fontWeight: 500 }}>{moment(selectedBooking.start_date).locale('fr').format('DD/MM/YYYY')}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Fin:</div>
            <div style={{ fontWeight: 500 }}>{moment(selectedBooking.end_date).locale('fr').format('DD/MM/YYYY')}</div>
            <div style={{ fontWeight: 600, color: '#888' }}>Statut:</div>
            <div style={{ fontWeight: 600, color: '#1890ff', textTransform: 'capitalize' }}>{translations[selectedBooking.status.toLowerCase()][language]}</div>
          </div>
        </div>
      </div>
    );
  };

  // Composant pour afficher toutes les réservations d'une journée
  const DateBookingsPopup = () => {
    if (!selectedDateBookings.length || !showDateBookings) return null;
    
    const formattedDate = moment(selectedDateBookings[0].start_date).locale('fr').format('DD/MM/YYYY');
    
    return (
      <div className="popup-overlay" style={styles.popupOverlay}>
        <div 
          ref={dateBookingsPopupRef}
          style={styles.dateBookingsPopupCentered}
        >
          <div style={styles.infoHeader}>
            <h3 style={styles.infoTitle}>Réservations du {formattedDate}</h3>
            <button style={styles.closeButton} onClick={handleCloseDateBookings}>×</button>
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.bookingsTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Voiture</th>
                  <th style={styles.tableHeader}>Client</th>
                  <th style={styles.tableHeader}>Début</th>
                  <th style={styles.tableHeader}>Fin</th>
                  <th style={styles.tableHeader}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {selectedDateBookings.map((booking, idx) => {
                  const isStartDate = moment(booking.start_date).startOf('day').isSame(moment(selectedDateBookings[0].start_date).startOf('day'));
                  const statusColor = getStatusColor(booking.status, 0.2);
                  const statusTextColor = getStatusColor(booking.status, 1);
                  
                  return (
                    <tr key={idx} style={{
                      backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      borderLeft: `4px solid ${getBookingColor(booking.id)}`
                    }}>
                      <td style={styles.tableCell}>{booking.Car ? booking.Car.name : 'Non spécifié'}</td>
                      <td style={styles.tableCell}>{booking.User ? booking.User.name : 'Non spécifié'}</td>
                      <td style={styles.tableCell}>{moment(booking.start_date).locale('fr').format('DD/MM/YYYY')}</td>
                      <td style={styles.tableCell}>{moment(booking.end_date).locale('fr').format('DD/MM/YYYY')}</td>
                      <td style={{
                        ...styles.tableCell,
                        backgroundColor: statusColor,
                        color: statusTextColor,
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        textAlign: 'center'
                      }}>
                        {translations[booking.status.toLowerCase()][language]}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Gantt/resource style for month view
  const renderMonthView = () => {
    if (carsLoading) {
      return <div style={styles.loadingIndicator}>Chargement des voitures...</div>;
    }
    // Get all cars
    const daysInMonth = currentDate.daysInMonth();
    const startOfMonth = moment(currentDate).startOf('month');
    const endOfMonth = moment(currentDate).endOf('month');
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => startOfMonth.clone().add(i, 'days'));

    // Helper: get bookings for a car in this month
    const getCarBookingsForMonth = (carId) => {
      return bookings.filter(b => b.Car && b.Car.id === carId && (
        moment(b.start_date).isBefore(endOfMonth) && moment(b.end_date).isAfter(startOfMonth)
      ));
    };

    return (
      <div style={{ overflowX: 'auto', paddingBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(${daysInMonth}, 1fr)`, minWidth: 900 }}>
          {/* Header Row: Car label + days of month */}
          <div style={{ background: '#fafafa', fontWeight: 'bold', borderRight: '1px solid #eee', padding: 8, position: 'sticky', left: 0, zIndex: 2 }}></div>
          {daysArray.map((d, i) => (
            <div key={d.format('YYYY-MM-DD')} style={{ background: '#fafafa', fontWeight: 'bold', fontSize: 13, textAlign: 'center', borderRight: i === daysArray.length - 1 ? 'none' : '1px solid #eee', borderBottom: '2px solid #e6f7ff', color: '#888', padding: 6 }}>{d.date()}</div>
          ))}
          {/* Car rows */}
          {cars.map((car, carIdx) => (
            <React.Fragment key={car.id}>
              {/* Car name cell */}
              <div style={{
                background: carIdx % 2 === 0 ? '#f8fafc' : '#fff',
                fontWeight: 600,
                borderRight: '1px solid #eee',
                borderBottom: carIdx === cars.length - 1 ? '2px solid #e6f7ff' : '1px solid #eee',
                padding: 8,
                position: 'sticky',
                left: 0,
                zIndex: 1,
                minWidth: 140,
                color: '#222',
                fontSize: 14,
                textAlign: 'center',
                backgroundClip: 'padding-box',
                letterSpacing: 1,
              }}>{car.name}</div>
              {/* Booking grid cell */}
              <div style={{
                gridColumn: `span ${daysInMonth}`,
                position: 'relative',
                minHeight: 32,
                background: carIdx % 2 === 0 ? '#f8fafc' : '#fff',
                borderBottom: carIdx === cars.length - 1 ? '2px solid #e6f7ff' : '1px solid #eee',
                overflow: 'visible',
              }}>
                {/* Days grid background */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, height: 32, position: 'absolute', width: '100%', zIndex: 0, top: 0, left: 0 }}>
                  {daysArray.map((_, i) => (
                    <div key={i} style={{ borderRight: i === daysArray.length - 1 ? 'none' : '1px solid #eee', height: '100%' }}></div>
                  ))}
        </div>
                {/* Bookings as bars */}
                {getCarBookingsForMonth(car.id).map((booking, idx) => {
                  // Clamp booking to visible month
                  const bookingStart = moment.max(moment(booking.start_date).startOf('day'), startOfMonth);
                  const bookingEnd = moment.min(moment(booking.end_date).endOf('day'), endOfMonth);
                  const startOffset = bookingStart.diff(startOfMonth, 'days');
                  const endOffset = bookingEnd.diff(startOfMonth, 'days') + 1;
                  const left = (startOffset / daysInMonth) * 100;
                  const width = ((endOffset - startOffset) / daysInMonth) * 100;
                  const color = getBookingColor(booking.id, 0.85);
                  return (
                    <div 
                      key={booking.id + '-' + idx}
                      style={{
                        position: 'absolute',
                        top: 8 + idx * 22,
                        left: `${left}%`,
                        width: `${width}%`,
                        height: 18,
                        background: color,
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 12,
                        cursor: 'pointer',
                        border: `1.5px solid ${color}`,
                        zIndex: 2 + idx,
                        transition: 'box-shadow 0.18s, transform 0.18s',
                        overflow: 'hidden',
                        letterSpacing: 0.2,
                      }}
                      title={`${booking.User ? booking.User.name : ''} | ${moment(booking.start_date).format('DD/MM')} - ${moment(booking.end_date).format('DD/MM')}`}
                      onClick={e => handleInfoClick(e, booking)}
                    >
                      <span style={{ fontWeight: 400, color: '#fff', fontSize: 12, opacity: 0.95 }}>
                        {booking.User ? booking.User.name : ''}
                      </span>
                    </div>
                  );
                })}
          </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Gantt/resource style for week view
  const renderWeekView = () => {
    if (carsLoading) {
      return <div style={styles.loadingIndicator}>Chargement des voitures...</div>;
    }
    // Define days in week
    const startOfWeek = moment(currentDate).startOf('week');
    const daysArray = Array.from({ length: 7 }, (_, i) => startOfWeek.clone().add(i, 'days'));

    // Helper: get bookings for a car in this week
    const getCarBookingsForWeek = (carId) => {
      const endOfWeek = moment(startOfWeek).endOf('week');
      return bookings.filter(b => b.Car && b.Car.id === carId && (
        moment(b.start_date).isBefore(endOfWeek) && moment(b.end_date).isAfter(startOfWeek)
      ));
    };

    return (
      <div style={{ overflowX: 'auto', paddingBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `180px repeat(7, 1fr)`, minWidth: 900 }}>
          {/* Header Row: Car label + days of week */}
          <div style={{ background: '#fafafa', fontWeight: 'bold', borderRight: '1px solid #eee', padding: 8, position: 'sticky', left: 0, zIndex: 2 }}></div>
          {daysArray.map((d, i) => (
            <div key={d.format('YYYY-MM-DD')} style={{ background: '#fafafa', fontWeight: 'bold', fontSize: 13, textAlign: 'center', borderRight: i === daysArray.length - 1 ? 'none' : '1px solid #eee', borderBottom: '2px solid #e6f7ff', color: '#888', padding: 6 }}>{d.format('ddd')}</div>
          ))}
          {/* Car rows */}
          {cars.map((car, carIdx) => (
            <React.Fragment key={car.id}>
              {/* Car name cell */}
              <div style={{
                background: carIdx % 2 === 0 ? '#f8fafc' : '#fff',
                fontWeight: 600,
                borderRight: '1px solid #eee',
                borderBottom: carIdx === cars.length - 1 ? '2px solid #e6f7ff' : '1px solid #eee',
                padding: 8,
                position: 'sticky',
                left: 0,
                zIndex: 1,
                minWidth: 140,
                color: '#222',
                fontSize: 14,
                textAlign: 'center',
                backgroundClip: 'padding-box',
                letterSpacing: 1,
              }}>{car.name}</div>
              {/* Booking grid cell */}
              <div style={{
                gridColumn: `span 7`,
                position: 'relative',
                minHeight: 32,
                background: carIdx % 2 === 0 ? '#f8fafc' : '#fff',
                borderBottom: carIdx === cars.length - 1 ? '2px solid #e6f7ff' : '1px solid #eee',
                overflow: 'visible',
              }}>
                {/* Days grid background */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, 1fr)`, height: 32, position: 'absolute', width: '100%', zIndex: 0, top: 0, left: 0 }}>
                  {daysArray.map((_, i) => (
                    <div key={i} style={{ borderRight: i === daysArray.length - 1 ? 'none' : '1px solid #eee', height: '100%' }}></div>
                  ))}
          </div>
                {/* Bookings as bars */}
                {getCarBookingsForWeek(car.id).map((booking, idx) => {
                  // Clamp booking to visible week
                  const weekStart = startOfWeek;
                  const weekEnd = moment(startOfWeek).endOf('week');
                  const bookingStart = moment.max(moment(booking.start_date).startOf('day'), weekStart);
                  const bookingEnd = moment.min(moment(booking.end_date).endOf('day'), weekEnd);
                  const startOffset = bookingStart.diff(weekStart, 'days');
                  const endOffset = bookingEnd.diff(weekStart, 'days') + 1;
                  const left = (startOffset / 7) * 100;
                  const width = ((endOffset - startOffset) / 7) * 100;
                  const color = getBookingColor(booking.id, 0.85);
                return (
                  <div 
                      key={booking.id + '-' + idx}
                    style={{
                        position: 'absolute',
                        top: 8 + idx * 22,
                        left: `${left}%`,
                        width: `${width}%`,
                        height: 18,
                        background: color,
                        borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
                      display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: 12,
                        cursor: 'pointer',
                        border: `1.5px solid ${color}`,
                        zIndex: 2 + idx,
                        transition: 'box-shadow 0.18s, transform 0.18s',
                        overflow: 'hidden',
                        letterSpacing: 0.2,
                      }}
                      title={`${booking.User ? booking.User.name : ''} | ${moment(booking.start_date).format('DD/MM')} - ${moment(booking.end_date).format('DD/MM')}`}
                      onClick={e => handleInfoClick(e, booking)}
                    >
                      <span style={{ fontWeight: 400, color: '#fff', fontSize: 12, opacity: 0.95 }}>
                        {booking.User ? booking.User.name : ''}
                      </span>
                  </div>
                );
                })}
          </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayBookings = getBookingsForDate(moment(currentDate));
    
    return (
      <div style={styles.dayContainer}>
        <div style={styles.dayHeader}>
          <div style={styles.dayDate}>{currentDate.locale('fr').format('dddd, D MMMM YYYY')}</div>
        </div>
        <div style={styles.dayContent}>
          {dayBookings.length > 0 ? (
            dayBookings.map((booking, idx) => {
              const isStartDate = moment(booking.start_date).startOf('day').isSame(currentDate.startOf('day'));
              const isEndDate = moment(booking.end_date).startOf('day').isSame(currentDate.startOf('day'));
              const bookingColor = getBookingColor(booking.id);
              
              return (
                <div 
                  key={`${booking.id}-${idx}`} 
                  style={{
                    ...styles.dayBooking,
                    backgroundColor: `${bookingColor}1A`, // 1A = 10% d'opacité en hexadécimal
                    borderLeft: `4px solid ${bookingColor}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={styles.dayBookingTitle}>
                      <FaCalendarAlt style={{ marginRight: '5px' }} />
                      {isStartDate ? 'Début de réservation' : 'Fin de réservation'}
                    </h3>
                    <button 
                      style={{...styles.infoButton, fontSize: '18px'}}
                      onClick={(e) => handleInfoClick(e, booking)}
                    >
                      i
                    </button>
                  </div>
                  <div style={styles.dayBookingDetails}>
                    <div style={styles.dayBookingInfo}>
                      <FaCalendarAlt style={{ marginRight: '5px' }} />
                      {isStartDate ? (
                        <strong>Date de début: {moment(booking.start_date).locale('fr').format('DD/MM/YYYY')}</strong>
                      ) : (
                        <strong>Date de fin: {moment(booking.end_date).locale('fr').format('DD/MM/YYYY')}</strong>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={styles.noDayBookings}>{translations.noBookings[language]}</div>
          )}
        </div>
      </div>
    );
  };

  const getStatusColor = (status, opacity = 1) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return `rgba(82, 196, 26, ${opacity})`;
      case 'pending':
        return `rgba(250, 173, 20, ${opacity})`;
      case 'completed':
        return `rgba(24, 144, 255, ${opacity})`;
      case 'cancelled':
        return `rgba(245, 34, 45, ${opacity})`;
      case 'denied':
        return `rgba(255, 0, 0, ${opacity})`;
      case 'unknown':
        return `rgba(155, 155, 155, ${opacity})`;
      default:
        return `rgba(155, 155, 155, ${opacity})`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <FaCheck style={{ color: 'green', marginRight: '5px' }} />;
      case 'pending':
        return <FaCalendarAlt style={{ color: 'orange', marginRight: '5px' }} />;
      case 'completed':
        return <FaCheck style={{ color: 'blue', marginRight: '5px' }} />;
      case 'cancelled':
        return <FaTimes style={{ color: 'red', marginRight: '5px' }} />;
      case 'denied':
        return <FaTimes style={{ color: 'red', marginRight: '5px' }} />;
      default:
        return null;
    }
  };

  // Nouvel ajout - Rendu de la vue "All"
  const renderAllBookingsView = () => {
    return (
      <div style={styles.allBookingsContainer}>
        <h2 style={styles.allBookingsTitle}>{translations.allBookings[language]}</h2>
        <div style={styles.allBookingsTableContainer}>
          <table style={styles.allBookingsTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>{translations.car[language]}</th>
                <th style={styles.tableHeader}>{translations.client[language]}</th>
                <th style={styles.tableHeader}>Début</th>
                <th style={styles.tableHeader}>Fin</th>
                <th style={styles.tableHeader}>{translations.status[language]}</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => {
                const bookingColor = getBookingColor(booking.id);
                const statusColor = getStatusColor(booking.status, 0.2);
                const statusTextColor = getStatusColor(booking.status, 1);
                const bookingStatus = booking.status ? booking.status.toLowerCase() : 'unknown';
                const statusTranslation = translations[bookingStatus] ? translations[bookingStatus][language] : translations.unknown[language];
                
                return (
                  <tr key={idx} style={{
                    backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff',
                    borderLeft: `4px solid ${bookingColor}`
                  }}>
                    <td style={styles.tableCell}>{booking.Car ? booking.Car.name : 'Non spécifié'}</td>
                    <td style={styles.tableCell}>{booking.User ? booking.User.name : 'Non spécifié'}</td>
                    <td style={styles.tableCell}>{moment(booking.start_date).locale('fr').format('DD/MM/YYYY')}</td>
                    <td style={styles.tableCell}>{moment(booking.end_date).locale('fr').format('DD/MM/YYYY')}</td>
                    <td style={{
                      ...styles.tableCell,
                      backgroundColor: statusColor,
                      color: statusTextColor,
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      textAlign: 'center'
                    }}>
                      {statusTranslation}
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        style={styles.infoButton}
                        onClick={(e) => handleInfoClick(e, booking)}
                      >
                        i
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <CalendarStyles />
      <div 
        style={{ 
          ...styles.mainContent,
          marginLeft: windowWidth >= 768 ? (isOpen ? '280px' : '0px') : '0px'
        }}
      >
        <div style={styles.calendarWrapper}>
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>{translations.calendarTitle[language]}</h1>
            <div style={styles.titleUnderline}></div>
            <p style={styles.pageSubtitle}>{translations.calendarDesc[language]}</p>
          </div>
          {renderViewTabs()}
          {view !== 'all' && renderCalendarHeader()}
          
          {loading ? (
            <div style={styles.loadingIndicator}>Chargement...</div>
          ) : (
            <>
              {view === 'month' && renderMonthView()}
              {view === 'week' && renderWeekView()}
              {view === 'day' && renderDayView()}
              {view === 'all' && renderAllBookingsView()}
            </>
          )}

          {/* Afficher l'infobulle si nécessaire */}
          <InfoTooltip />
          
          {/* Afficher le popup des réservations d'une journée */}
          <DateBookingsPopup />
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
  },
  mainContent: {
    position: 'relative',
    transition: 'margin-left 0.3s ease',
    padding: '20px',
    paddingTop: '30px',
  },
  pageHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '10px',
  },
  titleUnderline: {
    height: '3px',
    width: '60px',
    background: 'linear-gradient(90deg, #1890ff, #40a9ff)',
    margin: '0 auto',
    marginBottom: '15px',
    borderRadius: '2px',
    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#666',
    maxWidth: '700px',
    margin: '0 auto',
  },
  calendarWrapper: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  viewTabs: {
    display: 'flex',
    marginBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '15px',
  },
  viewTab: {
    padding: '8px 16px',
    backgroundColor: '#f9f9f9',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    color: '#666',
  },
  activeTab: {
    padding: '8px 16px',
    backgroundColor: '#1890ff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(24, 144, 255, 0.3)',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  calendarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  calendarActions: {
    display: 'flex',
    gap: '10px',
  },
  calendarButton: {
    padding: '8px 12px',
    backgroundColor: '#f5f5f9',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  // Month View Styles
  calendarContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridGap: '1px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  calendarHeaderDay: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#fafafa',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#666',
  },
  calendarDay: {
    minHeight: '100px',
    padding: '5px',
    backgroundColor: '#fff',
    position: 'relative',
  },
  dateNumber: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  dayContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  bookingPill: {
    padding: '4px 8px',
    borderRadius: '4px',
    margin: '0 auto',
  },
  moreBookingsButton: {
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: '#52c41a',
    color: '#ffffff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    margin: '5px auto',
    padding: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  todayCell: {
    backgroundColor: '#e6f7ff',
    border: '1px solid #1890ff',
  },
  otherMonth: {
    backgroundColor: '#f9f9f9',
    color: '#ccc',
  },
  // Week View Styles
  weekContainer: {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
  },
  weekDay: {
    flex: '1',
    minWidth: '200px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  weekDayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  weekDayName: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#666',
  },
  weekDayNumber: {
    fontSize: '24px',
    color: '#333',
  },
  weekDayContent: {
    padding: '10px',
    backgroundColor: '#fff',
    minHeight: '300px',
  },
  weekBooking: {
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  bookingTime: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '5px',
  },
  todayCell: {
    backgroundColor: '#e6f7ff',
    border: '1px solid #1890ff',
  },
  // Day View Styles
  dayContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  dayHeader: {
    padding: '15px',
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
  },
  dayDate: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  dayContent: {
    padding: '20px',
    backgroundColor: '#fff',
    minHeight: '400px',
  },
  dayBooking: {
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  },
  dayBookingTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  dayBookingDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
  },
  dayBookingInfo: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
  },
  noDayBookings: {
    fontSize: '14px',
    color: '#999',
    textAlign: 'center',
    marginTop: '30px',
  },
  loadingIndicator: {
    padding: '30px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
  },
  infoButton: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    color: '#1890ff',
    border: '1px solid #1890ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '5px',
    padding: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  
  // Superposition pour bloquer l'interface derrière les pop-ups
  popupOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  infoTooltipCentered: {
    width: '350px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    zIndex: 1001,
    animation: 'fadeIn 0.3s ease-out',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  
  infoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 20px',
    borderBottom: '1px solid #f0f0f0',
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  
  infoTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
    transition: 'color 0.2s',
    padding: '0 5px',
    lineHeight: 1,
  },
  
  infoContent: {
    padding: '20px',
    lineHeight: 1.6,
  },
  
  dateBookingsPopupCentered: {
    width: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
    zIndex: 1001,
    animation: 'fadeIn 0.3s ease-out',
    maxHeight: '80vh',
    overflow: 'auto',
  },
  
  tableContainer: {
    padding: '15px',
    maxHeight: '60vh',
    overflowY: 'auto',
  },
  
  bookingsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  
  tableHeader: {
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '2px solid #eee',
  },
  
  tableCell: {
    padding: '10px 8px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  },
  
  // Styles pour la vue "All"
  allBookingsContainer: {
    width: '100%',
    padding: '20px 0',
  },
  allBookingsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  allBookingsTableContainer: {
    width: '100%',
    overflowX: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  allBookingsTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default Calendrier; 