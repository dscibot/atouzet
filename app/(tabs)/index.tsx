import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  CheckBox,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emailjs from '@emailjs/browser';
import { useFonts } from 'expo-font';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useFocusEffect } from 'expo-router'; // Ajout de useFocusEffect

// Composant d'écran de chargement
const LoadingScreen = () => {
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '...') return '....';
        if (prevDots === '....') return '.....';
        return '...';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Chargement{dots}</Text>
    </View>
  );
};

// CookiePopup Component
const CookiePopup = ({ visible, onAccept, onDecline, onNavigate, onClose }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;

  const handlePrivacyPolicyPress = () => {
    console.log('Navigating to PrivacyPolicy from CookiePopup');
    onClose(); // Ferme le popup avant de naviguer
    onNavigate.push('/privacy-policy'); // Redirection vers PrivacyPolicyScreen
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => { }}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.cookiePopup, isSmallScreen && styles.cookiePopupMobile]}>
          <Text style={styles.cookieHeader}>Nous utilisons des cookies</Text>
          <Text style={styles.cookieText}>
            Ce site utilise des cookies pour améliorer votre expérience. En continuant à naviguer, vous acceptez notre utilisation des cookies.{' '}
            <Text style={styles.cookieLink} onPress={handlePrivacyPolicyPress}>
              En savoir plus
            </Text>
          </Text>
          <View style={styles.cookieButtonContainer}>
            <TouchableOpacity
              style={[styles.cookieButton, styles.acceptButton]}
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Text style={styles.cookieButtonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cookieButton, styles.declineButton]}
              onPress={onDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.cookieButtonText}>Refuser</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Navbar Component
const Navbar = ({ onNavigate, activeSection }) => (
  <View style={styles.navbar}>
    <TouchableOpacity
      style={[styles.navItem, activeSection === 'accueil' && styles.navItemActive]}
      onPress={() => onNavigate('accueil')}
      activeOpacity={0.7}
    >
      <Feather name="home" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === 'services' && styles.navItemActive]}
      onPress={() => onNavigate('services')}
      activeOpacity={0.7}
    >
      <Text style={[styles.navText, activeSection === 'services' && styles.navTextActive]}>Mes services</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === 'tarifs' && styles.navItemActive]}
      onPress={() => onNavigate('tarifs')}
      activeOpacity={0.7}
    >
      <Text style={[styles.navText, activeSection === 'tarifs' && styles.navTextActive]}>Les tarifs</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === 'contact' && styles.navItemActive]}
      onPress={() => onNavigate('contact')}
      activeOpacity={0.7}
    >
      <Entypo name="email" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

