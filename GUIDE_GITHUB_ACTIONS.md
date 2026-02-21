# 🚀 GUIDE DÉPLOIEMENT GITHUB ACTIONS

## 📋 **Ce Qui Va Se Passer**

Après configuration, **chaque fois que vous pushez** sur GitHub :
1. ✅ GitHub Actions build automatiquement l'app
2. ✅ Déploie sur Firebase Hosting
3. ✅ Déploie les règles Firebase Database
4. ✅ Vous recevez une notification avec l'URL

**Temps total** : ~2-3 minutes par déploiement

---

## 🔧 **ÉTAPE 1 : Configurer les Secrets GitHub (5 min)**

### **1.1 : Obtenir le Service Account Firebase**

#### **Méthode A : Via Firebase Console (Recommandé)**

1. Ouvrir : https://console.firebase.google.com/project/seafarm-mntr/settings/serviceaccounts/adminsdk
2. Cliquer sur **"Generate new private key"** (Générer une nouvelle clé privée)
3. Confirmer → Un fichier JSON est téléchargé
4. **Ouvrir ce fichier** avec un éditeur de texte
5. **Copier TOUT le contenu** du fichier (du premier `{` au dernier `}`)

---

### **1.2 : Obtenir le Firebase Token**

**Sur votre machine locale**, ouvrir un terminal :

```bash
# Installer Firebase CLI globalement (si pas déjà fait)
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Générer le token
firebase login:ci
```

**Résultat** : Un token comme `1//0abc123...xyz789`

**Copier ce token** (toute la ligne)

---

### **1.3 : Ajouter les Secrets sur GitHub**

1. Ouvrir : https://github.com/assamipatrick/seaweed-Ambanifony/settings/secrets/actions

2. Cliquer sur **"New repository secret"**

3. **Ajouter Secret #1** :
   - Name : `FIREBASE_SERVICE_ACCOUNT`
   - Value : **Coller tout le contenu du fichier JSON** (étape 1.1)
   - Cliquer **"Add secret"**

4. **Ajouter Secret #2** :
   - Name : `FIREBASE_TOKEN`
   - Value : **Coller le token** (étape 1.2)
   - Cliquer **"Add secret"**

---

## ✅ **ÉTAPE 2 : Activer le Workflow**

Le workflow a déjà été créé et pushé sur GitHub. Pour le déclencher :

### **Option A : Push Automatique (Déjà fait)**

Le workflow se déclenchera automatiquement au prochain push sur `genspark_ai_developer` ou `main`.

### **Option B : Déclenchement Manuel**

1. Ouvrir : https://github.com/assamipatrick/seaweed-Ambanifony/actions
2. Cliquer sur **"Deploy to Firebase Hosting"** (dans la liste à gauche)
3. Cliquer sur **"Run workflow"** (bouton bleu)
4. Sélectionner branch `genspark_ai_developer`
5. Cliquer **"Run workflow"**

---

## 📊 **ÉTAPE 3 : Vérifier le Déploiement**

### **3.1 : Suivre le Déploiement en Direct**

1. Ouvrir : https://github.com/assamipatrick/seaweed-Ambanifony/actions
2. Cliquer sur le workflow en cours (point orange ⚪)
3. Cliquer sur **"build-and-deploy"**
4. Suivre les logs en temps réel

**Étapes visibles** :
```
✅ 📥 Checkout code (5 sec)
✅ 📦 Setup Node.js (10 sec)
✅ 🔧 Install dependencies (30 sec)
✅ 🏗️ Build application (10 sec)
✅ 🚀 Deploy to Firebase Hosting (20 sec)
✅ 📊 Deploy Firebase Database Rules (5 sec)
```

**Durée totale** : ~1-2 minutes

---

### **3.2 : Obtenir l'URL de Production**

Une fois le déploiement terminé (✅ vert) :

1. Dans les logs du workflow, chercher :
   ```
   ✔ Deploy complete!
   Hosting URL: https://seafarm-mntr.web.app
   ```

2. Ou ouvrir directement : https://console.firebase.google.com/project/seafarm-mntr/hosting/sites

---

## 🧪 **ÉTAPE 4 : Tester l'Application**

1. Ouvrir : **https://seafarm-mntr.web.app**

2. Aller dans **Paramètres → Types d'Algues**

3. **Test 1 : Ajouter**
   - Cliquer "Ajouter un Type"
   - Nom : `Test GitHub Actions`
   - Prix humide : 500
   - Prix sec : 2000
   - Sauvegarder

