import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { SingleDatePicker, DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { Link, useNavigate } from 'react-router-dom';

// Import explicite des locales
import moment from 'moment';
import 'moment/locale/en-gb';
import 'moment/locale/fr';

import {
  FaLanguage,
  FaMoneyBillWave,
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaStar,
  FaCalendar,
  FaCogs,
  FaGasPump,
  FaUsers,
  FaWhatsapp,
  FaChevronLeft,
  FaChevronRight,
  FaCarSide,
  FaTools,
  FaShuttleVan,
  FaAward,
  FaPlay,
  FaMapMarkerAlt,
  FaClipboardList,
  FaCar,
  FaKey,
  FaCalendarAlt,
  FaCog,
  FaPlus,
  FaMinus
} from 'react-icons/fa';

import WhatsAppButton from '../components/WhatsAppButton';
import ScrollToTopButton from '../components/ScrollToTopButton';
import TopBar from '../components/TopBar';

// Add custom hook for scroll animations
const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

/*--------------------------------*/
/*   Hook: detect window width    */
/*--------------------------------*/
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

/*-------------------------*/
/*  Texts for i18n         */
/*-------------------------*/
const texts = {
  en: {
    heroTitle: "Looking for the Ultimate Ride? \nDiscover the Finest Vehicle for Your Adventure.",
    welcomeMessage: "Welcome to Diabcar, your trusted partner in car rental services. Experience comfort and reliability like never before.",
    aboutUs: "At Diabcar, we are committed to offering the best vehicles and exceptional customer service. Our fleet is constantly updated to meet your needs.",
    ourMission: "Our mission is to provide affordable and high-quality car rental solutions with a focus on customer satisfaction.",
    ourVision: "We envision a future where travel is accessible and enjoyable for everyone, and we strive to make that a reality.",
    contactUsDescription: "For any inquiries or support, please do not hesitate to contact us. We are here to help you 24/7.",
    searchPlaceholder: "Enter your desired location or vehicle type...",
    features: [
      "Competitive pricing",
      "Elite services",
      "24/7 Concierge care"
    ],
    pickUpLabel: "Pick up location",
    pickUpDateLabel: "Pick Up Date",
    returnDateLabel: "Return Date",
    findButton: "Find a vehicle",
    bookNow: "Book now",
    noImage: "No Image",
    footerQuickLinks: "Quick Access Links",
    footerInfoPages: "Informational Pages",
    footerLocation: "Our location",
    followUs: "Follow us on:",
    footerHome: "Home",
    footerFAQs: "FAQs",
    footerContact: "Contact Us",
    footerAbout: "About Us",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    chatButton: "Chat with Us",
    mostSearchedTitle: "Most Searched Vehicles",
    testimonialTitle: "What Our Happy Clients Say",
    statsTitle: "Our Numbers Speak for Themselves",
    viewMore: "View more vehicles",
    navHome: "Home",
    navAvailableCars: "Available Cars",
    navContactUs: "Contact Us",
    profileOverview: "Profile Overview",
    myProfile: "My Profile",
    myBookings: "My Bookings",
    accountSettings: "Account Settings",
    notifications: "Notifications",
    preferences: "Preferences",
    changePassword: "Change Password",
    customerSupport: "Customer Support",
    helpCenter: "Help Center",
    contactSupport: "Contact Support",
    signOut: "Sign Out",
    notLoggedIn: "Not logged in",
    login: "Login",
    register: "Register",
    signIn: "Sign In",
    locationOptions: {
      all: "All",
      Casablanca: "Casablanca, Morocco",
      Rabat: "Rabat, Morocco",
      Marrakech: "Marrakech, Morocco",
      RabatAirport: "Rabat Airport",
      CasablancaAirport: "Casablanca Airport",
      MarrakechAirport: "Marrakech Airport"
    },
    stats: {
      locations: "Locations Across Morocco",
      carsAvailable: "Cars Available",
      vehicleCategories: "Vehicle Categories",
      happyCustomers: "Happy Customers",
      rentalsPerDay: "Rentals Per Day",
      yearsOfExcellence: "Years of Excellence"
    },
    termsDescription: "Please read our terms and conditions carefully before renting a car.",
    privacyDescription: "Your privacy is important to us. We ensure that your personal data is protected.",
    footerCopyright: "©2024 Diabcar. All rights reserved.",
    whatsAppMessage: "Hello, I'd like to rent a car!",
    address: "365, Boulevard Zerbout - Casablanca, Morocco.",
    downArrowAlt: "Down arrow",
    upArrowAlt: "Up arrow",
    mapTitle: "Map",
    seats: "Seats",
    perDay: " / Day",
    fuelTypeFilter: "Fuel Type",
    transmissionFilter: "Transmission",
    seatsFilter: "Seats",
    priceFilter: "Price Range",
    petrol: "Petrol",
    diesel: "Diesel",
    hybrid: "Hybrid",
    electric: "Electric",
    manual: "Manual",
    automatic: "Automatic",
    seats2: "2 Seats",
    seats5: "5 Seats",
    seats7: "7 Seats",
    howItWorks: "How It Works",
    step1Title: "Choose a Location",
    step1Description: "Select the ideal destination to begin your journey with ease",
    step2Title: "Choose Your Vehicle",
    step2Description: "Browse our fleet and find the perfect car for your needs",
    step3Title: "Verification",
    step3Description: "Review your information and confirm your booking",
    step: "Step",
    estimatedPrice: "Estimated Price",
    locationNotAvailable: "Location not available",
    year: "Year",
    transmission: "Transmission",
    fuelType: "Fuel Type",
    seats: "Seats",
    nextStep: "Next Step",
    tenant: "Tenant",
    otherDriver: "Other Driver",
    addOtherDriver: "Add Other Driver",
    hideOtherDriver: "Hide Other Driver",
    fullName: "Full Name",
    address: "Address",
    cin: "CIN",
    licenseNumber: "License Number",
    back: "Back",
    confirmBooking: "Confirm Booking",
    bookingInfo: "Booking Information",
    car: "Car",
    place: "Place",
    dates: "Dates",
    totalPrice: "Total Price",
    notAvailable: "Not Available",
    startDate: "Start Date",
    endDate: "End Date",
    confirmation: "Confirmation",
    quickLinks: "Quick Links",
    home: "Home",
    availableCars: "Available Cars",
    contactUs: "Contact Us",
    aboutUs: "About Us",
    contactInfo: "Contact Info",
    newsletter: "Newsletter",
    subscribeToOurNewsletterForUpdatesAndExclusiveOffers: "Subscribe to our newsletter for updates and exclusive offers.",
    enterYourEmail: "Enter your email",
    subscribe: "Subscribe",
    whyChooseUs: "Why Choose Us",
    excellenceInMoroccanCarRentalServices: "Excellence in Moroccan Car Rental Services",
    experienceTheFinestSelectionOfRentalCarsInMorocco: "Experience the finest selection of rental cars in Morocco.",
    competitivePricing: "Competitive Pricing",
    competitivePricingDesc: "Best self-drive deals in Morocco without compromising on quality",
    luxuryOptions: "Luxury Options",
    luxuryOptionsDesc: "Premium vehicles perfect for weddings and special occasions",
    expertService: "Expert Service",
    expertServiceDesc: "Certified mechanics and genuine spare parts for maintenance",
    roadAssistance: "24/7 Road Assistance",
    roadAssistanceDesc: "Round-the-clock support and assistance anywhere in Morocco",
    freePickUpDropOff: "Free Pick-Up & Drop-Off",
    freePickUpDropOffDesc: "Convenient delivery and collection service at your location",
    yourDreamCarAwaits: "Your Dream Car Awaits",
    experienceLuxuryAndComfortWithOurPremiumFleetOfVehicles: "Experience luxury and comfort with our premium fleet of vehicles.",
    exploreOurFleet: "Explore Our Fleet",
    vehiclesInStock: "Vehicles in Stock",
    yearsOfExcellence: "Years of Excellence",
    happyClients: "Happy Clients",
    expertReviews: "Expert Reviews",
    account: 'Account',
    personalInformation: 'Personal Information',
    passwordAndSecurity: 'Password & Security',
    preferences: 'Preferences',
    myBooking: 'My Booking',
    bookingHistory: 'Booking History',
    helpAndSupport: 'Help and Support',
    customerSupport: 'Customer Support',
    helpAndFAQ: 'Help and FAQ',
    signOut: 'Sign Out'
  },
  fr: {
    heroTitle: "Vous cherchez la voiture idéale? \nTrouvez la meilleure voiture pour votre voyage.",
    welcomeMessage: "Bienvenue chez Diabcar, votre partenaire de confiance en services de location de voitures. Vivez une expérience de confort et de fiabilité inégalée.",
    aboutUs: "Chez Diabcar, nous nous engageons à offrir les meilleurs véhicules et un service client exceptionnel. Notre flotte est constamment mise à jour pour répondre à vos besoins.",
    ourMission: "Notre mission est de fournir des solutions de location de voitures abordables et de haute qualité en mettant l'accent sur la satisfaction du client.",
    ourVision: "Nous envisageons un avenir où le voyage est accessible et agréable pour tous, et nous nous efforçons de rendre cela possible.",
    contactUsDescription: "Pour toute demande ou assistance, n'hésitez pas à nous contacter. Nous sommes disponibles 24/7 pour vous aider.",
    searchPlaceholder: "Entrez votre lieu souhaité ou le type de véhicule...",
    features: [
      "Tarifs abordables",
      "Services premium",
      "Assistance routière 24/7"
    ],
    pickUpLabel: "Lieu de prise en charge",
    pickUpDateLabel: "Date de prise en charge",
    returnDateLabel: "Date de retour",
    findButton: "Trouver un véhicule",
    bookNow: "Réserver",
    noImage: "Pas d'image",
    footerQuickLinks: "Liens rapides",
    footerInfoPages: "Pages d'information",
    footerLocation: "Notre emplacement",
    followUs: "Suivez-nous sur :",
    footerHome: "Accueil",
    footerFAQs: "FAQs",
    footerContact: "Contactez-nous",
    footerAbout: "À propos",
    footerTerms: "Conditions Générales",
    footerPrivacy: "Politique de confidentialité",
    chatButton: "Chattez avec nous",
    mostSearchedTitle: "Véhicules les plus recherchés",
    testimonialTitle: "Ce que disent nos clients satisfaits",
    statsTitle: "Nos chiffres parlent d'eux-mêmes",
    viewMore: "Voir plus de véhicules",
    navHome: "Accueil",
    navAvailableCars: "Voitures Disponibles",
    navContactUs: "Contactez-nous",
    profileOverview: "Vue d'ensemble du profil",
    myProfile: "Mon Profil",
    myBookings: "Mes Réservations",
    accountSettings: "Paramètres du compte",
    notifications: "Notifications",
    preferences: "Préférences",
    changePassword: "Changer le mot de passe",
    customerSupport: "Support Client",
    helpCenter: "Centre d'aide",
    contactSupport: "Contacter le support",
    signOut: "Déconnexion",
    notLoggedIn: "Non connecté",
    login: "Se connecter",
    register: "S'inscrire",
    signIn: "Se connecter",
    locationOptions: {
      all: "Tous",
      Casablanca: "Casablanca, Maroc",
      Rabat: "Rabat, Maroc",
      Marrakech: "Marrakech, Maroc",
      RabatAirport: "Aéroport de Rabat",
      CasablancaAirport: "Aéroport de Casablanca",
      MarrakechAirport: "Aéroport de Marrakech"
    },
    stats: {
      locations: "Localisations à travers le Maroc",
      carsAvailable: "Voitures Disponibles",
      vehicleCategories: "Catégories de véhicules",
      happyCustomers: "Clients Satisfaits",
      rentalsPerDay: "Locations par jour",
      yearsOfExcellence: "Années d'excellence"
    },
    termsDescription: "Veuillez lire attentivement nos conditions générales avant de louer une voiture.",
    privacyDescription: "Votre confidentialité est importante pour nous. Nous veillons à protéger vos données personnelles.",
    footerCopyright: "©2024 Diabcar. Tous droits réservés.",
    whatsAppMessage: "Bonjour, je voudrais louer une voiture !",
    address: "365, Boulevard Zerbout - Casablanca, Maroc.",
    downArrowAlt: "Flèche vers le bas",
    upArrowAlt: "Flèche vers le haut",
    mapTitle: "Carte",
    seats: "places",
    perDay: " / jour",
    fuelTypeFilter: "Type de carburant",
    transmissionFilter: "Transmission",
    seatsFilter: "Places",
    priceFilter: "Fourchette de prix",
    petrol: "Essence",
    diesel: "Diesel",
    hybrid: "Hybride",
    electric: "Électrique",
    manual: "Manuelle",
    automatic: "Automatique",
    seats2: "2 Places",
    seats5: "5 Places",
    seats7: "7 Places",
    howItWorks: "Comment ça marche",
    step1Title: "Choisir un lieu",
    step1Description: "Sélectionnez la destination idéale pour commencer votre voyage en toute simplicité",
    step2Title: "Choisir votre véhicule",
    step2Description: "Parcourez notre flotte et trouvez la voiture parfaite pour vos besoins",
    step3Title: "Vérification",
    step3Description: "Revisez vos informations et confirmez votre réservation",
    step: "Étape",
    estimatedPrice: "Prix estimé",
    locationNotAvailable: "Lieu non disponible",
    year: "Année",
    transmission: "Transmission",
    fuelType: "Type de carburant",
    seats: "Places",
    nextStep: "Étape suivante",
    tenant: "Locataire",
    otherDriver: "Autre conducteur",
    addOtherDriver: "Ajouter un autre conducteur",
    hideOtherDriver: "Masquer l'autre conducteur",
    fullName: "Nom complet",
    address: "Adresse",
    cin: "CIN",
    licenseNumber: "Numéro de permis",
    back: "Retour",
    confirmBooking: "Confirmer la réservation",
    bookingInfo: "Informations de réservation",
    car: "Voiture",
    place: "Lieu",
    dates: "Dates",
    totalPrice: "Prix total",
    notAvailable: "Non disponible",
    startDate: "Date de début",
    endDate: "Date de fin",
    confirmation: "Confirmation",
    quickLinks: "Liens rapides",
    home: "Accueil",
    availableCars: "Voitures Disponibles",
    contactUs: "Contactez-nous",
    aboutUs: "À propos",
    contactInfo: "Contact Info",
    newsletter: "Newsletter",
    subscribeToOurNewsletterForUpdatesAndExclusiveOffers: "Abonnez-vous à notre newsletter pour recevoir des mises à jour et des offres exclusives.",
    enterYourEmail: "Entrez votre email",
    subscribe: "S'abonner",
    whyChooseUs: "Pourquoi nous choisir",
    excellenceInMoroccanCarRentalServices: "L'excellence dans la location de voitures au Maroc",
    experienceTheFinestSelectionOfRentalCarsInMorocco: "Découvrez la meilleure sélection de voitures de location au Maroc.",
    competitivePricing: "Tarifs compétitifs",
    competitivePricingDesc: "Meilleures offres de location sans compromis sur la qualité",
    luxuryOptions: "Options de luxe",
    luxuryOptionsDesc: "Véhicules haut de gamme parfaits pour mariages et occasions spéciales",
    expertService: "Service expert",
    expertServiceDesc: "Mécaniciens certifiés et pièces d'origine pour l'entretien",
    roadAssistance: "Assistance routière 24/7",
    roadAssistanceDesc: "Assistance et support 24h/24 partout au Maroc",
    freePickUpDropOff: "Livraison & récupération gratuites",
    freePickUpDropOffDesc: "Service de livraison et de récupération à votre emplacement",
    yourDreamCarAwaits: "Votre Voiture Désire",
    experienceLuxuryAndComfortWithOurPremiumFleetOfVehicles: "Expérience de luxe et de confort avec notre flotte de véhicules haut de gamme.",
    exploreOurFleet: "Découvrez notre flotte",
    vehiclesInStock: "Voitures en stock",
    yearsOfExcellence: "Années d'excellence",
    happyClients: "Clients heureux",
    expertReviews: "Avis d'experts",
    account: 'Compte',
    personalInformation: 'Informations personnelles',
    passwordAndSecurity: 'Mot de passe & sécurité',
    preferences: 'Préférences',
    myBooking: 'Mes réservations',
    bookingHistory: 'Historique des réservations',
    helpAndSupport: 'Aide et support',
    customerSupport: 'Support client',
    helpAndFAQ: 'Aide et FAQ',
    signOut: 'Déconnexion'
  },
  ar: {
    heroTitle: "هل تبحث عن سيارة مثالية؟ \nاكتشف أفضل سيارة لرحلتك.",
    welcomeMessage: "مرحبًا بك في ديابكار، شريكك الموثوق في خدمات تأجير السيارات. تجربة جوية وموثوقة من أي وقت مضى.",
    aboutUs: "في ديابكار، نحن ملتزمون بتقديم السيارات الأفضل وخدمة العملاء المتميزة. مجموعتنا مستمرة التحديث لتلبية حاجاتك.",
    ourMission: "مهمتنا هي تقديم حلول تأجير سيارات معقولة وجودة مرتفعة مع التركيز على رضا العملاء.",
    ourVision: "نحن نتصور مستقبلًا حيث يكون السفر متاحًا وممتعًا للجميع، ونحن نسعى لجعل ذلك حقيقة.",
    contactUsDescription: "لأي إستفسار أو دعم، يرجى عدم التردد في الاتصال بنا. نحن هنا لمساعدتك 24/7.",
    searchPlaceholder: "أدخل موقعك المفضل أو نوع السيارة...",
    features: [
      "أسعار منافسة",
      "خدمات عالية",
      "رعاية متاجردة 24/7"
    ],
    pickUpLabel: "موقع التوصيل",
    pickUpDateLabel: "تاريخ التوصيل",
    returnDateLabel: "تاريخ الإرجاع",
    findButton: "إبحث عن سيارة",
    bookNow: "احجز الآن",
    noImage: "لا صورة",
    footerQuickLinks: "روابط الوصول السريع",
    footerInfoPages: "صفحات المعلومات",
    footerLocation: "موقعنا",
    followUs: "تابعنا على:",
    footerHome: "الرئيسية",
    footerFAQs: "الأسئلة الشائعة",
    footerContact: "اتصل بنا",
    footerAbout: "من نحن",
    footerTerms: "شروط الخدمة",
    footerPrivacy: "سياسة الخصوصية",
    chatButton: "تحدث معنا",
    mostSearchedTitle: "السيارات الأكثر بحثًا",
    testimonialTitle: "ما يقوله عملاؤنا السعداء",
    statsTitle: "الأرقام تتحدث عن أنفسهم",
    viewMore: "إظهار المزيد من السيارات",
    navHome: "الرئيسية",
    navAvailableCars: "السيارات المتاحة",
    navContactUs: "اتصل بنا",
    profileOverview: "ملخص الملف الشخصي",
    myProfile: "ملفي الشخصي",
    myBookings: "الحجوزات",
    accountSettings: "إعدادات الحساب",
    notifications: "الإشعارات",
    preferences: "التفضيلات",
    changePassword: "تغيير كلمة المرور",
    customerSupport: "دعم العملاء",
    helpCenter: "مركز المساعدة",
    contactSupport: "الاتصال بدعم الخدمة",
    signOut: "تسجيل خارج",
    notLoggedIn: "غير مسجل الدخول",
    login: "تسجيل الدخول",
    register: "التسجيل",
    signIn: "تسجيل",
    locationOptions: {
      all: "الكل",
      Casablanca: "كاسبلانكا، موروكو",
      Rabat: "رابت، موروكو",
      Marrakech: "مراكش، موروكو",
      RabatAirport: "مطار رابت",
      CasablancaAirport: "مطار كاسبلانكا",
      MarrakechAirport: "مطار مراكش"
    },
    stats: {
      locations: "مواقع عبر موروكو",
      carsAvailable: "سيارات متاحة",
      vehicleCategories: "فئات السيارات",
      happyCustomers: "عملاء سعداء",
      rentalsPerDay: "تأجيرات يومية",
      yearsOfExcellence: "سنوات التفوق"
    },
    termsDescription: "يرجى قراءة شروط الخدمة والأحكام بعناية قبل تأجير السيارة.",
    privacyDescription: "إن خصوصيتك مهمة لنا. نحن نضمن حماية البيانات الشخصية لديك.",
    footerCopyright: "©2024 ديابكار. جميع الحقوق محفوظة",
    whatsAppMessage: "مرحبًا، أريد أن أجير سيارة!",
    address: "365, بلدار زربوت - كاسبلانكا، موروكو.",
    downArrowAlt: "سهم للأسفل",
    upArrowAlt: "سهم للأعلى",
    mapTitle: "الخريطة",
    seats: "مقاعد",
    perDay: " / يوم",
    fuelTypeFilter: "نوع الوقود",
    transmissionFilter: "ناقل الحركة",
    seatsFilter: "المقاعد",
    priceFilter: "نطاق السعر",
    petrol: "بنزين",
    diesel: "ديزل",
    hybrid: "هايبرد",
    electric: "كهرباء",
    manual: "يدوي",
    automatic: "أوتوماتيك",
    seats2: "2 مقاعد",
    seats5: "5 مقاعد",
    seats7: "7 مقاعد",
    howItWorks: "كيف يعمل",
    step1Title: "اختيار موقع",
    step1Description: "حدد الوجهة المثالية لبدء رحلتك بسهولة",
    step2Title: "اختيار سيارتك",
    step2Description: "تصفح مجموعتنا واختيار السيارة المناسبة لك",
    step3Title: "التحقق",
    step3Description: "تصفح المعلومات وتأكيد الحجز",
    step: "الخطوة",
    estimatedPrice: "السعر المقدر",
    locationNotAvailable: "الموقع غير متاح",
    year: "السنة",
    transmission: "ناقل الحركة",
    fuelType: "نوع الوقود",
    seats: "المقاعد",
    nextStep: "الخطوة التالية",
    tenant: "المستأجر",
    otherDriver: "المانع",
    addOtherDriver: "إضافة مانع جديد",
    hideOtherDriver: "إخفاء المانع",
    fullName: "الاسم الكامل",
    address: "العنوان",
    cin: "رقم الهوية الوطنية",
    licenseNumber: "رقم رخصة القيادة",
    back: "العودة",
    confirmBooking: "تأكيد الحجز",
    bookingInfo: "معلومات الحجز",
    car: "السيارة",
    place: "المكان",
    dates: "التواريخ",
    totalPrice: "السعر الكلي",
    notAvailable: "غير متاح",
    startDate: "تاريخ البدء",
    endDate: "تاريخ الانتهاء",
    confirmation: "التأكيد",
    yourDreamCarAwaits: "سيارتك المثالية تنتظرك",
    experienceLuxuryAndComfortWithOurPremiumFleetOfVehicles: "تجربة جوية وموثوقة مع سياراتنا المتميزة.",
    exploreOurFleet: "استكشف سياراتنا",
    vehiclesInStock: "سيارات متاحة",
    yearsOfExcellence: "سنوات التفوق",
    happyClients: "عملاء سعداء",
    expertReviews: "مراجع خبراء",
    account: 'الحساب',
    personalInformation: 'المعلومات الشخصية',
    passwordAndSecurity: 'كلمة المرور والأمان',
    preferences: 'التفضيلات',
    myBooking: 'حجوزاتي',
    bookingHistory: 'سجل الحجوزات',
    helpAndSupport: 'المساعدة والدعم',
    customerSupport: 'دعم العملاء',
    helpAndFAQ: 'المساعدة والأسئلة الشائعة',
    signOut: 'تسجيل الخروج'
  }
};

/*---------------------------------------------------*/
/*             Update Moment Locale                */
/*---------------------------------------------------*/
function updateMomentLocale(selectedLanguage) {
  moment.locale(selectedLanguage);
}

/*---------------------------------------------------*/
/*                   Counter Component             */
/*---------------------------------------------------*/
function Counter({ end, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isVisible) {
    let start = 0;
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = end / steps;
      const interval = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
          setCount(end);
        clearInterval(timer);
        } else {
      setCount(Math.floor(start));
        }
      }, interval);

    return () => clearInterval(timer);
    } else {
      setCount(0); // Reset count when not visible
    }
  }, [isVisible, end]);

  return <>{count.toLocaleString()}</>;
}

