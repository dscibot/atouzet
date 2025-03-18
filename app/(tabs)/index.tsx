import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Linking,
  CheckBox,
} from "react-native";
import { useWindowDimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import emailjs from "@emailjs/browser";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter, useFocusEffect } from "expo-router";

// CookiePopup Component
const CookiePopup = ({ visible, onAccept, onDecline, onNavigate, onClose }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;

  const handlePrivacyPolicyPress = () => {
    onClose();
    onNavigate.push("/privacy-policy");
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={() => {}}>
      <View style={styles.modalOverlay}>
        <View style={[styles.cookiePopup, isSmallScreen && styles.cookiePopupMobile]}>
          <Text style={styles.cookieHeader}>Nous utilisons des cookies</Text>
          <Text style={styles.cookieText}>
            Ce site utilise des cookies pour améliorer votre expérience.{" "}
            <Text style={styles.cookieLink} onPress={handlePrivacyPolicyPress}>
              En savoir plus
            </Text>
          </Text>
          <View style={styles.cookieButtonContainer}>
            <TouchableOpacity style={[styles.cookieButton, styles.acceptButton]} onPress={onAccept}>
              <Text style={styles.cookieButtonText}>Accepter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.cookieButton, styles.declineButton]} onPress={onDecline}>
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
      style={[styles.navItem, activeSection === "accueil" && styles.navItemActive]}
      onPress={() => onNavigate("accueil")}
    >
      <Feather name="home" size={24} color="white" />
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === "services" && styles.navItemActive]}
      onPress={() => onNavigate("services")}
    >
      <Text style={[styles.navText, activeSection === "services" && styles.navTextActive]}>Mes services</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === "tarifs" && styles.navItemActive]}
      onPress={() => onNavigate("tarifs")}
    >
      <Text style={[styles.navText, activeSection === "tarifs" && styles.navTextActive]}>Les tarifs</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.navItem, activeSection === "contact" && styles.navItemActive]}
      onPress={() => onNavigate("contact")}
    >
      <Entypo name="email" size={24} color="white" />
    </TouchableOpacity>
  </View>
);

// Static data pour services
const services = [
  {
    title: "FACTURES",
    description:
      "Gagnez du temps et assurez une gestion fluide de votre facturation ! En tant qu’assistante administrative indépendante, je vous accompagne dans la rédaction et le suivi de vos devis et factures pour vous permettre de vous concentrer sur votre cœur de métier.\n✅ Émission de vos devis et factures: Création et mise en page professionnelle selon vos exigences.\n✅ Suivi des paiements: Relances des clients en cas de retard pour optimiser votre trésorerie.",
    color: "#c8a1cf",
    icon: "file-invoice-dollar",
  },
  {
    title: "TRANSCRIPTION",
    description:
      "Gagnez du temps et assurez des documents clairs et professionnels ! Je transforme vos dictées en textes parfaitement rédigés et mis en forme, prêts à être utilisés.\n✅ Transcription fidèle et précise : Retranscription de vos dictées audio avec orthographe et syntaxe soignées.\n✅ Mise en page professionnelle : Adaptation selon vos besoins (courriers, rapports, actes, conclusions…).\n✅ Gain de temps assuré : Vous dictez, je rédige et vous livrez des documents impeccables.",
    color: "#c8a1cf",
    icon: "file-contract",
  },
  {
    title: "GESTION MAILS",
    description:
      "Libérez-vous de la gestion chronophage de vos e-mails et gagnez en efficacité ! Je vous aide à trier, organiser et répondre à vos messages pour que vous puissiez vous concentrer sur l’essentiel.\n✅ Tri et classement des e-mails : Priorisation des messages importants et suppression des indésirables.\n✅ Réponses et suivi des demandes : Rédaction de réponses selon vos consignes et gestion des urgences.\n✅ Organisation et archivage : Mise en place de dossiers et filtres pour une boîte mail optimisée.\n✅ Veille et relances : Suivi des échanges clients, fournisseurs ou partenaires pour éviter les oublis.",
    color: "#c8a1cf",
    icon: "envelope",
  },
  {
    title: "CONFIDENTIALITÉ ET RIGUEUR",
    description:
      "Je traite vos documents avec la plus grande discrétion et un haut niveau d’exigence.\n✅ Confidentialité garantie : Toutes vos données sont traitées en toute sécurité, dans le respect du secret professionnel et des réglementations en vigueur.\n✅ Rigueur et précision : Chaque document est rédigé avec soin et exactitude pour vous assurer un travail fiable et de qualité.\n✅ Engagement professionnel : Une collaboration fondée sur la confiance, avec des processus clairs et une gestion efficace de vos dossiers.",
    color: "#c8a1cf",
    icon: "lock",
  },
];