// Static data
const services = [
  {
    title: 'FACTURES',
    description:
      'Gagnez du temps et assurez une gestion fluide de votre facturation ! En tant qu’assistante administrative indépendante, je vous accompagne dans la rédaction et le suivi de vos devis et factures pour vous permettre de vous concentrer sur votre cœur de métier.\n✅ Émission de vos devis et factures: Création et mise en page professionnelle selon vos exigences.\n✅ Suivi des paiements: Relances des clients en cas de retard pour optimiser votre trésorerie.',
    color: '#c8a1cf',
    icon: 'file-invoice-dollar',
  },
  {
    title: 'TRANSCRIPTION',
    description:
      'Gagnez du temps et assurez des documents clairs et professionnels ! Je transforme vos dictées en textes parfaitement rédigés et mis en forme, prêts à être utilisés.\n✅ Transcription fidèle et précise : Retranscription de vos dictées audio avec orthographe et syntaxe soignées.\n✅ Mise en page professionnelle : Adaptation selon vos besoins (courriers, rapports, actes, conclusions…).\n✅ Gain de temps assuré : Vous dictez, je rédige et vous livrez des documents impeccables.',
    color: '#c8a1cf',
    icon: 'file-contract',
  },
  {
    title: 'GESTION MAILS',
    description:
      'Libérez-vous de la gestion chronophage de vos e-mails et gagnez en efficacité ! Je vous aide à trier, organiser et répondre à vos messages pour que vous puissiez vous concentrer sur l’essentiel.\n✅ Tri et classement des e-mails : Priorisation des messages importants et suppression des indésirables.\n✅ Réponses et suivi des demandes : Rédaction de réponses selon vos consignes et gestion des urgences.\n✅ Organisation et archivage : Mise en place de dossiers et filtres pour une boîte mail optimisée.\n✅ Veille et relances : Suivi des échanges clients, fournisseurs ou partenaires pour éviter les oublis.',
    color: '#c8a1cf',
    icon: 'envelope',
  },
  {
    title: 'CONFIDENTIALITÉ ET RIGUEUR',
    description:
      'Je traite vos documents avec la plus grande discrétion et un haut niveau d’exigence.\n✅ Confidentialité garantie : Toutes vos données sont traitées en toute sécurité, dans le respect du secret professionnel et des réglementations en vigueur.\n✅ Rigueur et précision : Chaque document est rédigé avec soin et exactitude pour vous assurer un travail fiable et de qualité.\n✅ Engagement professionnel : Une collaboration fondée sur la confiance, avec des processus clairs et une gestion efficace de vos dossiers.',
    color: '#c8a1cf',
    icon: 'lock',
  },
];

// ServiceBox Component
const ServiceBox = React.memo(({ service, isSmallScreen }) => (
  <View style={[styles.serviceBox, { width: isSmallScreen ? '100%' : '48%' }]}>
    <FontAwesome5
      name={service.icon}
      size={30}
      color={service.color}
      style={styles.serviceIconLeft}
    />
    <Text style={styles.serviceTitle}>{service.title}</Text>
    <View style={styles.serviceDescriptionContainer}>
      {service.description.split('\n').map((line, index) => (
        <Text key={index} style={styles.serviceDescription}>
          {line.trim()}
        </Text>
      ))}
    </View>
  </View>
));

// SectionAccueil Component
const SectionAccueil = ({ accueilRef }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;
  const contentWidth = isSmallScreen ? width * 0.8 : 350;
  const contentHeight = 250;

  return (
    <View ref={accueilRef} style={styles.section}>
      <Text style={styles.header}>AMÉLIE ASSIST</Text>
      <Text style={styles.subtitle}>VOTRE ASSISTANTE INDÉPENDANTE</Text>
      <View style={styles.separator} />
      <View style={[styles.content, { flexDirection: isSmallScreen ? 'column' : 'row' }]}>
        <View style={[styles.textContainer, { width: contentWidth, minHeight: contentHeight }]}>
          <View style={[styles.descriptionBox, { width: '100%', minHeight: '100%' }]}>
            <ScrollView
              style={styles.scrollText}
              contentContainerStyle={styles.scrollTextContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
                Bonjour, je suis Amélie, assistante administrative indépendante.
              </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}> </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
                Passionnée par l’univers administratif, je mets mon expertise au service des entrepreneurs pour qu’ils
                puissent se concentrer sur l’essence de leur métier.
              </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}> </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
                Là où la paperasse se transforme en véritable casse-tête chronophage, j’y trouve un terrain de jeu
                stimulant.
              </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}> </Text>
              <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
                Mon objectif est de vous libérer des contraintes administratives afin que vous puissiez vous concentrer
                pleinement sur votre cœur de métier.
              </Text>
            </ScrollView>
          </View>
        </View>
        {isSmallScreen && <View style={{ height: 20 }} />}
      </View>
    </View>
  );
};

