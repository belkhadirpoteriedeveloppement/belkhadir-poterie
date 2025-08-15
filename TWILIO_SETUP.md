# Configuration Twilio WhatsApp - Belkhadir Poterie

## Vue d'ensemble
Cette configuration permet d'envoyer automatiquement les nouvelles commandes au vendeur via WhatsApp en utilisant l'API Twilio.

## Prérequis
1. Compte Twilio actif : https://console.twilio.com/
2. WhatsApp Business API activé sur Twilio
3. Numéro WhatsApp vérifié pour le vendeur

## Configuration des variables d'environnement

### Étape 1: Obtenir les credentials Twilio
1. Connectez-vous à la console Twilio
2. Naviguez vers **Account Dashboard**
3. Notez votre `Account SID` et `Auth Token`

### Étape 2: Configurer WhatsApp
1. Dans la console Twilio, allez dans **Messaging > Try it out > Send a WhatsApp message**
2. Suivez les instructions pour configurer votre sandbox WhatsApp
3. Notez le numéro WhatsApp Twilio fourni (ex: +14155238886)

### Étape 3: Variables d'environnement

#### Pour Netlify (Production)
Dans les paramètres de votre site Netlify :
1. Allez dans **Site settings > Environment variables**
2. Ajoutez ces variables :

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=whatsapp:+14155238886
TWILIO_TO_NUMBER=whatsapp:+212675202336
```

#### Pour développement local
1. Copiez `.env.example` vers `.env`
2. Remplissez avec vos vraies credentials :

```bash
cp .env.example .env
# Puis éditez .env avec vos credentials
```

## Numéros WhatsApp

### TWILIO_FROM_NUMBER
- **Sandbox**: `whatsapp:+14155238886` (gratuit, limité)
- **Production**: Votre numéro WhatsApp Business vérifié

### TWILIO_TO_NUMBER
- Numéro WhatsApp du vendeur qui recevra les notifications
- Format: `whatsapp:+212675202336`
- Doit être vérifié dans le sandbox Twilio

## Test de la configuration

### Mode simulation (sans credentials)
- Les messages sont affichés dans les logs serveur
- Aucun message WhatsApp réel n'est envoyé
- Parfait pour le développement

### Mode production (avec credentials)
- Messages WhatsApp réels envoyés au vendeur
- Logs détaillés pour traçabilité
- Gestion d'erreurs complète

## Format des notifications vendeur

Chaque commande génère un message structuré contenant :
- **Informations client** : nom, téléphone, email, adresse
- **Détails articles** : nom, taille, motif, couleurs, quantité, prix
- **Total de la commande**
- **Délai de livraison** et informations logistiques
- **Action requise** : contacter le client

## Limites et considérations

### Limites Twilio Sandbox
- 24h de validité pour chaque numéro vérifié
- Messages limités aux numéros pré-vérifiés
- Préfixe automatique "Sent from your Twilio trial account"

### Production WhatsApp Business
- Numéro WhatsApp Business vérifié requis
- Pas de limitation de destinataires
- Messages professionnels sans préfixe

### Limites des messages
- Maximum 1600 caractères par message WhatsApp
- Le système tronque automatiquement si nécessaire
- Alertes dans les logs si dépassement

## Dépannage

### "Twilio credentials not found"
- Vérifiez que `TWILIO_ACCOUNT_SID` et `TWILIO_AUTH_TOKEN` sont définis
- Redémarrez le serveur après ajout des variables

### "Failed to send WhatsApp message"
- Vérifiez que le numéro destinataire est au bon format
- Confirmez que le numéro est vérifié dans Twilio sandbox
- Vérifiez les logs détaillés pour l'erreur exacte

### Messages non reçus
- Vérifiez que WhatsApp est configuré sur le téléphone du vendeur
- Confirmez que le numéro est actif et accepte les messages
- Testez d'abord avec le sandbox Twilio

## Support
- Documentation Twilio : https://www.twilio.com/docs/whatsapp
- Console Twilio : https://console.twilio.com/
- Support Twilio : https://support.twilio.com/
