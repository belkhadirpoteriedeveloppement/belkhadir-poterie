# 🚀 DÉPLOIEMENT VERCEL - Belkhadir Poterie

## 📋 CONFIGURATION VERCEL

### **Variables d'environnement requises :**

Dans Vercel Dashboard → Project Settings → Environment Variables :

```env
# Twilio WhatsApp (OBLIGATOIRE)
TWILIO_ACCOUNT_SID=AC087502999b027a0bc8fd6e539d9acbd9
TWILIO_AUTH_TOKEN=bb6a86d44a60c99d4c9cf57bd207d5af

# Gmail SMTP (optionnel - désactivé)
GMAIL_USER=belkadi626@gmail.com
GMAIL_APP_PASSWORD=kaxjobvalqvlwjjv

# Environnement
NODE_ENV=production
```

### **Commandes de déploiement :**

```bash
# Installation dépendances Vercel
npm install @vercel/node

# Build local pour test
npm run build

# Déploiement
vercel --prod
```

## 🎯 **ÉTAPES DE DÉPLOIEMENT**

### **1. Préparer le repository**

```bash
git add .
git commit -m "feat: configuration Vercel"
git push origin neon-zone
```

### **2. Connecter à Vercel**

1. Aller sur https://vercel.com
2. "New Project" → Import GitHub repo
3. Sélectionner `BelkhadirAdnane/Potrie`
4. Branch: `neon-zone`

### **3. Configuration automatique**

- ✅ **Build Command:** `npm run build`
- ✅ **Output Directory:** `dist/spa`
- ✅ **Install Command:** `npm install`
- ✅ **Node.js Version:** 18.x

### **4. Variables d'environnement**

- Settings → Environment Variables
- Ajouter toutes les variables ci-dessus
- Appliquer à: Production + Preview + Development

### **5. Domaine personnalisé** (optionnel)

- Settings → Domains
- Ajouter: `belkhadir-poterie.com`
- Configurer DNS chez registrar

## 🔧 **AVANTAGES VERCEL vs NETLIFY**

### **Performance :**

- ✅ Edge Network global plus rapide
- ✅ Serverless Functions optimisées
- ✅ Builds plus rapides
- ✅ Cache intelligent

### **Intégration :**

- ✅ GitHub integration native
- ✅ Preview deployments automatiques
- ✅ Analytics intégrés
- ✅ Monitoring erreurs

### **Limites (plan gratuit) :**

- ✅ **Bandwidth:** 100GB/mois
- ✅ **Build time:** 6000 minutes/mois
- ✅ **Functions:** 100GB-hrs/mois
- ✅ **Requests:** 1M/mois

## 🧪 **TESTS POST-DÉPLOIEMENT**

### **URLs à tester :**

```
https://votre-site.vercel.app/
https://votre-site.vercel.app/creations
https://votre-site.vercel.app/about
https://votre-site.vercel.app/api/ping
```

### **Fonctionnalités à vérifier :**

- ✅ Navigation entre pages
- ✅ Ajout produits au panier
- ✅ Personnalisation couleurs/motifs
- ✅ Envoi commande WhatsApp
- ✅ Responsive mobile
- ✅ Vitesse de chargement

### **Test complet commande :**

1. Ajouter produit au panier
2. Remplir informations client
3. Finaliser commande
4. Vérifier réception WhatsApp (+212 675-202336)

## 📊 **MONITORING**

### **Dashboard Vercel :**

- **Functions:** Vérifier exécutions API
- **Analytics:** Trafic et performance
- **Logs:** Debugging erreurs
- **Speed Insights:** Core Web Vitals

### **Alerts à configurer :**

- Erreurs 500 API
- Latence > 2 secondes
- Échec builds
- Quota dépassé

## 🔄 **WORKFLOW DE MISE À JOUR**

### **Déploiement automatique :**

```bash
# Chaque push déclenche automatiquement :
git push origin neon-zone
# → Build automatique sur Vercel
# → Déploiement si succès
# → URL mise à jour
```

### **Preview deployments :**

```bash
# Chaque Pull Request crée automatiquement :
# → URL de preview temporaire
# → Tests avant merge
# → Validation équipe
```

## 🚨 **TROUBLESHOOTING**

### **Build échoue :**

```bash
# Local debug
npm run typecheck
npm run build

# Logs Vercel
vercel logs
```

### **API ne répond pas :**

- Vérifier variables d'environnement
- Consulter Function logs
- Tester endpoints en local

### **WhatsApp ne fonctionne pas :**

- Vérifier credentials Twilio
- Contrôler Function timeouts
- Examiner error logs

## 🎉 **RÉSULTAT FINAL**

**Site de production 100% fonctionnel :**

- ✅ Performance optimisée
- ✅ WhatsApp intégré
- ✅ Déploiement automatique
- ✅ Monitoring intégré
- ✅ Domaine personnalisé
- ✅ SSL automatique

**Le site Belkhadir Poterie est maintenant prêt pour la production sur Vercel ! 🏺✨**