// SectionServices Component
const SectionServices = ({ servicesRef }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;

  return (
    <View ref={servicesRef} style={styles.section}>
      <Text style={styles.servicesHeader}>MES SERVICES CLÉS</Text>
      <View style={styles.servicesWrapper}>
        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceBox service={item} isSmallScreen={isSmallScreen} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={isSmallScreen ? 1 : 2}
          contentContainerStyle={styles.servicesContainer}
          columnWrapperStyle={isSmallScreen ? null : styles.columnWrapper}
          scrollEnabled={true}
          key={isSmallScreen ? 'mobile' : 'desktop'}
        />
      </View>
      <View style={styles.separator} />
    </View>
  );
};

// SectionTarifs Component
const SectionTarifs = ({ tariffsRef }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;

  return (
    <View ref={tariffsRef} style={styles.section}>
      <Text style={styles.tarifHeader}>DES TARIFS ADAPTÉS À VOS BESOINS</Text>
      <Text style={[styles.tarifDescription, isSmallScreen && styles.tarifDescriptionMobile]}>
        Parce que chaque professionnel a des exigences spécifiques, je vous propose une tarification flexible : à l'acte
        pour des besoins ponctuels ou en forfait pour un accompagnement régulier.
      </Text>
      <View style={[styles.tarifContainer, isSmallScreen && styles.tarifColumn]}>
        <View style={[styles.tarifBox, isSmallScreen && styles.tarifBoxFullWidth]}>
          <Text style={styles.tarifTitle}>A LA CARTE</Text>
          <View style={styles.separator} />
          <Text style={styles.tarifText}>À l’heure : 35€ de l’heure</Text>
          <Text style={styles.tarifText}>Rédaction de courriers : 5€ à la page</Text>
          <Text style={styles.tarifText}>Rédaction de devis : 5€ à la page</Text>
          <Text style={styles.tarifText}>Rédaction de factures : 5€ à la page</Text>
        </View>
        <View style={[styles.tarifBox, isSmallScreen && styles.tarifBoxFullWidth]}>
          <Text style={styles.tarifTitle}>LES FORFAITS MENSUELS</Text>
          <View style={styles.separator} />
          <Text style={styles.tarifText}>PACK ESSENTIEL - 5h : 175€</Text>
          <Text style={styles.tarifText}>PACK OPTIMISATION - 7h : 235€</Text>
          <Text style={styles.tarifText}>PACK SERENITE - 10h : 325€</Text>
          <Text style={styles.tarifText}>PACK LIBERTÉ - 20h : 615€</Text>
          <Text style={styles.tarifText}>PACK SUPER ASSIST - 30h : 850€</Text>
        </View>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

// SectionContact Component
const SectionContact = ({ contactRef, consent, setConsent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bestTime: '',
    message: '',
  });
  const [isEmailJSReady, setIsEmailJSReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Nouvel état pour suivre la soumission

  useEffect(() => {
    console.log('Initialisation d\'EmailJS...');
    emailjs.init('PWjc4atPzxnD-9nKK');
    console.log('EmailJS prêt');
    setIsEmailJSReady(true);
  }, []);

  const sendEmail = (submission) => {
    console.log('Début de sendEmail avec submission :', submission);
    if (!isEmailJSReady) {
      console.log('EmailJS pas encore prêt, tentative annulée');
      setStatusMessage('Erreur : Le service d\'envoi n\'est pas encore prêt. Veuillez réessayer.');
      setIsSubmitting(false); // Arrête l'état de soumission en cas d'erreur
      return;
    }
    emailjs
      .send('service_9sadwfq', 'template_16ems59', submission)
      .then(
        (result) => {
          console.log('Email envoyé avec succès :', result.text);
          setFormData({ name: '', email: '', phone: '', bestTime: '', message: '' });
          setStatusMessage('Succès : Message envoyé par e-mail !');
          setIsSubmitting(false); // Arrête l'état de soumission après succès
          setTimeout(() => setStatusMessage(''), 3000);
        },
        (error) => {
          console.log('Erreur EmailJS :', error.text);
          setStatusMessage('Erreur : Échec de l\'envoi de l\'e-mail. Veuillez réessayer.');
          setIsSubmitting(false); // Arrête l'état de soumission après erreur
        }
      );
  };

  const handleSubmit = () => {
    console.log('handleSubmit appelé');
    console.log('Consent:', consent);
    console.log('FormData:', formData);

    if (!consent) {
      console.log('Consentement non donné');
      setStatusMessage('Erreur : Veuillez accepter l\'utilisation de vos données');
      return;
    }
    if (!formData.name || !formData.email || !formData.message) {
      console.log('Champs obligatoires manquants');
      setStatusMessage('Erreur : Veuillez remplir tous les champs obligatoires');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.log('Format email invalide');
      setStatusMessage('Erreur : Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.phone && !/^\d+$/.test(formData.phone)) {
      console.log('Numéro de téléphone invalide');
      setStatusMessage('Erreur : Le numéro de téléphone doit contenir uniquement des chiffres');
      return;
    }

    setIsSubmitting(true); // Active l'état de soumission
    const submission = {
      ...formData,
      date: new Date().toLocaleString(),
    };

    console.log('Submission préparée :', submission);
    sendEmail(submission);
  };

  return (
    <View ref={contactRef} style={styles.contactContainer}>
      <Text style={styles.contactHeader}>CONTACTEZ MOI</Text>
      <Text style={styles.contactDescription}>
        Vous avez un projet en tête ? Remplissez ce formulaire et je vous répondrai rapidement.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nom/Prénom *"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail *"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Meilleur moment pour vous contacter"
        value={formData.bestTime}
        onChangeText={(text) => setFormData({ ...formData, bestTime: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Votre message *"
        multiline
        numberOfLines={4}
        value={formData.message}
        onChangeText={(text) => setFormData({ ...formData, message: text })}
      />
      <View style={styles.checkboxContainer}>
        <CheckBox value={consent} onValueChange={setConsent} />
        <Text style={styles.checkboxLabel}>J'accepte que mes données soient utilisées pour être recontacté(e).</Text>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, !consent && styles.disabledButton]}
        onPress={() => {
          console.log('Bouton Envoyer cliqué');
          handleSubmit();
        }}
        disabled={!consent || isSubmitting} // Désactive le bouton pendant la soumission
        activeOpacity={0.7}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Veuillez patienter' : 'Envoyer'} {/* Affiche "Veuillez patienter" pendant la soumission */}
        </Text>
      </TouchableOpacity>
      {statusMessage ? (
        <Text
          style={[styles.statusMessage, statusMessage.includes('Succès') ? styles.success : styles.error]}
        >
          {statusMessage}
        </Text>
      ) : null}
      <View style={styles.separator} />
    </View>
  );
};

// Footer Component
const Footer = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { width } = useWindowDimensions();
  const router = useRouter();

  const handleEmailPress = async () => {
    const email = 'contact@atouzet.ovh';
    try {
      const supported = await Linking.canOpenURL(`mailto:${email}`);
      if (!supported) {
        setErrorMessage('Aucune application de messagerie n\'est configurée.');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
      await Linking.openURL(`mailto:${email}`);
    } catch (err) {
      console.error('Erreur lors de l\'ouverture de l\'email:', err);
      setErrorMessage('Erreur lors de l\'ouverture de l\'application de messagerie.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handlePrivacyPolicyPress = () => {
    console.log('Navigating to PrivacyPolicy from Footer');
    router.push('/privacy-policy');
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        <View style={[styles.footerBox, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.footerText}>Amélie Touzet EI </Text>
          <Text style={styles.footerSubtext}>SIRET : 9386585150001 </Text>
          <TouchableOpacity onPress={handleEmailPress} activeOpacity={0.7}>
            <Text style={[styles.footerSubtext, styles.footerTextLink]}>contact@atouzet.ovh</Text>
          </TouchableOpacity>
          <Text style={styles.footerSubtext}>06 16 09 41 41 </Text>
          <Text style={styles.footerSubtext}>4, la Sablonnière 36310 Chaillac </Text>
          <Text style={styles.footerSubtext}>TVA intracommunautaire : FR82938658515 - TVA non applicable </Text>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </View>
        <View style={[styles.footerBox, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <TouchableOpacity onPress={handlePrivacyPolicyPress} activeOpacity={0.7}>
            <Text style={[styles.footerSubtext, styles.footerTextLink]}>Politique de confidentialité</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function Index() {
  const scrollViewRef = useRef(null);
  const sectionRefs = useRef({
    accueil: null,
    services: null,
    tarifs: null,
    contact: null,
  }).current;
  const [consent, setConsent] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    BrownSugar: require('../../assets/fonts/BrownSugar.ttf'),
    GlassAntica: require('../../assets/fonts/GlassAntiqua-Regular.ttf'),
  });

  // Vérifier le consentement des cookies à chaque fois que la page prend le focus
  useFocusEffect(
    useCallback(() => {
      const checkCookieConsent = async () => {
        try {
          const consent = await AsyncStorage.getItem('cookieConsent');
          if (consent === null) {
            setShowCookiePopup(true);
          } else {
            setShowCookiePopup(false);
          }
        } catch (error) {
          console.error('Erreur lors de la vérification du consentement des cookies:', error);
          setShowCookiePopup(true);
        }
      };

      checkCookieConsent();
    }, [])
  );

  const handleAcceptCookies = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'accepted');
      setShowCookiePopup(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du consentement des cookies:', error);
    }
  };

  const handleDeclineCookies = async () => {
    try {
      await AsyncStorage.setItem('cookieConsent', 'declined');
      setShowCookiePopup(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du refus des cookies:', error);
    }
  };

  const handleClosePopup = () => {
    setShowCookiePopup(false);
  };

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  const scrollToSection = useCallback((section) => {
    if (section === 'privacyPolicy') {
      router.push('/privacy-policy');
    } else {
      const ref = sectionRefs[section];
      if (ref && scrollViewRef.current) {
        ref.measureLayout(
          scrollViewRef.current,
          (x, y) => {
            scrollViewRef.current.scrollTo({ y, animated: true });
            setActiveSection(section);
          },
          (error) => console.error('Erreur lors du défilement :', error)
        );
      }
    }
  }, [router]);

  const handleScroll = useCallback((event) => {
    const yOffset = event.nativeEvent.contentOffset.y;

    Object.entries(sectionRefs).forEach(([section, ref]) => {
      if (ref) {
        ref.measureLayout(
          scrollViewRef.current,
          (x, y, width, height) => {
            const sectionTop = y;
            const sectionBottom = y + height;
            if (yOffset >= sectionTop - 100 && yOffset < sectionBottom) {
              setActiveSection(section);
            }
          },
          (error) => console.error('Erreur de mesure :', error)
        );
      }
    });
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <SectionAccueil accueilRef={(ref) => (sectionRefs.accueil = ref)} />
          <SectionServices servicesRef={(ref) => (sectionRefs.services = ref)} />
          <SectionTarifs tariffsRef={(ref) => (sectionRefs.tarifs = ref)} />
          <SectionContact contactRef={(ref) => (sectionRefs.contact = ref)} consent={consent} setConsent={setConsent} />
          <Footer />
        </ScrollView>
        <Navbar onNavigate={scrollToSection} activeSection={activeSection} />
      </View>
      <CookiePopup
        visible={showCookiePopup}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
        onNavigate={router}
        onClose={handleClosePopup} // Passer la fonction de fermeture
      />
    </View>
  );
}

// Styles (inchangés, repris pour référence)
const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff2ed',
    },
    loadingText: {
      fontSize: 24,
      color: '#704F57',
      fontFamily: 'GlassAntica',
    },
    outerContainer: {
      flex: 1,
      backgroundColor: '#fff2ed',
      alignItems: 'center',
    },
    innerContainer: {
      flex: 1,
      width: '100%',
      paddingTop: 20,
      paddingBottom: 0,
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
      width: '100%',
    },
    section: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#fff2ed',
    },
    navbar: {
      position: 'absolute',
      bottom: 10,
      left: '5%',
      right: '5%',
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#1A0429',
      paddingVertical: 12,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      zIndex: 100,
    },
    navItem: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 15,
    },
    navItemActive: {
      backgroundColor: '#704F57',
    },
    navText: {
      color: 'white',
      fontSize: 20,
      fontFamily: 'GlassAntica',
    },
    navTextActive: {
      color: 'white',
    },
    header: {
      fontSize: 115,
      fontWeight: 'bold',
      fontFamily: 'BrownSugar',
      textTransform: 'uppercase',
      textAlign: 'center',
      color: '#704F57',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'BrownSugar',
      textAlign: 'center',
      color: '#704F57',
      marginBottom: 40,
    },
    description: {
      fontSize: 25,
      fontFamily: 'GlassAntica',
      color: '#4F4F4F',
      textAlign: 'center',
      lineHeight: 30,
      flexShrink: 1,
    },
    descriptionMobile: {
      fontSize: 20,
      lineHeight: 23,
    },
    content: {
      width: '90%',
      maxWidth: 1200,
      paddingVertical: 20,
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: 20,
      maxWidth: 1200,
      justifyContent: 'center',
    },
    descriptionBox: {
      backgroundColor: '#FFD1D1',
      padding: 20,
      borderRadius: 15,
      justifyContent: 'center',
    },
    scrollText: {
      flexGrow: 1,
    },
    scrollTextContent: {
      paddingBottom: 10,
    },
    servicesHeader: {
      fontSize: 42,
      fontWeight: 'bold',
      color: '#704F57',
      fontFamily: 'BrownSugar',
      marginVertical: 20,
      textAlign: 'center',
    },
    servicesWrapper: {
      width: '90%',
      maxWidth: 900,
      alignItems: 'center',
    },
    servicesContainer: {
      width: '100%',
      paddingHorizontal: 10,
    },
    columnWrapper: {
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    serviceBox: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 15,
      marginVertical: 5,
      alignItems: 'center',
      position: 'relative',
    },
    serviceIconLeft: {
      position: 'absolute',
      top: 10,
      left: 10,
    },
    serviceTitle: {
      fontSize: 25,
      color: '#4F4F4F',
      fontWeight: 'bold',
      fontFamily: 'GlassAntica',
      textAlign: 'center',
      marginBottom: 10,
    },
    serviceDescriptionContainer: {
      paddingHorizontal: 10,
    },
    serviceDescription: {
      fontSize: 20,
      fontFamily: 'GlassAntica',
      color: '#4F4F4F',
      textAlign: 'left',
      marginVertical: 2,
    },
    tarifHeader: {
      fontSize: 42,
      fontWeight: 'bold',
      fontFamily: 'BrownSugar',
      color: '#704F57',
      marginTop: 30,
      textAlign: 'center',
    },
    tarifDescription: {
      fontSize: 25,
      color: '#4F4F4F',
      fontFamily: 'GlassAntica',
      textAlign: 'center',
      marginBottom: 20,
      paddingHorizontal: 20,
      maxWidth: 800,
    },
    tarifDescriptionMobile: {
      fontSize: 18,
      paddingHorizontal: 15,
      marginHorizontal: 10,
    },
    tarifContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '90%',
    },
    tarifColumn: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    tarifBox: {
      backgroundColor: '#C9A9A6',
      padding: 20,
      borderRadius: 20,
      width: '45%',
      alignItems: 'center',
    },
    tarifBoxFullWidth: {
      width: '90%',
      marginBottom: 15,
    },
    tarifTitle: {
      fontWeight: 'bold',
      fontSize: 25,
      fontFamily: 'BrownSugar',
      color: 'white',
    },
    tarifText: {
      fontSize: 21,
      color: 'white',
      fontFamily: 'GlassAntica',
      marginVertical: 5,
      textAlign: 'center',
      padding: 5,
    },
    separator: {
      height: 2,
      width: '80%',
      backgroundColor: '#704F57',
      marginVertical: 20,
      alignSelf: 'center',
    },
    contactContainer: {
      backgroundColor: '#FFD1D1',
      padding: 20,
      borderRadius: 15,
      width: '90%',
      maxWidth: 600,
      marginTop: 40,
    },
    contactHeader: {
      fontSize: 42,
      fontWeight: 'bold',
      fontFamily: 'BrownSugar',
      color: '#704F57',
      textAlign: 'center',
    },
    contactDescription: {
      fontSize: 20,
      color: '#4F4F4F',
      fontFamily: 'GlassAntica',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      backgroundColor: 'white',
      padding: 10,
      fontFamily: 'GlassAntica',
      marginVertical: 10,
      borderRadius: 10,
      fontSize: 18,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    checkboxLabel: {
      fontSize: 20,
      fontFamily: 'GlassAntica',
      color: '#4F4F4F',
    },
    statusMessage: {
      marginTop: 10,
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'GlassAntica',
      color: '#4F4F4F',
    },
    success: {
      color: 'green',
    },
    error: {
      color: 'red',
    },
    footer: {
      width: '100%',
      paddingVertical: 100,
      alignItems: 'center',
      marginTop: 50,
      backgroundColor: '#2E1E2E',
    },
    footerContainer: {
      flexDirection: 'row',
      width: '90%',
      maxWidth: 1200,
      justifyContent: 'space-between',
    },
    footerBox: {
      backgroundColor: '#4A3A4A',
      padding: 20,
      borderRadius: 15,
      marginRight: 10,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 35,
      fontFamily: 'GlassAntica',
      color: '#FFACC7',
      textAlign: 'center',
      marginBottom: 5,
    },
    footerTextLink: {
      textDecorationLine: 'underline',
      color: '#FFACC7',
    },
    footerSubtext: {
      fontSize: 20,
      fontFamily: 'GlassAntica',
      textAlign: 'center',
      color: '#C9A9A6',
    },
    footerContent: {
      width: '90%',
      maxWidth: 1200,
      alignItems: 'center',
    },
    errorMessage: {
      fontSize: 16,
      fontFamily: 'GlassAntica',
      color: 'red',
      marginTop: 5,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    cookiePopup: {
      backgroundColor: '#FFD1D1',
      padding: 20,
      borderRadius: 15,
      width: '80%',
      maxWidth: 500,
      alignItems: 'center',
    },
    cookiePopupMobile: {
      width: '90%',
    },
    cookieHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'BrownSugar',
      color: '#704F57',
      textAlign: 'center',
      marginBottom: 10,
    },
    cookieText: {
      fontSize: 16,
      fontFamily: 'GlassAntica',
      color: '#4F4F4F',
      textAlign: 'center',
      marginBottom: 20,
    },
    cookieLink: {
      color: '#704F57',
      textDecorationLine: 'underline',
    },
    cookieButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    cookieButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginHorizontal: 10,
    },
    acceptButton: {
      backgroundColor: '#704F57',
    },
    declineButton: {
      backgroundColor: '#C9A9A6',
    },
    cookieButtonText: {
      fontSize: 16,
      fontFamily: 'GlassAntica',
      color: 'white',
      textAlign: 'center',
    },
    submitButton: {
      backgroundColor: '#704F57',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 20, // Rayon de bordure plus arrondi (ajustable selon vos préférences)
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    submitButtonText: {
      color: 'white',
      fontSize: 18,
      fontFamily: 'GlassAntica',
      textAlign: 'center',
    },
    disabledButton: {
      backgroundColor: '#B0B0B0', // Couleur grisée pour le bouton désactivé
      opacity: 0.7,
    },
  });