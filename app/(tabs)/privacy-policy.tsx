import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

export default function PrivacyPolicyScreen() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 1024;
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    BrownSugar: require('../../assets/fonts/BrownSugar.ttf'),
    GlassAntica: require('../../assets/fonts/GlassAntiqua-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleBackPress = () => {
    router.replace('/'); // Redirection vers la page principale
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#704F57" />
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.privacyHeader}>POLITIQUE DE CONFIDENTIALITÉ</Text>
        <View style={styles.privacyWrapper}>
          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            1. Introduction
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Bienvenue sur le site d’Amélie Assist. Nous nous engageons à protéger votre vie privée et à respecter les
            réglementations en vigueur concernant la protection des données, notamment le Règlement Général sur la
            Protection des Données (RGPD).
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            2. Collecte des données personnelles
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Nous collectons les données suivantes lorsque vous utilisez notre site : - Nom et prénom - Adresse e-mail -
            Numéro de téléphone (facultatif) - Message envoyé via le formulaire de contact Ces données sont collectées
            uniquement lorsque vous remplissez le formulaire de contact.
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            3. Utilisation des cookies
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Ce site utilise des cookies pour améliorer votre expérience utilisateur. Les cookies sont de petits fichiers
            texte stockés sur votre appareil. Nous utilisons : - **Cookies nécessaires** : pour assurer le bon
            fonctionnement du site (par exemple, la gestion de votre consentement aux cookies). - **Cookies d’analyse** :
            pour comprendre comment vous interagissez avec notre site (si vous acceptez leur utilisation). Vous pouvez
            accepter ou refuser les cookies via la bannière de consentement affichée lors de votre première visite.
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            4. Utilisation des données
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Les données collectées sont utilisées pour : - Répondre à vos demandes via le formulaire de contact. -
            Améliorer notre site et nos services (via des analyses anonymes, si vous acceptez les cookies d’analyse). Nous
            ne partageons pas vos données avec des tiers, sauf si cela est nécessaire pour répondre à votre demande (par
            exemple, via notre service d’envoi d’e-mails).
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            5. Sécurité des données
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre tout accès
            non autorisé, perte ou altération.
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            6. Vos droits
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Vous disposez des droits suivants concernant vos données personnelles : - Droit d’accès : vous pouvez demander
            à consulter les données que nous avons sur vous. - Droit de rectification : vous pouvez demander la correction
            de données inexactes. - Droit de suppression : vous pouvez demander la suppression de vos données. - Droit
            d’opposition : vous pouvez vous opposer à l’utilisation de vos données pour certaines finalités. Pour exercer
            ces droits, contactez-nous à : contact@atouzet.ovh.
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            7. Contact
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Pour toute question concernant cette politique de confidentialité, vous pouvez nous contacter à l’adresse
            suivante : contact@atouzet.ovh.
          </Text>

          <Text style={[styles.privacyTitle, isSmallScreen && styles.privacyTitleMobile]}>
            8. Modifications de la politique
          </Text>
          <Text style={[styles.privacyText, isSmallScreen && styles.privacyTextMobile]}>
            Nous pouvons mettre à jour cette politique de confidentialité. Toute modification sera publiée sur cette
            page, et nous vous encourageons à la consulter régulièrement.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff2ed',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    marginLeft: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 18,
    fontFamily: 'GlassAntica',
    color: '#704F57',
    marginLeft: 10,
  },
  privacyHeader: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'BrownSugar',
    color: '#704F57',
    marginTop: 30,
    textAlign: 'center',
  },
  privacyWrapper: {
    width: '90%',
    maxWidth: 900,
    backgroundColor: '#f4dddb',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  privacyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'GlassAntica',
    color: '#704F57',
    marginTop: 15,
    marginBottom: 10,
  },
  privacyTitleMobile: {
    fontSize: 20,
  },
  privacyText: {
    fontSize: 18,
    fontFamily: 'GlassAntica',
    color: '#4F4F4F',
    lineHeight: 24,
    marginBottom: 10,
  },
  privacyTextMobile: {
    fontSize: 16,
    lineHeight: 22,
  },
});