// ServiceBox Component
const ServiceBox = React.memo(({ service, isSmallScreen }) => (
  <View style={[styles.serviceBox, { width: isSmallScreen ? "100%" : "48%" }]}>
    <FontAwesome5 name={service.icon} size={30} color={service.color} style={styles.serviceIconLeft} />
    <Text style={styles.serviceTitle}>{service.title}</Text>
    <View style={styles.serviceDescriptionContainer}>
      {service.description.split("\n").map((line, index) => (
        <Text key={index} style={styles.serviceDescription}>
          {line.trim()}
        </Text>
      ))}
    </View>
  </View>
));

// SectionAccueil Component (Corrigée)
const SectionAccueil = ({ accueilRef }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;
  const contentWidth = isSmallScreen ? width * 0.9 : 500;

  return (
    <View ref={accueilRef} style={styles.section}>
      <Text style={styles.header}>AMÉLIE ASSIST</Text>
      <Text style={styles.subtitle}>VOTRE ASSISTANTE INDÉPENDANTE</Text>
      <View style={styles.separator} />
      <View style={[styles.content, { flexDirection: isSmallScreen ? "column" : "row" }]}>
        <View style={[styles.textContainer, { width: contentWidth }]}>
          <View style={styles.descriptionBox}>
            <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
              Bonjour, je suis Amélie, assistante administrative indépendante.
            </Text>
            <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
              Passionnée par l’univers administratif, je mets mon expertise au service des entrepreneurs pour qu’ils
              puissent se concentrer sur l’essence de leur métier.
            </Text>
            <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
              Là où la paperasse se transforme en véritable casse-tête chronophage, j’y trouve un terrain de jeu
              stimulant.
            </Text>
            <Text style={[styles.description, isSmallScreen && styles.descriptionMobile]}>
              Mon objectif est de vous libérer des contraintes administratives afin que vous puissiez vous concentrer
              pleinement sur votre cœur de métier.
            </Text>
          </View>
        </View>
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
          <Text style={styles.tarifTitle}>À LA CARTE</Text>
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
          <Text style={styles.tarifText}>PACK SÉRÉNITÉ - 10h : 325€</Text>
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
    name: "",
    email: "",
    phone: "",
    bestTime: "",
    message: "",
  });
  const [isEmailJSReady, setIsEmailJSReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    emailjs.init("PWjc4atPzxnD-9nKK");
    setIsEmailJSReady(true);
  }, []);

  const sendEmail = (submission) => {
    if (!isEmailJSReady) {
      setStatusMessage("Erreur : Service d’envoi non prêt.");
      setIsSubmitting(false);
      return;
    }
    emailjs.send("service_9sadwfq", "template_16ems59", submission).then(
      () => {
        setFormData({ name: "", email: "", phone: "", bestTime: "", message: "" });
        setStatusMessage("Succès : Message envoyé !");
        setIsSubmitting(false);
        setTimeout(() => setStatusMessage(""), 3000);
      },
      (error) => {
        setStatusMessage("Erreur : Échec de l’envoi.");
        setIsSubmitting(false);
        console.error("EmailJS error:", error);
      }
    );
  };

  const handleSubmit = () => {
    if (!consent) {
      setStatusMessage("Erreur : Veuillez accepter l’utilisation de vos données.");
      return;
    }
    if (!formData.name || !formData.email || !formData.message) {
      setStatusMessage("Erreur : Champs obligatoires manquants.");
      return;
    }
    setIsSubmitting(true);
    const submission = { ...formData, date: new Date().toLocaleString() };
    sendEmail(submission);
  };

  return (
    <View ref={contactRef} style={styles.contactContainer}>
      <Text style={styles.contactHeader}>CONTACTEZ MOI</Text>
      <Text style={styles.contactDescription}>
        Remplissez ce formulaire et je vous répondrai rapidement.
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
        <Text style={styles.checkboxLabel}>J’accepte que mes données soient utilisées pour être recontacté(e).</Text>
      </View>
      <TouchableOpacity
        style={[styles.submitButton, !consent && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={!consent || isSubmitting}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? "Veuillez patienter" : "Envoyer"}</Text>
      </TouchableOpacity>
      {statusMessage ? (
        <Text style={[styles.statusMessage, statusMessage.includes("Succès") ? styles.success : styles.error]}>
          {statusMessage}
        </Text>
      ) : null}
      <View style={styles.separator} />
    </View>
  );
};