4. **Test 2 : Rafraîchir**
   - Appuyer sur **F5**
   - ✅ Le type doit **rester visible**

5. **Test 3 : Supprimer**
   - Supprimer "Test GitHub Actions"
   - Appuyer sur **F5**
   - ✅ Le type doit **rester supprimé**

6. **Test 4 : Firebase Console**
   - Ouvrir : https://console.firebase.google.com/project/seafarm-mntr/database/seafarm-mntr-default-rtdb/data/seaweed_types
   - ✅ Les changements doivent apparaître

---

## 🎯 **Résumé des Étapes**

| Étape | Action | Temps | Statut |
|-------|--------|-------|--------|
| 1 | Workflow créé | ✅ Fait | Commit 26f5cc3 |
| 2 | Obtenir Service Account JSON | 2 min | ⏳ À faire |
| 3 | Obtenir Firebase Token | 1 min | ⏳ À faire |
| 4 | Ajouter secrets GitHub | 2 min | ⏳ À faire |
| 5 | Déclencher workflow | 10 sec | ⏳ À faire |
| 6 | Attendre déploiement | 2 min | ⏳ Auto |
| 7 | Tester sur URL production | 2 min | ⏳ À faire |
| **TOTAL** | **~10 minutes** | | |

---

## 💡 **Commandes Rapides**

### **Obtenir Firebase Token (sur votre machine locale)**
```bash
npm install -g firebase-tools
firebase login
firebase login:ci
```

**Copier le token** qui s'affiche.

---

### **Déclencher un Nouveau Déploiement**

**Méthode 1** : Push sur GitHub
```bash
git add .
git commit -m "Update app"
git push origin genspark_ai_developer
```
→ Déploiement automatique en 2 min

**Méthode 2** : Bouton "Run workflow" sur GitHub Actions
→ https://github.com/assamipatrick/seaweed-Ambanifony/actions

---

## 🔒 **Sécurité des Secrets**

- ✅ Les secrets sont **chiffrés** par GitHub
- ✅ Ils ne sont **jamais visibles** dans les logs
- ✅ Seul le propriétaire du repo peut les voir/modifier
- ✅ GitHub Actions les injecte automatiquement pendant le déploiement

---

## 📱 **Notifications**

GitHub vous enverra un email à chaque :
- ✅ Déploiement réussi
- ❌ Déploiement échoué

Vous pouvez aussi voir l'état en temps réel sur :
https://github.com/assamipatrick/seaweed-Ambanifony/actions

---

## 🐛 **En Cas d'Erreur**

### **Erreur : "FIREBASE_SERVICE_ACCOUNT not found"**
→ Vérifier que le secret est bien ajouté sur GitHub

### **Erreur : "Permission denied"**
→ Vérifier que le Service Account a les permissions "Firebase Admin"

### **Erreur : "Build failed"**
→ Vérifier les logs dans GitHub Actions, probablement une erreur TypeScript

### **Erreur : "Deploy failed"**
→ Vérifier que le projectId dans le workflow est correct : `seafarm-mntr`

---

## 🎉 **Avantages de GitHub Actions**

✅ **Déploiement automatique** : Push → 2 min → En ligne  
✅ **Historique complet** : Voir tous les déploiements passés  
✅ **Rollback facile** : Revenir à une version précédente  
✅ **Pas besoin de machine locale** : Tout se passe sur GitHub  
✅ **Gratuit** : 2000 minutes/mois pour repos publics  

---

## 📁 **Fichiers Créés**

- `.github/workflows/deploy-firebase.yml` : Workflow de déploiement
- `GUIDE_GITHUB_ACTIONS.md` : Ce guide

---

## 🚀 **Prochaine Action**

1. ✅ Obtenir Firebase Service Account JSON (2 min)
2. ✅ Obtenir Firebase Token (1 min)
3. ✅ Ajouter les 2 secrets sur GitHub (2 min)
4. ✅ Déclencher le workflow (10 sec)
5. ✅ Attendre 2 min
6. ✅ Tester sur https://seafarm-mntr.web.app

**Total : ~10 minutes** pour avoir l'app déployée ! 🎯

---

**Document créé le** : 2026-02-21  
**Auteur** : GenSpark AI Developer  
**Branche** : genspark_ai_developer  
**Workflow** : `.github/workflows/deploy-firebase.yml`