/*---------------------------------------------------*/
/*       Petit composant BookNowButton (hover)      */
/*---------------------------------------------------*/
const BookNowButton = ({ to, children }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={"/"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.bookNowButton,
        border: "2px solid #4B2E2E",
        backgroundColor: hovered ? "#4B2E2E" : "transparent",
        color: hovered ? "#fff" : "#4B2E2E",
        transition: "all 0.3s ease"
      }}
    >
      {children}
    </Link>
  );
};

/*-------------------------*/
/*          Home           */
/*-------------------------*/
const Home = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem('language') || 'en'
  );
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [pickupLocation, setPickupLocation] = useState('All');
  const [priceValue, setPriceValue] = useState(5000);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [fuelSelected, setFuelSelected] = useState([]);
  const [transSelected, setTransSelected] = useState([]);
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [hoveredCard, setHoveredCard] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    start_date: null,
    end_date: null,
    locataire1: '',
    adresse1: '',
    cin1: '',
    permis1: '',
    locataire2: '',
    adresse2: '',
    cin2: '',
    permis2: ''
  });
  const [showTenant2, setShowTenant2] = useState(false);
  const [currency, setCurrency] = useState('MAD');
  const conversionRates = { MAD: 1, EURO: 0.09, DOLLAR: 0.1 };

  // Déplacement conditionnel pour la section "most searched"
  const mostSearchedSectionStyle = {
    ...styles.mostSearchedSection,
    marginTop: isMobile ? "300px" : "150px"
  };

  useEffect(() => {
    updateMomentLocale(selectedLanguage);
  }, [selectedLanguage]);

  const lang = texts[selectedLanguage];
  // Récupération user depuis localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isLoggedIn = !!user;
  const userName = user ? user.name : "";

  // État du formulaire de recherche
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [dateRangeFocused, setDateRangeFocused] = useState(null);
  const [carName, setCarName] = useState("All");
  const [transmission, setTransmission] = useState("All");
  const [fuelType, setFuelType] = useState("All");
  const [seatsNumber, setSeatsNumber] = useState("All");
  const [locationValue, setLocation] = useState("All");

  // Liste de voitures depuis API
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount] = useState(9);

  const API_URL = process.env.REACT_APP_API_URL;
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const fetchCars = async () => {
    try {
      const res = await axios.get(`${API_URL}/cars`);
      let data = res.data;
      if (!Array.isArray(data) && data.cars && Array.isArray(data.cars)) {
        data = data.cars;
      }
      if (Array.isArray(data)) {
        // Remove the filter for available cars and set all cars
        setCars(data);
      } else {
        console.error("API response is not an array");
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, []);

  const handleFindVehicle = () => {
    const filterParams = {
      pickupLocation,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
      priceValue: priceRange[1],
      fuelType: fuelType,
      transmission: transmission,
      seatsNumber: seatsNumber
    };
    const queryString = new URLSearchParams(filterParams).toString();
    navigate(`/available-cars?${queryString}`);
  };

  // Grille responsive (mobile vs desktop)
  const dynamicGridStyle = isMobile
    ? {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        width: "100%"
      }
    : {
    display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px 15px",
    justifyItems: "center"
  };
  
  // Style du container de recherche
  const searchContainerStyle = {
    width: "95%",
    maxWidth: "1200px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    overflow: "hidden"
  };
  const searchHeader = {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "15px 20px",
    fontSize: "18px",
    fontWeight: "500",
    width: "100%"
  };
  const searchContent = {
    padding: "20px",
    backgroundColor: "#f5f5f5"
  };
  const searchRow = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  };
  const searchField = {
    flex: "1",
    minWidth: "180px",
    margin: 0,
    padding: '0 0 0 0',
  };
  const searchLabel = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#333",
    fontWeight: "500"
  };
  const select = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "14px"
  };
  const dateRangeContainer = {
    flex: "1",
    minWidth: "220px",
    margin: 0,
    padding: 0,
  };
  const priceRangeContainer = {
    flex: "0.8",
    minWidth: "180px",
    margin: 0,
    padding: 0,
    marginTop: "16px",
  };
  const searchButtonContainer = {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#fff"
  };
  const searchButton = {
    backgroundColor: "#666",
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textTransform: "uppercase",
    fontWeight: "500"
  };

  // Style conditionnel de la carte voiture
  const cardStyle = useMemo(() => {
    return isMobile ? { ...styles.card, maxWidth: "100%" } : styles.card;
  }, [isMobile]);

  // Style dynamique du conteneur de statistiques
  const statsContainerStyle = useMemo(() => {
    return {
      ...styles.statsContainer,
      gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)"
    };
  }, [isMobile]);

  // Référence pour le slider de témoignages
  const testimonialRef = useRef(null);
  const scrollLeft = () => {
    testimonialRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    testimonialRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Témoignages (exemple statique)
  const testimonials = [
    {
      title: "Meilleur choix !",
      text: "Service rapide et voitures bien entretenues.",
      user: "Fatima Benali",
      date: "10.03.2024",
      avatar: "/images/user1.png"
    },
    {
      title: "Bon rapport qualité-prix",
      text: "Facile à réserver, personnel accueillant.",
      user: "Youssef Alaoui",
      date: "25.02.2024",
      avatar: "/images/user2.png"
    },
    {
      title: "Je recommande vivement",
      text: "Grande disponibilité et voitures en bon état.",
      user: "Hajar Mounir",
      date: "12.01.2024",
      avatar: "/images/user3.png"
    },
    {
      title: "Meilleure expérience",
      text: "Les prix sont imbattables, super staff.",
      user: "Said Berrada",
      date: "07.12.2023",
      avatar: "/images/user4.png"
    },
    {
      title: "Excellente agence",
      text: "Tout était parfait pour mon séjour.",
      user: "Mouna Tazi",
      date: "21.11.2023",
      avatar: "/images/user5.png"
    },
    {
      title: "Au top !",
      text: "Rapide, fiable et très professionnel.",
      user: "Omar Regragui",
      date: "02.11.2023",
      avatar: "/images/user6.png"
    }
  ];

  // Générer des nombres d'étoiles aléatoires pour chaque témoignage
  const testimonialsWithStars = useMemo(() => {
    const starRatings = [];
    for (let i = 0; i < 4; i++) {
      starRatings.push(Math.floor(Math.random() * 2) + 4); // 4 ou 5
    }
    for (let i = 0; i < 2; i++) {
      starRatings.push(Math.floor(Math.random() * 5) + 1); // 1-5
    }
    // Mélanger un peu
    starRatings.sort(() => Math.random() - 0.5);
    return testimonials.map((t, i) => ({ ...t, stars: starRatings[i] }));
  }, [testimonials]);

  // Stats data
  const statsData = [
    { end: 20, label: lang.stats.locations },
    { end: 500, label: lang.stats.carsAvailable },
    { end: 10, label: lang.stats.vehicleCategories },
    { end: 15000, label: lang.stats.happyCustomers },
    { end: 200, label: lang.stats.rentalsPerDay },
    { end: 10, label: lang.stats.yearsOfExcellence }
  ];

  // Gestion de la déconnexion
  const handleSignOut = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Ouverture de WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "212659775582";
    const message = encodeURIComponent(lang.whatsAppMessage || "Hello, I'd like to rent a car!");
    const isMobileAgent = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || navigator.vendor);
    if (isMobileAgent) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, "_blank");
    }
  };

  // Add these animation styles
  const animationStyles = {
    fadeInUp: {
      opacity: 0,
      transform: 'translateY(30px)',
      transition: 'all 0.6s ease-out'
    },
    fadeInUpVisible: {
      opacity: 1,
      transform: 'translateY(0)'
    },
    fadeInLeft: {
      opacity: 0,
      transform: 'translateX(-30px)',
      transition: 'all 0.6s ease-out'
    },
    fadeInLeftVisible: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    fadeInRight: {
      opacity: 0,
      transform: 'translateX(30px)',
      transition: 'all 0.6s ease-out'
    },
    fadeInRightVisible: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    scaleIn: {
      opacity: 0,
      transform: 'scale(0.9)',
      transition: 'all 0.6s ease-out'
    },
    scaleInVisible: {
      opacity: 1,
      transform: 'scale(1)'
    },
    fadeInStaggered: {
      opacity: 0,
      transform: 'translateY(20px)',
      transition: 'all 0.6s ease-out'
    },
    fadeInStaggeredVisible: {
      opacity: 1,
      transform: 'translateY(0)'
    },
    heroSlideInLeft: {
      opacity: 0,
      transform: 'translateX(-100%)',
      transition: 'all 0.6s ease-out'
    },
    heroSlideInLeftVisible: {
      opacity: 1,
      transform: 'translateX(0)'
    },
    heroFadeIn: {
      opacity: 0,
      transition: 'opacity 0.6s ease-out'
    },
    heroFadeInVisible: {
      opacity: 1
    },
    heroReveal: {
      opacity: 0,
      transform: 'translateY(20px)',
      filter: 'blur(10px)',
      transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    heroRevealVisible: {
      opacity: 1,
      transform: 'translateY(0)',
      filter: 'blur(0)'
    }
  };

  // Update the renderCarCard function to include staggered animation
  const renderCarCard = (car, index) => {
    const isMobileCard = width < 768;
    // Calculate delay based on index
    const delay = index * 0.2; // 200ms delay between each card
    const isHovered = hoveredCard === car.id;

    return (
      <div
        key={car.id}
        className="car-card"
        onMouseEnter={(e) => {
          setHoveredCard(car.id);
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
          e.currentTarget.style.transition = 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out';
        }}
        onMouseLeave={(e) => {
          setHoveredCard(null);
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={{
          ...styles.card,
          width: isMobileCard ? "95vw" : styles.card.width,
          maxWidth: isMobileCard ? "100%" : styles.card.maxWidth,
          background: "#fff",
          color: "#222",
          border: "1px solid #eee",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          margin: isMobileCard ? "0 auto 16px auto" : styles.card.margin,
          display: "flex",
          flexDirection: "column",
          zIndex: 1
        }}
      >
        <div style={{ ...styles.cardImageContainer, boxShadow: "none" }}>
          {car.image_url ? (
            <img
              src={`${BASE_URL}${car.image_url}`}
              alt={car.name ? car.name.toUpperCase() : ''}
              style={{
                ...styles.cardImage,
                boxShadow: "none"
              }}
            />
          ) : (
            <div style={styles.noImage}>{lang.noImage}</div>
          )}

          {/* Badge notation */}
          <div style={styles.ratingBadge}>
            <span style={{ fontWeight: "600", marginRight: 4 }}>{car.rating || 0}</span>
            <FaStar style={{ color: '#FFD700', fontSize: '16px', verticalAlign: 'middle', marginRight: 4 }} />
            <span style={{ fontSize: '12px', color: '#666' }}>({car.reviews || 0} reviews)</span>
          </div>
        </div>

        <div
          style={{
            ...styles.cardInfo,
            boxShadow: "none",
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "15px",
            border: "0.5px solid #ccc"
          }}
        >
          <h3 style={styles.carTitle}>
            {car.name ? car.name.toUpperCase() : ''} - {car.model ?? "Model"}
          </h3>
          <div style={styles.locationContainer}>
            <img
              src="/images/location.png"
              alt="Loc"
              style={styles.locationIcon}
            />
            <span style={styles.locationText}>
              {Array.isArray(car.location)
                ? car.location.length > 3
                  ? car.location.slice(0, 3).join(" - ") + "..."
                  : car.location.join(" - ")
                : car.location}
            </span>
          </div>

          <hr
            style={{
              width: "80%",
              margin: "10px auto",
              border: 0,
              borderTop: "1px solid #ccc"
            }}
          />

          <div style={styles.infoRow}>
            <span style={styles.infoItem}>
              <FaCalendar style={styles.icon} /> {car.year}
            </span>
            <span style={styles.infoItem}>
              <FaCogs style={styles.icon} /> {car.transmission}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoItem}>
              <FaGasPump style={styles.icon} /> {car.fuel_type}
            </span>
            <span style={styles.infoItem}>
              <FaUsers style={styles.icon} /> {car.seats} {lang.seats}
            </span>
          </div>

          <div style={styles.cardFooter}>
            <p style={styles.carPrice}>
              {car.price_per_day} MAD
              {lang.perDay}
            </p>

            <button
              onClick={() => handleBooking(car)}
              style={{
                ...styles.bookNowButton,
                backgroundColor: "#fff",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
        onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#333';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
                e.currentTarget.style.color = '#333';
          e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {lang.bookNow}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Ajout des Google Fonts + style custom
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const style = document.createElement('style');
    style.textContent = `
      * {
        font-family: 'Poppins', Arial, sans-serif;
      }
      .nav-link {
        position: relative;
        text-decoration: none;
        color: #333;
        font-family: 'Poppins', Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        padding: 8px 0;
        margin: 0 15px;
        transition: color 0.4s ease;
      }
      .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 1px;
        left: 0;
        background-color: #722637;
        transition: width 0.4s ease-in-out;
        opacity: 0;
      }
      .nav-link:hover {
        color: #722637;
      }
      .nav-link:hover::after {
        width: 100%;
        opacity: 1;
      }

      /* DateRangePicker personnalisé */
      .DateRangePickerInput {
        border: 1px solid #722637 !important;
        border-radius: 5px !important;
        background-color: white !important;
      }
      .DateInput {
        border-radius: 5px !important;
      }
      .DateInput_input {
        border-radius: 5px !important;
        font-family: 'Poppins', Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: 400 !important;
        color: #333 !important;
      }
      .DateRangePickerInput_arrow {
        color: #722637 !important;
      }
      .DateInput_input__focused {
        border-bottom: 2px solid #722637 !important;
      }
      .CalendarDay__selected,
      .CalendarDay__selected:hover {
        background: #722637 !important;
        border: 1px double #722637 !important;
      }
      .CalendarDay__selected_span {
        background: #a53c52 !important;
        border: 1px double #a53c52 !important;
        color: white !important;
      }
      .CalendarDay__hovered_span,
      .CalendarDay__hovered_span:hover {
        background: #d6a3b0 !important;
        border: 1px double #d6a3b0 !important;
        color: white !important;
      }
      .DateRangePicker_picker,
      .SingleDatePicker_picker {
        z-index: 9999 !important;
      }
      body[style*="overflow: hidden"] {
        overflow: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(fontLink);
      document.head.removeChild(style);
    };
  }, []);

  // Bouton de scroll
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScrollPercentage = Math.round((window.scrollY / scrollHeight) * 100);
      setScrollPercentage(currentScrollPercentage);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Gérer la sélection de plage de dates
  const handleDatesChange = ({ startDate, endDate }) => {
    setPickupDate(startDate);
    setReturnDate(endDate);
  };

  // Valeurs fixes pour le type de carburant
  const fuelTypeOptions = ["All", "Petrol", "Diesel", "Hybrid", "Electric"];

  // Extraire les valeurs uniques des attributs des voitures
  const uniqueCarNames = useMemo(() => {
    return ["All", ...new Set(cars.map(car => car.name))];
  }, [cars]);

  const uniqueTransmissions = useMemo(() => {
    return ["All", ...new Set(cars.map(car => car.transmission))];
  }, [cars]);

  const uniqueSeatsNumbers = useMemo(() => {
    return ["All", ...new Set(cars.map(car => car.seats).sort((a, b) => a - b))];
  }, [cars]);

  const uniqueLocations = useMemo(() => {
    const locations = cars.map(car => {
      if (typeof car.location === 'string') {
        return car.location.replace(/\[|\]|"/g, '').trim();
      }
      return car.location;
    });
    return ["All", ...new Set(locations)].filter(item => item);
  }, [cars]);

  // Add this function before the return statement
  const isAnyInputFilled = () => {
    return transmission !== "All" || 
           fuelType !== "All" || 
           seatsNumber !== "All" || 
           locationValue !== "All" || 
           startDate !== null || 
           endDate !== null;
  };

  // Add refs for sections
  const [mostSearchedRef, mostSearchedVisible] = useScrollAnimation({ threshold: 0.2 });
  const [whyChooseUsRef, whyChooseUsVisible] = useScrollAnimation({ threshold: 0.2 });
  const [howItWorksRef, howItWorksVisible] = useScrollAnimation({ threshold: 0.2 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.7 });
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation({ threshold: 0.2 });

  // Add these state variables near the top of the Home component
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialScrollLeft, setInitialScrollLeft] = useState(0);

  // Add these functions before the return statement
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - testimonialRef.current.offsetLeft);
    setInitialScrollLeft(testimonialRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - testimonialRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    testimonialRef.current.scrollLeft = initialScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add this state near other state declarations
  const [heroVisible, setHeroVisible] = useState(false);

  // Add this useEffect after other useEffects
  useEffect(() => {
    // Trigger hero animations after a short delay
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleBooking = (car) => {
    if (!isLoggedIn) {
      window.location.href = '/UserLogin';
      return;
    }
    setSelectedCar(car);
    setBookingModalOpen(true);
    setCurrentStep(1);
    setBookingData({
      start_date: null,
      end_date: null,
      locataire1: '',
      adresse1: '',
      cin1: '',
      permis1: '',
      locataire2: '',
      adresse2: '',
      cin2: '',
      permis2: ''
    });
    setShowTenant2(false);
  };

  const formatDateInEnglish = (date) => {
    if (!date) return '';
    return moment(date).format('DD MMMM YYYY');
  };

  const convertPrice = (price) => {
    return (price * conversionRates[currency]).toFixed(2);
  };

  const getCurrencySymbol = () => {
    switch(currency) {
      case 'EURO': return '€';
      case 'DOLLAR': return '$';
      default: return 'MAD';
    }
  };

  const handleBookingConfirm = async () => {
    try {
      const days = bookingData.start_date && bookingData.end_date
        ? moment(bookingData.end_date).diff(moment(bookingData.start_date), 'days') + 1
        : 0;
      const totalPrice = days * (selectedCar.price_per_day || 0);
      const data = {
        user_id: user.id,
        car_id: selectedCar.id,
        start_date: bookingData.start_date ? bookingData.start_date.format('YYYY-MM-DD') : null,
        end_date: bookingData.end_date ? bookingData.end_date.format('YYYY-MM-DD') : null,
        total_price: totalPrice,
        ...bookingData,
        status: 'pending'
      };
      await axios.post(`${API_URL}/bookings`, data);

      // Message WhatsApp avec le même format que AvailableCar.js
      const startStr = bookingData.start_date ? formatDateInEnglish(bookingData.start_date) : '';
      const endStr = bookingData.end_date ? formatDateInEnglish(bookingData.end_date) : '';
      const message = `🚗 Demande de location de voiture

Bonjour,

Je souhaite réserver une voiture avec les détails suivants :

🔹 Nom du client : ${user?.name || ''}
📞 Numéro de téléphone : ${user?.phone || ''}
📍 Lieu de retour : ${selectedCar?.location || ''}
📅 Date de début : ${startStr}
📅 Date de fin : ${endStr}
🚘 Modèle du véhicule : ${selectedCar?.name ? selectedCar.name.toUpperCase() : ''} - ${selectedCar?.model || ''}
💰 Prix total : ${convertPrice(totalPrice)} ${getCurrencySymbol()}

Locataire:
- Nom: ${bookingData.locataire1}
- Adresse: ${bookingData.adresse1}
- CIN: ${bookingData.cin1}
- Permis: ${bookingData.permis1}

${bookingData.locataire2 ? `Autre Conducteur:
- Nom: ${bookingData.locataire2}
- Adresse: ${bookingData.adresse2}
- CIN: ${bookingData.cin2}
- Permis: ${bookingData.permis2}
` : ''}
Pourriez-vous confirmer la disponibilité pour finaliser cette réservation ? ✅

Merci d'avance !`;

      const whatsappURL = `https://web.whatsapp.com/send?phone=212632835968&text=${encodeURIComponent(message)}&app_absent=0`;
      window.open(whatsappURL, '_blank');

      setBookingModalOpen(false);
      setCurrentStep(1);
      setBookingData({
        start_date: null,
        end_date: null,
        locataire1: '',
        adresse1: '',
        cin1: '',
        permis1: '',
        locataire2: '',
        adresse2: '',
        cin2: '',
        permis2: ''
      });
      setShowTenant2(false);
      setSelectedCar(null);
      alert('Réservation envoyée !');
    } catch (error) {
      console.error('Erreur lors de la réservation:', error);
      alert('Erreur lors de la réservation.');
    }
  };

  const cancelBooking = () => {
    setShowBookingPopup(false);
    setSelectedCar(null);
  };

  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setBookingModalOpen(false);
      setCurrentStep(1);
      setBookingData({
        start_date: null,
        end_date: null,
        locataire1: '',
        adresse1: '',
        cin1: '',
        permis1: '',
        locataire2: '',
        adresse2: '',
        cin2: '',
        permis2: ''
      });
      setShowTenant2(false);
      setSelectedCar(null);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    return moment(date).format('YYYY-MM-DD');
  };
  const getCurrentDateFormatted = () => {
    return moment().format('YYYY-MM-DD');
  };

  const renderBookingModal = () => {
    if (!selectedCar) return null;
    const days = bookingData.start_date && bookingData.end_date
      ? moment(bookingData.end_date).diff(moment(bookingData.start_date), 'days') + 1
      : 0;
    const totalPrice = days * (selectedCar.price_per_day || 0);
    
    return (
      <div style={styles.modalOverlay} onClick={handleModalOverlayClick}>
        <div
          style={
            isMobile
              ? {
                  background: '#fff',
                  margin: '24px auto',
                  width: '95vw',
                  maxWidth: 500,
                  borderRadius: 16,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  padding: 16,
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }
              : styles.modalContent
          }
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            style={
              isMobile
                ? {
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 40,
                    height: 40,
                    padding: 0,
                    background: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }
                : styles.closeButton
            }
            onClick={() => {
              setBookingModalOpen(false);
              setCurrentStep(1);
              setBookingData({
                start_date: null,
                end_date: null,
                locataire1: '',
                adresse1: '',
                cin1: '',
                permis1: '',
                locataire2: '',
                adresse2: '',
                cin2: '',
                permis2: ''
              });
              setShowTenant2(false);
              setSelectedCar(null);
            }}
          >
            <img 
              src="/images/fermer.png" 
              alt="Close" 
              style={
                isMobile
                  ? { width: 18, height: 18 }
                  : styles.closeIconImage
              }
            />
          </button>
          <div
            style={
              isMobile
                ? {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 12,
                    padding: 0,
                  }
                : styles.newBookingContainer
            }
          >
            {/* Left side - Car Image */}
            <div
              style={
                isMobile
                  ? {
                      width: '100%',
                      minHeight: 'unset',
                      padding: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      display: 'flex',
                      background: 'transparent',
                      borderRadius: '12px 12px 0 0',
                      position: 'relative',
                      flexDirection: 'column',
                      marginBottom: 12,
                    }
                  : styles.newImageColumn
              }
            >
              <img
                src={selectedCar.image_url ? `${BASE_URL}${selectedCar.image_url}` : '/images/no-car.png'}
                alt={`${selectedCar.name ? selectedCar.name.toUpperCase() : ''} ${selectedCar.model}`} 
                style={
                  isMobile
                    ? {
                        maxHeight: 120,
                        width: '100%',
                        objectFit: 'contain',
                        margin: '0 auto',
                        display: 'block',
                        borderRadius: 10,
                      }
                    : styles.newCarImage
                }
              />
              {isMobile ? (
                <div style={{
                  textAlign: 'center',
                  margin: '12px 0 0 0',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#444',
                  padding: '8px 0',
                  borderBottom: '1px solid #eee',
                  width: '100%',
                }}>
                  {lang.estimatedPrice} : {totalPrice} MAD
                </div>
              ) : (
              <div style={styles.newPriceContainer}>
                <p style={styles.newPriceText}>
                  {lang.estimatedPrice} : {totalPrice} MAD
                </p>
              </div>
              )}
            </div>
            {/* Right side - Car Details */}
            <div
              style={
                isMobile
                  ? {
                      width: '100%',
                      padding: 0,
                      minWidth: 0,
                      textAlign: 'left',
                      marginTop: 10,
                    }
                  : styles.newDetailsColumn
              }
            >
              <div style={styles.newCarHeader}>
                <h2 style={styles.newCarTitle}>
                  {selectedCar.name ? selectedCar.name.toUpperCase() : ''} - {selectedCar.model}
                </h2>
                <div style={styles.newLocationRow}>
                  <FaMapMarkerAlt style={styles.newLocationIcon} />
                  <span>{selectedCar.location || lang.locationNotAvailable}</span>
                </div>
              </div>
              <div
                style={
                  isMobile
                    ? {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: 7,
                        padding: 0,
                        marginBottom: 12,
                        fontSize: 13,
                        background: '#f8f8f8',
                        borderRadius: 8,
                        paddingTop: 8,
                        paddingBottom: 8,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }
                    : styles.newSpecsGrid
                }
              >
                <div style={styles.newSpecItem}>
                  <FaCalendarAlt style={styles.newSpecIcon} />
                  <span><strong>{lang.year} : </strong> {selectedCar.year || lang.notAvailable}</span>
                </div>
                <div style={styles.newSpecItem}>
                  <FaCog style={styles.newSpecIcon} />
                  <span><strong>{lang.transmission} : </strong> {selectedCar.transmission || lang.notAvailable}</span>
                </div>
                <div style={styles.newSpecItem}>
                  <FaGasPump style={styles.newSpecIcon} />
                  <span><strong>{lang.fuelType} : </strong> {selectedCar.fuel_type || lang.notAvailable}</span>
                </div>
                <div style={styles.newSpecItem}>
                  <FaUsers style={styles.newSpecIcon} />
                  <span><strong>{lang.seats} : </strong> {selectedCar.seats ? `${selectedCar.seats}` : lang.notAvailable}</span>
                </div>
              </div>
              <div style={styles.stepsContainer}>
                <div style={styles.progressBarOuter}>
                  {[1, 2, 3].map((stepIndex, idx) => (
                    <React.Fragment key={stepIndex}>
                      <div style={{
                        ...styles.progressStepColumn,
                        ...(isMobile ? { minWidth: 80 } : {}),
                      }}>
                        <div
                          style={{
                            ...styles.progressStep,
                            ...(currentStep >= stepIndex ? styles.progressStepCompleted : {}),
                            ...(isMobile ? { width: 32, height: 32, fontSize: 15 } : {}),
                          }}
                        >
                          {stepIndex}
                        </div>
                        <div style={{
                          ...styles.progressLabel,
                          ...(currentStep === stepIndex ? styles.progressLabelActive : {}),
                          ...(isMobile ? { fontSize: 11, marginTop: 4 } : {}),
                        }}>
                          {stepIndex === 1 ? lang.dates : stepIndex === 2 ? lang.tenant : lang.confirmation}
                        </div>
                      </div>
                      {stepIndex < 3 && (
                        <div style={{
                          ...styles.progressBarLine,
                          ...(currentStep > stepIndex ? styles.progressBarLineCompleted : {}),
                          ...(isMobile ? { width: 15, marginTop: '-2px', marginLeft: 2, marginRight: 2 } : {}),
                        }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {/* Step 1: Date Selection */}
              {currentStep === 1 && (
                <div style={styles.newDateContainer}>
                    <div 
                    style={{
                      ...styles.newDatePickerRow,
                      cursor: 'pointer'
                    }}
                      onClick={() => {
                        document.getElementById('startDateInput').showPicker();
                      }}
                    >
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ 
                        fontSize: '14px', 
                        color: bookingData.start_date ? '#000' : '#666',
                        fontWeight: bookingData.start_date ? '500' : 'normal'
                      }}>
                        {bookingData.start_date ? formatDateInEnglish(bookingData.start_date) : lang.startDate}
                      </span>
                    </div>
                    <span style={styles.newDateArrow}>→</span>
                    <div 
                      style={{ display: 'flex', flexDirection: 'column', flex: 1, cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('endDateInput').showPicker();
                      }}
                    >
                      <span style={{ 
                        fontSize: '14px', 
                        color: bookingData.end_date ? '#000' : '#666',
                        fontWeight: bookingData.end_date ? '500' : 'normal'
                      }}>
                        {bookingData.end_date ? formatDateInEnglish(bookingData.end_date) : lang.endDate}
                      </span>
                    </div>
                  </div>
                  {/* Hidden date inputs */}
                  <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                  <input
                    id="startDateInput"
                    type="date"
                    value={bookingData.start_date ? formatDateForInput(bookingData.start_date) : ''}
                    onChange={(e) => setBookingData({...bookingData, start_date: moment(e.target.value)})}
                    min={getCurrentDateFormatted()}
                  />
                  <input
                    id="endDateInput"
                    type="date"
                    value={bookingData.end_date ? formatDateForInput(bookingData.end_date) : ''}
                    onChange={(e) => setBookingData({...bookingData, end_date: moment(e.target.value)})}
                    min={bookingData.start_date ? formatDateForInput(bookingData.start_date) : getCurrentDateFormatted()}
                  />
                  </div>
                  <button 
                    style={{
                      ...styles.newConfirmButton,
                      ...((!bookingData.start_date || !bookingData.end_date) && styles.newConfirmButtonDisabled)
                    }}
                    onClick={() => {
                      if (bookingData.start_date && bookingData.end_date) {
                        setCurrentStep(2);
                      }
                    }}
                    disabled={!bookingData.start_date || !bookingData.end_date}
                  >
                    {lang.nextStep}
                  </button>
                </div>
              )}
              {/* Step 2: Tenant Information */}
              {currentStep === 2 && (
                <div style={styles.tenantInfoContainer}>
                  <h3 style={styles.tenantInfoTitle}>{lang.tenant}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#f9f9f9', borderRadius: 8, padding: 15 }}>
                      <input
                        type="text"
                      placeholder={lang.fullName}
                        value={bookingData.locataire1}
                        onChange={(e) => setBookingData({...bookingData, locataire1: e.target.value})}
                        style={styles.input}
                      />
                      <input
                        type="text"
                      placeholder={lang.address}
                        value={bookingData.adresse1}
                        onChange={(e) => setBookingData({...bookingData, adresse1: e.target.value})}
                        style={styles.input}
                      />
                      <input
                        type="text"
                      placeholder={lang.cin}
                        value={bookingData.cin1}
                        onChange={(e) => setBookingData({...bookingData, cin1: e.target.value})}
                        style={styles.input}
                      />
                      <input
                        type="text"
                      placeholder={lang.licenseNumber}
                        value={bookingData.permis1}
                        onChange={(e) => setBookingData({...bookingData, permis1: e.target.value})}
                        style={styles.input}
                      />
                    </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 20}}>
                      <h3 style={styles.tenantInfoTitle}>{lang.otherDriver}</h3>
                    {!showTenant2 && (
                      <button
                        type="button"
                        style={{
                          background: '#eee',
                          border: 'none',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          cursor: 'pointer',
                          marginLeft: 8,marginTop:-10
                        }}
                        onClick={() => setShowTenant2(true)}
                        aria-label={lang.addOtherDriver}
                      >
                        <FaPlus />
                      </button>
                    )}
                    {showTenant2 && (
                      <button
                        type="button"
                        style={{
                          background: '#eee',
                          border: 'none',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          cursor: 'pointer',
                          marginLeft: 8
                        }}
                        onClick={() => setShowTenant2(false)}
                        aria-label={lang.hideOtherDriver}
                      >
                        <FaMinus />
                      </button>
                    )}
                    </div>
                    {showTenant2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, background: '#f9f9f9', borderRadius: 8, padding: 15 }}>
                            <input
                              type="text"
                        placeholder={lang.fullName}
                              value={bookingData.locataire2}
                              onChange={(e) => setBookingData({...bookingData, locataire2: e.target.value})}
                              style={styles.input}
                            />
                            <input
                              type="text"
                        placeholder={lang.address}
                              value={bookingData.adresse2}
                              onChange={(e) => setBookingData({...bookingData, adresse2: e.target.value})}
                              style={styles.input}
                            />
                            <input
                              type="text"
                        placeholder={lang.cin}
                              value={bookingData.cin2}
                              onChange={(e) => setBookingData({...bookingData, cin2: e.target.value})}
                              style={styles.input}
                            />
                            <input
                              type="text"
                        placeholder={lang.licenseNumber}
                              value={bookingData.permis2}
                              onChange={(e) => setBookingData({...bookingData, permis2: e.target.value})}
                              style={styles.input}
                            />
                          </div>
                    )}
                  <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                    <button 
                      style={{ ...styles.backButton, height: 48 }}
                      onClick={() => setCurrentStep(1)}
                    >
                      {lang.back}
                    </button>
                    <button
                      style={{
                        ...styles.newConfirmButton,
                        height: 48,
                        ...((!bookingData.locataire1 || !bookingData.adresse1 || !bookingData.cin1 || !bookingData.permis1) && styles.newConfirmButtonDisabled)
                      }}
                      onClick={() => setCurrentStep(3)}
                      disabled={!bookingData.locataire1 || !bookingData.adresse1 || !bookingData.cin1 || !bookingData.permis1}
                    >
                      {lang.nextStep}
                    </button>
                  </div>
                </div>
              )}
              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                  <div style={{ width: '100%', maxWidth: 500, background: '#f9f9f9', borderRadius: 8, padding: 24, marginBottom: 20 }}>
                    {/* Titre principal */}
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 20, color: '#222', marginBottom: 18, textAlign: 'left', paddingLeft: 12 }}>
                      <FaMinus style={{ fontSize: 14, color: '#222', marginRight: 8 }} />
                      {lang.bookingInfo} :
                    </div>
                    {/* Sous-titres réservation */}
                    <div style={{ marginBottom: 8, textAlign: 'left' }}><b>{lang.car}</b> {selectedCar.name ? selectedCar.name.toUpperCase() : ''} - {selectedCar.model}</div>
                    <div style={{ marginBottom: 8, textAlign: 'left' }}><b>{lang.place}</b> {selectedCar.location}</div>
                    <div style={{ marginBottom: 8, textAlign: 'left' }}><b>{lang.dates}</b> {bookingData.start_date ? formatDateInEnglish(bookingData.start_date) : ''} → {bookingData.end_date ? formatDateInEnglish(bookingData.end_date) : ''}</div>
                    <div style={{ marginBottom: 18, textAlign: 'left' }}><b>{lang.totalPrice}</b> {convertPrice(totalPrice)} {getCurrencySymbol()}</div>
                    {/* Titre Locataire */}
                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 20, color: '#222', margin: '24px 0 12px 0', textAlign: 'left', paddingLeft: 12 }}>
                      <FaMinus style={{ fontSize: 14, color: '#222', marginRight: 8 }} />
                      {lang.tenant}
                    </div>
                    <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.fullName}</b> {bookingData.locataire1}</div>
                    <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.address}</b> {bookingData.adresse1}</div>
                    <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.cin}</b> {bookingData.cin1}</div>
                    <div style={{ marginBottom: 18, textAlign: 'left' }}><b>{lang.licenseNumber}</b> {bookingData.permis1}</div>
                    {/* Autre Conducteur si présent */}
                    {bookingData.locataire2 && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', fontSize: 20, color: '#222', margin: '24px 0 12px 0', textAlign: 'left', paddingLeft: 12 }}>
                          <FaMinus style={{ fontSize: 14, color: '#222', marginRight: 8 }} />
                          {lang.otherDriver}
                        </div>
                        <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.fullName}</b> {bookingData.locataire2}</div>
                        <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.address}</b> {bookingData.adresse2}</div>
                        <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.cin}</b> {bookingData.cin2}</div>
                        <div style={{ marginBottom: 6, textAlign: 'left' }}><b>{lang.licenseNumber}</b> {bookingData.permis2}</div>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <button 
                      style={{ ...styles.backButton, height: 48 }}
                      onClick={() => setCurrentStep(2)}
                    >
                      {lang.back}
                    </button>
                    <button 
                      style={styles.newConfirmButton}
                      onClick={handleBookingConfirm}
                    >
                      {lang.confirmBooking}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Responsive testimonial styles
  const testimonialStyles = useMemo(() => ({
    testimonialSection: {
      padding: isMobile ? "40px 10px" : "80px 20px",
      backgroundColor: "#fff",
      maxWidth: "1400px",
      margin: "0 auto"
    },
    testimonialHeader: {
      textAlign: "center",
      marginBottom: isMobile ? "30px" : "60px"
    },
    testimonialAvatars: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "-6px" : "-10px",
      marginBottom: isMobile ? "10px" : "20px"
    },
    headerAvatar: {
      width: isMobile ? "30px" : "40px",
      height: isMobile ? "30px" : "40px",
      borderRadius: "50%",
      border: "2px solid #fff",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      marginLeft: isMobile ? "-6px" : "-10px"
    },
    testimonialTitle: {
      fontSize: isMobile ? "20px" : "36px",
      fontWeight: "700",
      color: "#333",
      margin: "0"
    },
    testimonialCarousel: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "8px" : "20px"
    },
    testimonialSlider: {
      display: "flex",
      gap: isMobile ? "12px" : "30px",
      overflowX: isMobile ? "auto" : "hidden",
      scrollBehavior: "smooth",
      padding: isMobile ? "10px 0" : "20px 0",
      width: isMobile ? "90vw" : "100%",
      cursor: isMobile ? "grab" : "pointer",
      userSelect: "none"
    },
    testimonialCard: {
      flex: isMobile ? "0 0 85vw" : "0 0 400px",
      backgroundColor: "#fff",
      borderRadius: "15px",
      padding: isMobile ? "18px" : "30px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      minWidth: isMobile ? "85vw" : "400px",
      maxWidth: isMobile ? "85vw" : "400px"
    },
    testimonialContent: {
      marginBottom: isMobile ? "10px" : "20px"
    },
    testimonialCardTitle: {
      fontSize: isMobile ? "15px" : "20px",
      fontWeight: "600",
      color: "#333",
      marginBottom: isMobile ? "8px" : "15px"
    },
    testimonialDesc: {
      fontSize: isMobile ? "13px" : "16px",
      color: "#666",
      lineHeight: "1.5",
      margin: "0"
    },
    testimonialFooter: {
      display: isMobile ? "block" : "flex",
      justifyContent: isMobile ? undefined : "space-between",
      alignItems: isMobile ? undefined : "center",
      marginTop: isMobile ? "10px" : undefined
    },
    testimonialUser: {
      display: "flex",
      alignItems: "center",
      gap: isMobile ? "8px" : "12px",
      marginBottom: isMobile ? "8px" : 0
    },
    testimonialAvatar: {
      width: isMobile ? "32px" : "50px",
      height: isMobile ? "32px" : "50px",
      borderRadius: "50%",
      objectFit: "cover"
    },
    testimonialUserInfo: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "2px" : "4px"
    },
    testimonialUserName: {
      fontSize: isMobile ? "13px" : "16px",
      fontWeight: "600",
      color: "#333",
      margin: "0"
    },
    testimonialLocation: {
      fontSize: isMobile ? "11px" : "14px",
      color: "#666",
      margin: "0"
    },
    testimonialRating: {
      display: "flex",
      gap: isMobile ? "2px" : "4px"
    },
    starIcon: {
      fontSize: isMobile ? "13px" : "16px"
    },
    arrowButton: {
      width: isMobile ? "28px" : "40px",
      height: isMobile ? "28px" : "40px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      border: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease"
    }
  }), [isMobile]);

  return (
    <div style={styles.bodyStyle}>
      <TopBar
        isLoggedIn={isLoggedIn}
        userName={userName}
        onSignOut={handleSignOut}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        lang={lang}
      />

      {/* Hero Section */}
      <div style={{
        ...styles.heroContainer,
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? 'auto' : styles.heroContainer.height,
        minHeight: isMobile ? '420px' : undefined,
        paddingBottom: isMobile ? '80px' : styles.heroContainer.paddingBottom,
        paddingTop: isMobile ? '100px' : styles.heroContainer.paddingTop,
        marginTop: isMobile ? 0 : styles.heroContainer.marginTop,
      }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{ ...styles.videoBackground, objectFit: isMobile ? 'cover' : styles.videoBackground.objectFit }}
        >
          <source src="/images/car_vid.mp4" type="video/mp4" />
        </video>
        <div style={styles.heroOverlay} />
        <div style={{
          ...styles.heroContent,
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: isMobile ? 0 : styles.heroContent.marginTop,
          padding: isMobile ? '0 10px' : styles.heroContent.padding,
          width: isMobile ? '100%' : styles.heroContent.width,
          maxWidth: isMobile ? '100%' : styles.heroContent.maxWidth,
        }}>
          <div style={{
            ...styles.leftSide,
            alignItems: 'center',
            maxWidth: isMobile ? '100%' : styles.leftSide.maxWidth,
            gap: isMobile ? '4px' : styles.leftSide.gap,
          }}>
            <h1 
              style={{
                ...styles.heroTitle,
                ...animationStyles.heroReveal,
                ...(heroVisible ? animationStyles.heroRevealVisible : {}),
                transitionDelay: '0.5s',
                fontSize: isMobile ? '28px' : styles.heroTitle.fontSize,
                lineHeight: isMobile ? '1.15' : styles.heroTitle.lineHeight,
                marginBottom: isMobile ? '8px' : styles.heroTitle.marginBottom,
                padding: isMobile ? '0 0px' : undefined,
                textAlign: 'center',
                maxWidth: isMobile ? '95vw' : styles.heroTitle.maxWidth,
                wordBreak: 'break-word',
              }}
            >
              {lang.heroTitle}
            </h1>
            <ul style={{
              ...styles.featuresList,
              flexDirection: isMobile ? 'column' : 'row',
              fontSize: isMobile ? '15px' : styles.featuresList.fontSize,
              gap: isMobile ? '7px' : styles.featuresList.gap,
              textAlign: 'center',
              marginTop: isMobile ? '6px' : undefined,
            }}>
              {lang.features.map((feat, i) => (
                <li 
                  key={i} 
                  style={{
                    ...styles.featureItem,
                    ...animationStyles.heroReveal,
                    ...(heroVisible ? animationStyles.heroRevealVisible : {}),
                    transitionDelay: `${0.9 + i * 0.2}s`,
                    justifyContent: 'center',
                  }}
                >
                  <img src="/images/fait.png" alt="Check" style={{ ...styles.featureIcon, width: isMobile ? '15px' : styles.featureIcon.width, height: isMobile ? '15px' : styles.featureIcon.height }} />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search Form */}
        <div style={{
          ...styles.searchContainer,
          position: isMobile ? 'static' : styles.searchContainer.position,
          margin: isMobile ? '40px auto 0 auto' : undefined,
          width: isMobile ? '95%' : styles.searchContainer.width,
          left: isMobile ? undefined : styles.searchContainer.left,
          transform: isMobile ? undefined : styles.searchContainer.transform,
          bottom: isMobile ? undefined : "-220px",
        }}>
          <div style={styles.searchHeader}>
            Trouvez de Super offres pour Location de Voiture au Maroc
          </div>
          <div style={styles.searchContent}>
          <div style={styles.searchRow}>
              <div style={styles.searchField}>
              <label style={styles.searchLabel}>{lang.transmission}</label>
              <select
                style={styles.select}
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                  <option value="All">All</option>
                {uniqueTransmissions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
              <div style={styles.searchField}>
              <label style={styles.searchLabel}>{lang.fuelType}</label>
              <select
                style={styles.select}
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                  <option value="All">All</option>
                {fuelTypeOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
              <div style={styles.searchField}>
              <label style={styles.searchLabel}>{lang.seats}</label>
              <select
                style={styles.select}
                value={seatsNumber}
                onChange={(e) => setSeatsNumber(e.target.value)}
              >
                  <option value="All">All</option>
                {uniqueSeatsNumbers.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.searchRow}>
              <div style={styles.searchField}>
              <label style={styles.searchLabel}>{lang.location}</label>
              <select
                style={styles.select}
                value={locationValue}
                onChange={(e) => setLocation(e.target.value)}
              >
                  <option value="All">All</option>
                {uniqueLocations.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
              <div style={styles.dateRangeContainer}>
                <label style={styles.searchLabel}>{lang.pickUpDate} & {lang.returnDate}</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="date"
                    value={startDate ? startDate.format('YYYY-MM-DD') : ''}
                    onChange={e => setStartDate(e.target.value ? moment(e.target.value) : null)}
                    style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }}
                    min={moment().format('YYYY-MM-DD')}
                    placeholder={lang.startDate}
                  />
                  <input
                    type="date"
                    value={endDate ? endDate.format('YYYY-MM-DD') : ''}
                    onChange={e => setEndDate(e.target.value ? moment(e.target.value) : null)}
                    style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ddd', fontSize: 14 }}
                    min={startDate ? startDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')}
                    placeholder={lang.endDate}
                  />
                </div>
            </div>
              <div style={styles.priceRangeContainer}>
                <label style={styles.searchLabel}>{lang.priceRange}: {priceValue} MAD / jour</label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          <div style={styles.searchButtonContainer}>
            <button
              onClick={handleFindVehicle} 
              disabled={!isAnyInputFilled()}
              style={{
                ...styles.searchButton,
                backgroundColor: isAnyInputFilled() ? "#00A6E6" : "#666",
                cursor: isAnyInputFilled() ? "pointer" : "not-allowed",
                opacity: isAnyInputFilled() ? 1 : 0.7
              }}
              onMouseOver={(e) => {
                if (isAnyInputFilled()) {
                  e.currentTarget.style.backgroundColor = "#0095D2";
                }
              }}
              onMouseOut={(e) => {
                if (isAnyInputFilled()) {
                  e.currentTarget.style.backgroundColor = "#00A6E6";
                } else {
                  e.currentTarget.style.backgroundColor = "#666";
                }
              }}
            >
              Rechercher un véhicule
            </button>
          </div>
        </div>
      </div>

      {/* Most Searched Vehicles */}
      <section 
        ref={mostSearchedRef}
        style={{
          ...mostSearchedSectionStyle,
          ...(isMobile ? {} : animationStyles.fadeInUp),
          ...(isMobile ? {} : (mostSearchedVisible ? animationStyles.fadeInUpVisible : {})),
          background: isMobile ? '#f7f7f7' : '#fff',
          minHeight: isMobile ? '300px' : undefined,
          padding: isMobile ? '40px 0 20px 0' : mostSearchedSectionStyle.padding,
          marginTop: isMobile ? '8px' : mostSearchedSectionStyle.marginTop,
        }}
      >
        <h2 style={{
          ...styles.sectionTitle,
          fontSize: isMobile ? '30px' : '48px',
          color: '#222',
          marginTop: isMobile ? '15px' : styles.sectionTitle.marginTop,
        }}>
            {lang.mostSearchedTitle}
        </h2>
        <p style={{
          ...styles.sectionSubtitle,
          fontSize: isMobile ? '16px' : '28px',
          color: '#333',
          marginBottom: isMobile ? '24px' : styles.sectionSubtitle.marginBottom,
        }}>
          The world's leading car brands
        </p>
        <div
          style={
            isMobile
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  alignItems: 'center',
                  width: '100%',
                }
              : dynamicGridStyle
          }
        >
          {cars.length === 0 ? (
            <div style={{ color: '#888', fontSize: 18, margin: 40 }}>{lang.noCarsFound}</div>
          ) : (
            cars.slice(0, 6).map((car, index) => renderCarCard(car, index))
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section 
        ref={whyChooseUsRef}
        style={{
          ...styles.chooseUsContainer,
          ...animationStyles.fadeInLeft,
          ...(whyChooseUsVisible ? animationStyles.fadeInLeftVisible : {}),
          background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%)",
          padding: "100px 0",
          color: "#fff",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 30% 50%, rgba(37, 118, 252, 0.1) 0%, rgba(0, 0, 0, 0) 50%)",
          zIndex: 1
        }} />

        <div style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 40px"
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: "center",
            marginBottom: "60px"
          }}>
            <span style={{
              background: "linear-gradient(45deg, #2576F8 0%, #3FCBFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "3px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "20px"
            }}>
              {lang.whyChooseUs}
            </span>
            <h2 style={{
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(45deg, #fff 0%, #e0e0e0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "20px",
              lineHeight: "1.2"
            }}>
              {lang.excellenceInMoroccanCarRentalServices}
            </h2>
            <p style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              {lang.experienceTheFinestSelectionOfRentalCarsInMorocco}
            </p>
          </div>

          {/* Features Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "30px",
            marginBottom: "50px"
          }}>
            {[
              {
                icon: "💰",
                title: lang.competitivePricing,
                description: lang.competitivePricingDesc,
                gradient: "linear-gradient(135deg, #2576F8 0%, #3FCBFF 100%)"
              },
              {
                icon: "👑",
                title: lang.luxuryOptions,
                description: lang.luxuryOptionsDesc,
                gradient: "linear-gradient(135deg, #FF3366 0%, #FF6B6B 100%)"
              },
              {
                icon: "🛠️",
                title: lang.expertService,
                description: lang.expertServiceDesc,
                gradient: "linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)"
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "20px",
                  padding: "40px 30px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.07)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{
                  width: "70px",
                  height: "70px",
                  background: feature.gradient,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "25px",
                  fontSize: "30px",
                  transform: "rotate(-5deg)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "#fff"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginBottom: "20px"
                }}>
                  {feature.description}
                </p>
                <div style={{
                  width: "40px",
                  height: "2px",
                  background: feature.gradient,
                  marginTop: "auto"
                }} />
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: "30px",
            marginTop: "40px"
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "40px",
              display: "flex",
              alignItems: "center",
              gap: "30px"
            }}>
              <div style={{
                flex: 1
              }}>
                <h3 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  background: "linear-gradient(45deg, #2576F8 0%, #3FCBFF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  {lang.roadAssistance}
                </h3>
                <p style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.7)"
                }}>
                  {lang.roadAssistanceDesc}
                </p>
              </div>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #2576F8 0%, #3FCBFF 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px"
              }}>
                🚗
              </div>
            </div>

            <div style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "40px",
              display: "flex",
              alignItems: "center",
              gap: "30px"
            }}>
              <div style={{
                flex: 1
              }}>
                <h3 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  background: "linear-gradient(45deg, #FF3366 0%, #FF6B6B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  {lang.freePickUpDropOff}
                </h3>
                <p style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "rgba(255, 255, 255, 0.7)"
                }}>
                  {lang.freePickUpDropOffDesc}
                </p>
              </div>
              <div style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #FF3366 0%, #FF6B6B 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px"
              }}>
                🎯
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{
          ...styles.howItWorksContainer,
        position: "relative"
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          textAlign: "center"
        }}>
          <span style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#E31837",
            letterSpacing: "2px",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "15px"
          }}>
            {lang.howItWorks}
          </span>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "50px",
            color: "#333"
          }}>
            {lang.howItWorksTitle ? lang.howItWorksTitle : `${lang.step1Title} / ${lang.step2Title} / ${lang.step3Title}`}
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: "30px",
            padding: "20px"
          }}>
            {[
              {
                icon: <FaMapMarkerAlt style={{ fontSize: "32px", color: "#fff" }} />,
                title: lang.step1Title,
                description: lang.step1Description,
                gradient: "linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)"
              },
              {
                icon: <FaClipboardList style={{ fontSize: "32px", color: "#fff" }} />,
                title: lang.step2Title,
                description: lang.step2Description,
                gradient: "linear-gradient(135deg, #4ECDC4 0%, #556270 100%)"
              },
              {
                icon: <FaCar style={{ fontSize: "32px", color: "#fff" }} />,
                title: lang.step3Title,
                description: lang.step3Description,
                gradient: "linear-gradient(135deg, #6C63FF 0%, #3F3D56 100%)"
              },
              {
                icon: <FaKey style={{ fontSize: "32px", color: "#fff" }} />,
                title: lang.step4Title || "Begin Your Journey",
                description: lang.step4Description || "Start your adventure with confidence and ease",
                gradient: "linear-gradient(135deg, #E31837 0%, #FF6B6B 100%)"
              }
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "40px 30px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
                }}
              >
                {/* Step Number */}
                <div style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#fff",
                  background: step.gradient,
                  padding: "4px 12px",
                  borderRadius: "12px"
                }}>
                  {lang.step} {index + 1}
                </div>

                {/* Icon Container */}
                <div style={{
                  width: "90px",
                  height: "90px",
                  background: step.gradient,
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "25px",
                  transform: "rotate(-5deg)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                }}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: "22px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "#333"
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#666",
                  marginBottom: "20px"
                }}>
                  {step.description}
                </p>

                {/* Decorative Line */}
                <div style={{
                  width: "40px",
                  height: "3px",
                  background: step.gradient,
                  marginTop: "auto"
                }} />

                {/* Connection Line (except for last item) */}
                {!isMobile && index < 3 && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    right: "-45px",
                    width: "60px",
                    height: "2px",
                    background: "linear-gradient(90deg, #e0e0e0 0%, #f5f5f5 100%)",
                    zIndex: 1
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        style={{
          ...styles.videoStatsSection,
          ...animationStyles.scaleIn,
          ...(statsVisible ? animationStyles.scaleInVisible : {}),
          transform: statsVisible ? 'translateY(0)' : 'translateY(100px)',
          opacity: statsVisible ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          padding: isMobile ? '30px 0 10px 0' : styles.videoStatsSection.padding,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            ...styles.videoBackground,
            transform: statsVisible ? 'scale(1)' : 'scale(1.1)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <source src="/images/inside_car.mp4" type="video/mp4" />
        </video>
        <div style={{
          ...styles.videoSection,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}>
          <div style={{
            margin: '40px 0 30px 0',
            textAlign: 'center',
            zIndex: 3,
          }}>
            <h2 style={{ color: '#fff', fontSize: isMobile ? '22px' : '32px', fontWeight: 800, marginBottom: 20, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {lang.yourDreamCarAwaits}
            </h2>
            <p style={{ color: '#fff', fontSize: isMobile ? '13px' : '18px', marginBottom: 30, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {lang.experienceLuxuryAndComfortWithOurPremiumFleetOfVehicles}
            </p>
            <button style={{
              background: '#E31837',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '16px 32px',
              fontSize: isMobile ? '13px' : '16px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              margin: '0 auto',
              display: 'block',
              transition: 'all 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#B71C1C'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#E31837'; }}
              onClick={() => window.location.href = '/available-cars'}
            >
              {lang.exploreOurFleet}
            </button>
          </div>
          <div style={{
            ...styles.statsContainer,
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '15px',
            padding: isMobile ? '20px 0' : '40px 60px',
            marginTop: 30,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: isMobile ? '16px' : '30px',
            maxWidth: '1000px',
            width: '100%',
            zIndex: 3,
          }}>
            {[
              { end: 50, suffix: '+', label: lang.vehiclesInStock || 'Vehicles in Stock' },
              { end: 25, suffix: '+', label: lang.yearsOfExcellence || 'Years of Excellence' },
              { end: 3990, suffix: '+', label: lang.happyClients || 'Happy Clients' },
              { end: 150, suffix: '+', label: lang.expertReviews || 'Expert Reviews' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', color: '#fff' }}>
                <h3 style={{ fontSize: isMobile ? '22px' : '36px', fontWeight: 800, marginBottom: 10, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  <Counter end={stat.end} isVisible={statsVisible} />{stat.suffix}
                </h3>
                <p style={{ fontSize: isMobile ? '12px' : '16px', fontWeight: 500, color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        style={testimonialStyles.testimonialSection}
      >
        <div style={testimonialStyles.testimonialHeader}>
          <div style={testimonialStyles.testimonialAvatars}>
            <img src="/images/user1.png" alt="Client" style={testimonialStyles.headerAvatar} />
            <img src="/images/user2.png" alt="Client" style={testimonialStyles.headerAvatar} />
            <img src="/images/user3.png" alt="Client" style={testimonialStyles.headerAvatar} />
          </div>
          <h2 style={testimonialStyles.testimonialTitle}>{lang.testimonialTitle || lang.whatTheySayAboutUs || 'What they say about us?'}</h2>
        </div>
        <div style={testimonialStyles.testimonialCarousel}>
          <button 
            onClick={() => testimonialRef.current.scrollBy({ left: -300, behavior: "smooth" })}
            style={testimonialStyles.arrowButton}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft style={{ color: "#333", fontSize: "20px" }} />
          </button>
          <div 
            style={testimonialStyles.testimonialSlider} 
            ref={testimonialRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {testimonialsWithStars.map((testimonial, index) => (
              <div key={index} style={testimonialStyles.testimonialCard}>
                <div style={testimonialStyles.testimonialContent}>
                  <h3 style={testimonialStyles.testimonialCardTitle}>{testimonial.title}</h3>
                  <p style={testimonialStyles.testimonialDesc}>{testimonial.text}</p>
                </div>
                <div style={testimonialStyles.testimonialFooter}>
                  <div style={testimonialStyles.testimonialUser}>
                    <img src={testimonial.avatar} alt={testimonial.user} style={testimonialStyles.testimonialAvatar} />
                    <div style={testimonialStyles.testimonialUserInfo}>
                      <h4 style={testimonialStyles.testimonialUserName}>{testimonial.user}</h4>
                      <p style={testimonialStyles.testimonialLocation}>Jakatar</p>
                    </div>
                  </div>
                  <div style={testimonialStyles.testimonialRating}>
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        style={{
                          ...testimonialStyles.starIcon,
                          color: i < testimonial.stars ? "#FFD700" : "#ddd"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => testimonialRef.current.scrollBy({ left: 300, behavior: "smooth" })}
            style={testimonialStyles.arrowButton}
            aria-label="Next testimonial"
          >
            <FaChevronRight style={{ color: "#333", fontSize: "20px" }} />
          </button>
        </div>
      </section>

      {/* Up Image 
      <div style={styles.upImageContainer}>
        <img src="/images/up.png" alt="Up arrow" style={styles.upImage} />
      </div>*/}

      {/* Stats 
      <section style={styles.statsSection}>
        <h2 style={styles.statsTitle}>{lang.statsTitle}</h2>
        <div style={statsContainerStyle}>
          {statsData.map((item, i) => (
            <div key={i} style={styles.statBox}>
              <h3 style={styles.statNumber}>
                <Counter end={item.end} />+
              </h3>
              <p style={styles.statLabel}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>*/}

      {/* Footer */}
      <footer style={{
        ...styles.footer,
        padding: isMobile ? '40px 10px 10px' : styles.footer.padding,
      }}>
        <div style={{
          ...styles.newFooterContainer,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '24px' : styles.newFooterContainer.gap,
          maxWidth: isMobile ? '100%' : styles.newFooterContainer.maxWidth,
          margin: isMobile ? '0' : styles.newFooterContainer.margin,
        }}>
          <div style={{ ...styles.footerColumn, gap: isMobile ? '10px' : styles.footerColumn.gap }}>
            <h3 style={{ ...styles.footerTitle, fontSize: isMobile ? '16px' : styles.footerTitle.fontSize, paddingBottom: isMobile ? '4px' : styles.footerTitle.paddingBottom }}>
              {lang.aboutUs}
            </h3>
            <p style={{ ...styles.footerDescription, fontSize: isMobile ? '12px' : styles.footerDescription.fontSize }}>
              Diabcar is your trusted partner in car rental services across Morocco. We offer a wide range of vehicles with competitive prices and exceptional service.
            </p>
            <div style={styles.socialLinks}>
              <a href="https://www.instagram.com/diab.c.a.r/" target="_blank" rel="noreferrer" style={styles.socialLink}>
                <FaInstagram size={18} />
              </a>
              <a href="https://web.facebook.com/people/Diab-car/100063808380188/" target="_blank" rel="noreferrer" style={styles.socialLink}>
                <FaFacebook size={18} />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=Diabcar@gmail.com" target="_blank" rel="noreferrer" style={styles.socialLink}>
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          <div style={{ ...styles.footerColumn, gap: isMobile ? '10px' : styles.footerColumn.gap }}>
            <h3 style={{ ...styles.footerTitle, fontSize: isMobile ? '16px' : styles.footerTitle.fontSize, paddingBottom: isMobile ? '4px' : styles.footerTitle.paddingBottom }}>
              {lang.quickLinks}
            </h3>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <Link to="/" style={{ ...styles.footerLink, fontSize: isMobile ? '12px' : styles.footerLink.fontSize }}>{lang.home}</Link>
              </li>
              <li style={styles.footerListItem}>
                <Link to="/available-cars" style={{ ...styles.footerLink, fontSize: isMobile ? '12px' : styles.footerLink.fontSize }}>{lang.availableCars}</Link>
              </li>
              <li style={styles.footerListItem}>
                <Link to="/contact-us" style={{ ...styles.footerLink, fontSize: isMobile ? '12px' : styles.footerLink.fontSize }}>{lang.contactUs}</Link>
              </li>
              <li style={styles.footerListItem}>
                <Link to="/about-us" style={{ ...styles.footerLink, fontSize: isMobile ? '12px' : styles.footerLink.fontSize }}>{lang.aboutUs}</Link>
              </li>
            </ul>
          </div>

          <div style={{ ...styles.footerColumn, gap: isMobile ? '10px' : styles.footerColumn.gap }}>
            <h3 style={{ ...styles.footerTitle, fontSize: isMobile ? '16px' : styles.footerTitle.fontSize, paddingBottom: isMobile ? '4px' : styles.footerTitle.paddingBottom }}>
              {lang.contactInfo}
            </h3>
            <ul style={styles.footerList}>
              <li style={styles.footerListItem}>
                <span style={{ ...styles.contactInfo, fontSize: isMobile ? '12px' : styles.contactInfo.fontSize }}>365, Boulevard Zerbout</span>
                <span style={{ ...styles.contactInfo, fontSize: isMobile ? '12px' : styles.contactInfo.fontSize }}>Casablanca, Morocco</span>
              </li>
              <li style={styles.footerListItem}>
                <span style={{ ...styles.contactInfo, fontSize: isMobile ? '12px' : styles.contactInfo.fontSize }}>Phone: +212 659-775582</span>
                <span style={{ ...styles.contactInfo, fontSize: isMobile ? '12px' : styles.contactInfo.fontSize }}>Email: Diabcar@gmail.com</span>
              </li>
            </ul>
            <div style={{ ...styles.mapWrapper, marginTop: isMobile ? '4px' : styles.mapWrapper.marginTop }}>
              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.9980075513337!2d-7.643954084800436!3d33.59400188082776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7b0e18d23b05f%3A0xc83a0f7ec5a3edc6!2s365%20Boulevard%20Zerktouni%2C%20Casablanca%2C%20Morocco!5e0!3m2!1sen!2sma!4v1678731361201!5m2!1sen!2sma"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div style={{ ...styles.footerColumn, gap: isMobile ? '10px' : styles.footerColumn.gap }}>
            <h3 style={{ ...styles.footerTitle, fontSize: isMobile ? '16px' : styles.footerTitle.fontSize, paddingBottom: isMobile ? '4px' : styles.footerTitle.paddingBottom }}>
              {lang.newsletter}
            </h3>
            <p style={{ ...styles.newsletterText, fontSize: isMobile ? '12px' : styles.newsletterText.fontSize }}>{lang.subscribeToOurNewsletterForUpdatesAndExclusiveOffers}</p>
            <div style={{ ...styles.newsletterForm, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '6px' : styles.newsletterForm.gap }}>
              <input type="email" placeholder={lang.enterYourEmail} style={{ ...styles.newsletterInput, fontSize: isMobile ? '12px' : styles.newsletterInput.fontSize }} />
              <button style={{ ...styles.newsletterButton, fontSize: isMobile ? '12px' : styles.newsletterButton.fontSize }}>{lang.subscribe}</button>
            </div>
          </div>
        </div>
        <div style={{
          ...styles.footerBottom,
          paddingTop: isMobile ? '16px' : styles.footerBottom.paddingTop,
          marginTop: isMobile ? '16px' : styles.footerBottom.marginTop,
        }}>
          <p style={{ ...styles.footerCopyright, fontSize: isMobile ? '11px' : styles.footerCopyright.fontSize }}>©2024 Diabcar. All rights reserved</p>
        </div>
      </footer>

      <WhatsAppButton phoneNumber="+212632835968" message="Hello, I'm interested in renting a car." />
      <ScrollToTopButton />

      {/* Booking Popup */}
      {bookingModalOpen && renderBookingModal()}
    </div>
  );
};

const styles = {
  bodyStyle: {
    margin: 0,
    padding: 0,
    overflowX: "hidden",
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  /* TopBar */
  topBarHeader: {
    width: "100%",
    position: "fixed",
    top: 0,
    zIndex: 1000,
    padding: "0",
    boxSizing: "border-box"
  },
  topBarContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px"
  },
  topBarLogo: {
    display: "flex",
    alignItems: "center"
  },
  logoImage: {
    height: "80px",
    objectFit: "contain"
  },
  topBarNav: {
    display: "flex",
    gap: "20px"
  },
  topBarNavLink: {
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    fontFamily: "'Poppins', Arial, sans-serif",
    letterSpacing: "1px",
    margin: "10px"
  },
  'topBarNavLink:hover': {
    color: "#722637"
  },
  topBarControls: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  languageContainer: {
    position: "relative"
  },
  languageDropdown: {
    position: "absolute",
    top: "110%",
    right: 0,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 4,
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    zIndex: 10
  },
  languageItem: {
    padding: "6px 12px",
    cursor: "pointer"
  },
  profileContainer: {
    position: "relative"
  },
  profileButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333"
  },
  profileArrow: {
    fontSize: "20px"
  },
  profileMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    width: "180px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: 8,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    padding: 10,
    zIndex: 99,
    display: "flex",
    flexDirection: "column"
  },
  menuSectionTitle: {
    fontWeight: "bold",
    margin: "10px 0 5px",
    fontSize: "14px",
    color: "#722637"
  },
  menuItem: {
    color: "#333",
    textDecoration: "none",
    fontSize: "14px",
    padding: "4px 0",
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  signOutButton: {
    marginTop: "10px",
    padding: 8,
    fontSize: "14px",
    color: "#fff",
    backgroundColor: "#8B0000",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },

  /* Hero */
  heroContainer: {
    width: "100%",
    height: "100vh",
    position: "relative",
    display: "flex",
    alignItems: "center", // This centers the content vertically
    justifyContent: "center",
    paddingBottom: "350px", // Adjusted padding
    paddingTop: 0,
    marginTop: 0,
    overflow: "visible"
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 0
  },
  heroContent: {
    width: "90%",
    maxWidth: "1500px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    textAlign: "center",
    marginTop: "300px" // This moves the hero content back to its original position
  },
  leftSide: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "1500px",
    margin: "0 auto",
    alignItems: "center"
  },
  heroSubtitle: {
    fontSize: "24px",
    fontWeight: "500",
    color: "#722637",
    margin: 0,
    marginBottom: "10px",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.17)",
    fontFamily: "'Poppins', Arial, sans-serif",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "2px 10px",
    borderRadius: "5px",
    display: "inline-block",
    width: "fit-content"
  },
  heroTitle: {
    fontSize: "78px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    lineHeight: "1.3",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.17)",
    fontFamily: "'Poppins', Arial, sans-serif",
    textTransform:"Uppercase",
  },
  featuresList: {
    margin: 0,
    padding: 0,
    listStyle: "none",
    color: "#fff",
    fontSize: "24px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "40px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
    fontFamily: "'Poppins', Arial, sans-serif",
    textTransform:"Uppercase",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  featureIcon: {
    width: "24px",
    height: "24px",
    objectFit: "contain"
  },
  arrowIcon: {
    marginRight: "8px"
  },
  rightSide: {
    display: "flex",
    alignItems: "center"
  },
  heroButton: {
    backgroundColor: "#fff",
    color: "#000",
    padding: "12px 24px",
    fontSize: "18px",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: "500",
    boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    marginTop: "35px",
    marginBottom: "35px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    textTransform: "uppercase"
  },
  carImageBelow: {
    width: "25px",
    height: "auto",
    marginTop: "-1px",
    marginLeft: "12px",
    verticalAlign: "middle"
  },
  searchContainer: {
    width: "95%",
    maxWidth: "1200px",
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    overflow: "hidden",
  },
  searchHeader: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: "15px 20px",
    fontSize: "18px",
    fontWeight: "500",
    width: "100%"
  },
  searchContent: {
    padding: "20px",
    backgroundColor: "#f5f5f5"
  },
  searchRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  searchField: {
    flex: "1",
    minWidth: "180px",
    margin: 0,
    padding: '0 0 0 0',
  },
  searchLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#333",
    fontWeight: "500"
  },
  select: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "14px"
  },
  dateRangeContainer: {
    flex: "1",
    minWidth: "220px",
    margin: 0,
    padding: 0,
  },
  priceRangeContainer: {
    flex: "0.8",
    minWidth: "180px",
    margin: 0,
    padding: 0,
    marginTop: "16px",
  },
  searchButtonContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#fff"
  },
  searchButton: {
    backgroundColor: "#666",
    color: "#fff",
    padding: "12px 30px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    textTransform: "uppercase",
    fontWeight: "500"
  },
  testimonialTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "40px",
    color: "#333",
    fontFamily: "'Poppins', Arial, sans-serif"
  },

  /* Most Searched */
  mostSearchedSection: {
    marginTop: "200px",  // Increased top margin
    marginBottom: "60px",
    maxWidth: "1370px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "100px 20px 0 20px",
  },
  sectionTitle: {
    fontSize: "48px",
    fontWeight: "600",
    textAlign: "center",  // Changed from "left" to "center"
    marginBottom: "0px",
    fontFamily: "'Poppins', Arial, sans-serif",
    position: "relative",
    paddingLeft: "20px",
    marginTop: "150px"
  },
  sectionSubtitle: {
    fontSize: "28px",
    color: "#666",
    textAlign: "center",  // Changed from "left" to "center"
    marginTop: "0",
    marginBottom: "50px",
    paddingLeft: "20px",
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  underlinedSpan: {
    position: "relative",
    display: "inline-block",
    paddingBottom: "8px",

  },
  underline: {
    content: '""',
    position: "absolute",
    left: "20%",
    bottom: "0",
    width: "60%",
    height: "5px",
    backgroundColor: "brown",
    borderRadius: "15px",

  },
  card: {
    backgroundColor: "transparent",
    overflow: "visible",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "380px",
    position: "relative",
    borderRadius: "15px",
    boxShadow: "none",
    margin: "0 auto"
  },

  cardImageContainer: {
    width: "100%",
    height: "280px",
    borderRadius: "15px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9"
  },
  cardImage: {
    width: "100%",
    height: "280px",
    objectFit: "contain",
    borderRadius: "15px",
    border: "1px solidrgb(253, 247, 247)"
  },
  noImage: {
    width: "100%",
    height: "280px",
    border: "2px dashed #ccc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ccc",
    borderRadius: "15px"
  },
  ratingBadge: {
    position: "absolute",
    top: "240px",
    right: "20px",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#fff",
    color: "#333",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.16)",
    padding: "6px 12px",
    zIndex: 9,
    minWidth: "120px",
    justifyContent: "center"
  },
  cardInfo: {
    backgroundColor: "#722637",
    color: "#fff",
    padding: "15px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    borderRadius: "15px",
    position: "relative",
    marginTop: "-40px",
    zIndex: 5,
    paddingBottom: "70px"
  },
  carTitle: {
    margin: "20px 0 8px 0",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "left",
    fontFamily: "'Poppins', Arial, sans-serif",
    color: "#333",
    lineHeight: "1",
    paddingLeft: "15px"
  },
  locationContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "6px",
    marginBottom: "12px",
    padding: "0 15px",
    marginTop: "5px"
  },
  locationIcon: {
    width: 14,
    height: 14,
    objectFit: "contain"
  },
  locationText: {
    fontSize: "18px",
    color: "#666",
    margin: 0,
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    margin: "4px 0"
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "18px",
    padding:"10px"
  },
  icon: {
    fontSize: "18px",
    marginRight:"8px"
  },
  cardFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginTop: "30px"
  },
  carPrice: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: 0
  },
  bookNowButton: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    textAlign: "center"
  },
  loadMoreContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px"
  },
  loadMoreButton: {
    backgroundColor: "#B7F1B9",
    color: "#fff",
    padding: "12px 40px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "10px",
    textDecoration: "none"
  },
  downImageFullWidth: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    display: "block"
  },
  /* Testimonials */
  testimonialSection: {
    padding: "80px 20px",
    backgroundColor: "#fff",
    maxWidth: "1400px",
    margin: "0 auto"
  },
  testimonialHeader: {
    textAlign: "center",
    marginBottom: "60px"
  },
  testimonialAvatars: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "-10px",
    marginBottom: "20px"
  },
  headerAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "2px solid #fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginLeft: "-10px"
  },
  testimonialTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#333",
    margin: "0"
  },
  testimonialCarousel: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  testimonialSlider: {
    display: "flex",
    gap: "30px",
    overflow: "hidden",
    scrollBehavior: "smooth",
    padding: "20px 0",
    width: "100%",
    cursor: "grab",
    userSelect: "none",
    "&:active": {
      cursor: "grabbing"
    }
  },
  testimonialCard: {
    flex: "0 0 400px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  testimonialContent: {
    marginBottom: "20px"
  },
  testimonialCardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px"
  },
  testimonialDesc: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    margin: "0"
  },
  testimonialFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  testimonialUser: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  testimonialAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover"
  },
  testimonialUserInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px"
  },
  testimonialUserName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    margin: "0"
  },
  testimonialLocation: {
    fontSize: "14px",
    color: "#666",
    margin: "0"
  },
  testimonialRating: {
    display: "flex",
    gap: "4px"
  },
  starIcon: {
    fontSize: "16px"
  },
  arrowButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    border: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
    }
  },

  /* NEW SECTION (Why Choose Us) */
  chooseUsContainer: {
    width: "100%",
    padding: "80px 20px",
    backgroundColor: "#f8f9fa",
    marginTop: "150px"
  },
  chooseUsWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "60px",
    alignItems: "stretch",
    minHeight: "500px"
  },
  chooseUsImageSection: {
    flex: "1",
    position: "relative",
    borderRadius: "10px",
    overflow: "hidden",
    maxWidth: "50%"
  },
  chooseUsImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px"
  },
  chooseUsContent: {
    flex: "1",
    maxWidth: "50%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  chooseUsTag: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#fff",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "20px",
    width: "fit-content",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  },
  chooseUsTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#333",
    lineHeight: "1.2"
  },
  chooseUsDescription: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px",
    lineHeight: "1.6"
  },
  chooseUsPoints: {
    display: "flex",
    gap: "30px",
    marginTop: "auto"
  },
  chooseUsColumn: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  chooseUsItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "16px",
    color: "#333"
  },
  checkIcon: {
    width: "24px",
    height: "24px",
    backgroundColor: "#4CAF50",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    flexShrink: 0
  },

  /* Up Image */
  upImageContainer: {
    width: "100vw",
    overflow: "hidden"
  },
  upImage: {
    width: "100vw",
    height: "auto",
    objectFit: "cover"
  },
  /* Stats */
  statsSection: {
    backgroundColor: "#fff",
    padding: "40px 20px",
    color: "#000",
    textAlign: "center"
  },
  statsTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    background: "linear-gradient(90deg, #000 0%, #444 100%)",
    color: "#fff",
    display: "inline-block",
    padding: "10px 20px",
    borderRadius: "8px",
    fontFamily: "'Poppins', Arial, sans-serif"
  },
  statsContainer: {
    display: "grid",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  statBox: {
    backgroundColor: "#722637ED",
    color: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  statLabel: {
    fontSize: "16px",
    textAlign: "center"
  },
  /* Footer */
  footer: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "80px 20px 20px",
    textAlign: "left"

  },
  newFooterContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  footerColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  footerTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#fff",
    marginBottom: "10px",
    position: "relative",
    paddingBottom: "10px"
  },
  footerTitle: {
    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "40px",
      height: "2px",
      backgroundColor: "#E31837"
    }
  },
  footerDescription: {
    fontSize: "14px",
    color: "#999",
    lineHeight: "1.6",
    margin: 0
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
    marginTop: "10px"
  },
  socialLink: {
    color: "#fff",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#E31837"
    }
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  footerListItem: {
    marginBottom: "12px"
  },
  footerLink: {
    color: "#999",
    textDecoration: "none",
    fontSize: "14px",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#E31837"
    }
  },
  contactInfo: {
    display: "block",
    color: "#999",
    fontSize: "14px",
    marginBottom: "5px"
  },
  mapWrapper: {
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px"
  },
  newsletterText: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "15px"
  },
  newsletterForm: {
    display: "flex",
    gap: "10px"
  },
  newsletterInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #333",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "14px",
    "&::placeholder": {
      color: "#666"
    }
  },
  newsletterButton: {
    padding: "10px 20px",
    backgroundColor: "#E31837",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.3s ease",
    "&:hover": {
      backgroundColor: "#B71C1C"
    }
  },
  footerBottom: {
    textAlign: "center",
    paddingTop: "30px",
    marginTop: "40px",
    borderTop: "1px solid #333"
  },
  footerCopyright: {
    color: "#999",
    fontSize: "14px",
    margin: 0
  },
  /* WhatsApp Icon */
  whatsappIcon: {
    position: "fixed",
    right: "20px",
    bottom: "30px",
    width: "60px",
    height: "60px",
    backgroundColor: "#25D366",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
  },
  /* Scroll to Top Button */
  scrollTopButton: {
    position: "fixed",
    right: "20px",
    bottom: "100px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 9999,
    boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
    transition: "opacity 0.3s ease, background 0.3s ease"
  },
  scrollTopInner: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    backgroundColor: "#fff"
  },
  /* Range Slider specifics */
  rangeStyle: {
    position: "absolute",
    width: "100%",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    background: "transparent",
    pointerEvents: "auto",
    zIndex: 20,
    height: "30px",
    outline: "none",
    cursor: "pointer"

  },
  thumbStyle: {
    position: "absolute",
    width: "28px",
    height: "28px",
    backgroundColor: "#fff",
    border: "3px solid #722637",
    borderRadius: "50%",
    pointerEvents: "none",
    zIndex: 10,
    top: "50%",
    transform: "translateY(-50%)",
    boxShadow: "0 3px 6px rgba(0,0,0,0.4)"
  },

  /* How It Works Section */
  howItWorksContainer: {
    width: "100%",
    marginTop: "100px",
    padding: "80px 20px",
    backgroundColor: "#fff"
  },
  howItWorksWrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center"
  },
  howItWorksTag: {
    display: "inline-block",
    fontSize: "18px",
    fontWeight: "600",
    color: "#666",
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  howItWorksTitle: {
    fontSize: "38px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "60px",
    lineHeight: "1.3"
  },
  stepsContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "30px",
    flexWrap: "wrap"
  },
  stepItem: {
    flex: "1",
    minWidth: "250px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  stepIcon: {
    width: "64px",
    height: "64px",
    backgroundColor: "#f8f9fa",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px"
  },
  icon: {
    fontSize: "28px",
    color: "#333"
  },
  stepTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px"
  },
  stepDescription: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    maxWidth: "250px",
    margin: "0 auto"
  },
  videoStatsSection: {
    width: "100%",
    height: "100vh",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
    backgroundImage: "none", // Remove background image
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.6)"
    }
  },
  videoSection: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -1
  },
  videoContent: {
    textAlign: "center",
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px"
  },
  videoTitle: {
    color: "#fff",
    fontSize: "42px",
    fontWeight: "500",
    lineHeight: "0.4",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.49)",
    margin: 0
  },
  videoSubTitle: {
    color: "#fff",
    fontSize: "32px",
    fontWeight: "400",
    lineHeight: "1.4",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    margin: 0
  },
  viewAllCarsButton: {
    backgroundColor: "#E31837",
    color: "#fff",
    padding: "16px 32px",
    fontSize: "18px",
    fontWeight: "600",
    borderRadius: "8px",
    textDecoration: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    border: "2px solid #E31837",
    
  },
  statsStripContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "0 20px",
    marginTop: "0px",
    position: "relative",
    zIndex: 10
  },
  statsStrip: {
    backgroundColor: "#E31837",
    padding: "40px 60px",
    borderRadius: "15px",
    maxWidth: "1000px",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
  },
  statsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
    flexWrap: "wrap"
  },
  statItem: {
    flex: "1",
    minWidth: "180px",
    textAlign: "center",
    color: "#fff"
  },
  statValue: {
    fontSize: "42px",
    fontWeight: "500",
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    color: "#fff"
  },
  statText: {
    fontSize: "18px",
    fontWeight: "500",
    margin: 0,
    opacity: 0.9,
    color: "#fff",
    textTransform: "capitalize"
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    width: '80%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: '#F5F5F5',
    border: 'none',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.2s ease'
  },
  closeIconImage: {
    width: '16px',
    height: '16px',
    objectFit: 'contain',
    transition: 'all 0.2s ease'
  },
  newBookingContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  newImageColumn: {
    width: '40%',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  newCarImage: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    maxHeight: '300px'
  },
  newDetailsColumn: {
    width: '60%',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  newPriceContainer: {
    position: 'absolute',
    bottom: '30px',
    left: '30px'
  },
  newPriceText: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#333'
  },
  newCarHeader: {
    marginBottom: '25px'
  },
  newCarTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    color: '#333'
  },
  newLocationRow: {
    display: 'flex',
    alignItems: 'center',
    color: '#666'
  },
  newLocationIcon: {
    marginRight: '8px',
    fontSize: '16px'
  },
  newSpecsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '25px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px'
  },
  newSpecItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '15px',
    color: '#333'
  },
  newSpecIcon: {
    color: '#444',
    fontSize: '18px',
    marginRight: '12px'
  },
  newDateContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px'
  },
  newDatePickerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '12px 15px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  newDateArrow: {
    margin: '0 10px',
    fontSize: '16px',
    color: '#666'
  },
  newConfirmButton: {
    backgroundColor: '#222',
    backgroundImage: 'linear-gradient(to right, #000, #333)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  newConfirmButtonDisabled: {
    backgroundImage: 'none',
    backgroundColor: '#999',
    cursor: 'not-allowed',
    boxShadow: 'none',
    transform: 'none',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressBarOuter: {
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', 
    margin: '32px 0 16px 0', 
    gap: 0,
    position: 'relative'
  },
  progressStepColumn: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    minWidth: 120, 
    position: 'relative',
    zIndex: 2
  },
  progressBarLine: {
    height: 4, 
    width: 40, 
    background: '#eee', 
    margin: '0 2px', 
    borderRadius: 2, 
    transition: 'all 0.5s ease', 
    zIndex: 1,
    marginTop: '-25px',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarLineCompleted: {
    background: '#222',
  },
  progressStep: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: '#eee',
    border: '2px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    transition: 'all 0.5s ease',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  progressStepActive: {
    backgroundColor: '#222',
    borderColor: '#222',
    color: '#fff',
  },
  progressStepCompleted: {
    backgroundColor: '#222',
    borderColor: '#222',
    color: '#fff',
  },
  progressLabel: {
    marginTop: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  progressLabelActive: {
    color: '#222',
    fontWeight: '600',
    transform: 'scale(1.05)'
  },
  stepsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'all 0.3s ease'
  },
  activeStep: {
    backgroundColor: '#f5f5f5'
  },
  stepNumber: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: '#333',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5px',
    fontWeight: 'bold'
  },
  stepLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  stepDivider: {
    width: '50px',
    height: '2px',
    backgroundColor: '#ddd',
    margin: '0 10px'
  },
  tenantInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px 0'
  },
  tenantInfoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0'
  },
  inputGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px'
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  inputLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#666'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    color: '#333',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#333',
      outline: 'none'
    }
  },
  secondDriverSection: {
    marginTop: '20px'
  },
  secondDriverHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  toggleButton: {
    background: '#eee',
    border: 'none',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#333',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#ddd'
    }
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '30px'
  },
  backButton: {
    flex: '1',
    padding: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    color: '#333',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  }
};

export default Home;