// Footer Component
const Footer = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleEmailPress = async () => {
    const email = "contact@atouzet.ovh";
    try {
      const supported = await Linking.canOpenURL(`mailto:${email}`);
      if (!supported) {
        setErrorMessage("Aucune application de messagerie n’est configurée.");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
      await Linking.openURL(`mailto:${email}`);
    } catch (err) {
      setErrorMessage("Erreur lors de l’ouverture de l’email.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handlePrivacyPolicyPress = () => {
    router.push("/privacy-policy");
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        <View style={[styles.footerBox, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
          <Text style={styles.footerText}>Amélie Touzet EI</Text>
          <Text style={styles.footerSubtext}>SIRET : 9386585150001</Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={[styles.footerSubtext, styles.footerTextLink]}>contact@atouzet.ovh</Text>
          </TouchableOpacity>
          <Text style={styles.footerSubtext}>06 16 09 41 41</Text>
          <Text style={styles.footerSubtext}>4, la Sablonnière 36310 Chaillac</Text>
          <Text style={styles.footerSubtext}>TVA intracommunautaire : FR82938658515 - TVA non applicable</Text>
          {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </View>
        <View style={[styles.footerBox, { flex: 1, justifyContent: "center", alignItems: "center" }]}>
          <TouchableOpacity onPress={handlePrivacyPolicyPress}>
            <Text style={[styles.footerSubtext, styles.footerTextLink]}>Politique de confidentialité</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Composant principal Index
export default function Index() {
  const scrollViewRef = useRef(null);
  const sectionRefs = useRef({
    accueil: null,
    services: null,
    tarifs: null,
    contact: null,
  }).current;
  const [consent, setConsent] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const checkCookieConsent = async () => {
        try {
          const consent = await AsyncStorage.getItem("cookieConsent");
          setShowCookiePopup(consent === null);
        } catch (error) {
          console.error("Erreur lors de la vérification des cookies :", error);
          setShowCookiePopup(true);
        }
      };
      checkCookieConsent();
    }, [])
  );

  const handleAcceptCookies = async () => {
    await AsyncStorage.setItem("cookieConsent", "accepted");
    setShowCookiePopup(false);
  };

  const handleDeclineCookies = async () => {
    await AsyncStorage.setItem("cookieConsent", "declined");
    setShowCookiePopup(false);
  };

  const scrollToSection = useCallback(
    (section) => {
      if (section === "privacy-policy") {
        router.push("/privacy-policy");
      } else {
        const ref = sectionRefs[section];
        if (ref && scrollViewRef.current) {
          ref.measureLayout(
            scrollViewRef.current,
            (x, y) => {
              scrollViewRef.current.scrollTo({ y, animated: true });
              setActiveSection(section);
            },
            (error) => console.error("Erreur lors du défilement :", error)
          );
        }
      }
    },
    [router]
  );

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
          (error) => console.error("Erreur de mesure :", error)
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
          <SectionContact
            contactRef={(ref) => (sectionRefs.contact = ref)}
            consent={consent}
            setConsent={setConsent}
          />
          <Footer />
        </ScrollView>
        <Navbar onNavigate={scrollToSection} activeSection={activeSection} />
      </View>
      <CookiePopup
        visible={showCookiePopup}
        onAccept={handleAcceptCookies}
        onDecline={handleDeclineCookies}
        onNavigate={router}
        onClose={() => setShowCookiePopup(false)}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#fff2ed", alignItems: "center" },
  innerContainer: { flex: 1, width: "100%", paddingTop: 20, paddingBottom: 0 },
  scrollContainer: { flexGrow: 1, alignItems: "center", width: "100%" },
  section: { width: "100%", alignItems: "center", backgroundColor: "#fff2ed" },
  header: { fontSize: 115, fontFamily: "BrownSugar", color: "#704F57", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 24, fontFamily: "BrownSugar", color: "#704F57", textAlign: "center", marginBottom: 40 },
  separator: { height: 2, width: "80%", backgroundColor: "#704F57", marginVertical: 20, alignSelf: "center" },
  content: { width: "90%", maxWidth: 1200, paddingVertical: 20, alignItems: "center" },
  textContainer: { paddingHorizontal: 20 },
  descriptionBox: { backgroundColor: "#FFD1D1", padding: 20, borderRadius: 15 },
  description: { fontSize: 25, fontFamily: "GlassAntica", color: "#4F4F4F", textAlign: "center", marginVertical: 5 },
  descriptionMobile: { fontSize: 20 },
  servicesHeader: { fontSize: 42, fontFamily: "BrownSugar", color: "#704F57", marginVertical: 20, textAlign: "center" },
  servicesWrapper: { width: "90%", maxWidth: 900, alignItems: "center" },
  servicesContainer: { width: "100%", paddingHorizontal: 10 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  serviceBox: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 15, marginVertical: 5, position: "relative" },
  serviceIconLeft: { position: "absolute", top: 10, left: 10 },
  serviceTitle: { fontSize: 25, color: "#4F4F4F", fontFamily: "GlassAntica", textAlign: "center", marginBottom: 10 },
  serviceDescriptionContainer: { paddingHorizontal: 10 },
  serviceDescription: { fontSize: 20, fontFamily: "GlassAntica", color: "#4F4F4F", textAlign: "left", marginVertical: 2 },
  tarifHeader: { fontSize: 42, fontFamily: "BrownSugar", color: "#704F57", marginTop: 30, textAlign: "center" },
  tarifDescription: { fontSize: 25, fontFamily: "GlassAntica", color: "#4F4F4F", textAlign: "center", marginBottom: 20, paddingHorizontal: 20, maxWidth: 800 },
  tarifDescriptionMobile: { fontSize: 18, paddingHorizontal: 15 },
  tarifContainer: { flexDirection: "row", justifyContent: "space-around", width: "90%" },
  tarifColumn: { flexDirection: "column", alignItems: "center" },
  tarifBox: { backgroundColor: "#C9A9A6", padding: 20, borderRadius: 20, width: "45%", alignItems: "center" },
  tarifBoxFullWidth: { width: "90%", marginBottom: 15 },
  tarifTitle: { fontSize: 25, fontFamily: "BrownSugar", color: "white" },
  tarifText: { fontSize: 21, fontFamily: "GlassAntica", color: "white", marginVertical: 5, textAlign: "center" },
  contactContainer: { backgroundColor: "#FFD1D1", padding: 20, borderRadius: 15, width: "90%", maxWidth: 600, marginTop: 40 },
  contactHeader: { fontSize: 42, fontFamily: "BrownSugar", color: "#704F57", textAlign: "center" },
  contactDescription: { fontSize: 20, fontFamily: "GlassAntica", color: "#4F4F4F", textAlign: "center", marginBottom: 20 },
  input: { backgroundColor: "white", padding: 10, fontFamily: "GlassAntica", marginVertical: 10, borderRadius: 10, fontSize: 18 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  checkboxLabel: { fontSize: 20, fontFamily: "GlassAntica", color: "#4F4F4F" },
  submitButton: { backgroundColor: "#704F57", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 20, alignItems: "center", marginTop: 10 },
  submitButtonText: { color: "white", fontSize: 18, fontFamily: "GlassAntica" },
  disabledButton: { backgroundColor: "#B0B0B0", opacity: 0.7 },
  statusMessage: { marginTop: 10, textAlign: "center", fontSize: 16, fontFamily: "GlassAntica", color: "#4F4F4F" },
  success: { color: "green" },
  error: { color: "red" },
  footer: { width: "100%", paddingVertical: 100, alignItems: "center", marginTop: 50, backgroundColor: "#2E1E2E" },
  footerContainer: { flexDirection: "row", width: "90%", maxWidth: 1200, justifyContent: "space-between" },
  footerBox: { backgroundColor: "#4A3A4A", padding: 20, borderRadius: 15, marginRight: 10, alignItems: "center" },
  footerText: { fontSize: 35, fontFamily: "GlassAntica", color: "#FFACC7", textAlign: "center", marginBottom: 5 },
  footerSubtext: { fontSize: 20, fontFamily: "GlassAntica", textAlign: "center", color: "#C9A9A6" },
  footerTextLink: { textDecorationLine: "underline", color: "#FFACC7" },
  errorMessage: { fontSize: 16, fontFamily: "GlassAntica", color: "red", marginTop: 5, textAlign: "center" },
  navbar: {
    position: "absolute",
    bottom: 10,
    left: "5%",
    right: "5%",
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1A0429",
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 15 },
  navItemActive: { backgroundColor: "#704F57" },
  navText: { color: "white", fontSize: 20, fontFamily: "GlassAntica" },
  navTextActive: { color: "white" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  cookiePopup: { backgroundColor: "#FFD1D1", padding: 20, borderRadius: 15, width: "80%", maxWidth: 500, alignItems: "center" },
  cookiePopupMobile: { width: "90%" },
  cookieHeader: { fontSize: 24, fontFamily: "BrownSugar", color: "#704F57", textAlign: "center", marginBottom: 10 },
  cookieText: { fontSize: 16, fontFamily: "GlassAntica", color: "#4F4F4F", textAlign: "center", marginBottom: 20 },
  cookieLink: { color: "#704F57", textDecorationLine: "underline" },
  cookieButtonContainer: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  cookieButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  acceptButton: { backgroundColor: "#704F57" },
  declineButton: { backgroundColor: "#C9A9A6" },
  cookieButtonText: { fontSize: 16, fontFamily: "GlassAntica", color: "white", textAlign: "center" },
});