#!/usr/bin/env node

/**
 * Test Firebase Configuration and Connection
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB58GKPIQvikVbaEeiyGNZHrtzFPRgb1UE",
  authDomain: "seafarm-mntr.firebaseapp.com",
  databaseURL: "https://seafarm-mntr-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "seafarm-mntr",
  storageBucket: "seafarm-mntr.firebasestorage.app",
  messagingSenderId: "860357255311",
  appId: "1:860357255311:web:00d1f44c1940c3a64f50fa"
};

console.log('\n=== TEST DE CONFIGURATION FIREBASE ===');
console.log('=' .repeat(70));

try {
  // Initialize Firebase
  console.log('\n[1/5] Initialisation de Firebase...');
  const app = initializeApp(firebaseConfig);
  console.log('      OK - Firebase initialise');
  
  // Initialize Database
  console.log('\n[2/5] Connexion a Realtime Database...');
  const database = getDatabase(app);
  console.log('      OK - Database connectee');
  
  // Test d'écriture
  console.log('\n[3/5] Test d\'ecriture...');
  const testRef = ref(database, 'test/connection');
  await set(testRef, {
    timestamp: Date.now(),
    message: 'Test de connexion Firebase',
    status: 'success'
  });
  console.log('      OK - Ecriture reussie');
  
  // Test de lecture
  console.log('\n[4/5] Test de lecture...');
  const snapshot = await get(testRef);
  if (snapshot.exists()) {
    console.log('      OK - Lecture reussie');
    console.log('      Donnees:', JSON.stringify(snapshot.val(), null, 2));
  } else {
    console.log('      WARN - Aucune donnee trouvee');
  }
  
  // Test de synchronisation temps réel
  console.log('\n[5/5] Test de synchronisation temps reel...');
  const sitesRef = ref(database, 'sites');
  
  onValue(sitesRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const count = Object.keys(data).length;
      console.log(`      OK - ${count} site(s) detecte(s) en temps reel`);
    } else {
      console.log('      INFO - Aucun site dans la base (normal pour une nouvelle DB)');
    }
    
    // Cleanup
    off(sitesRef);
    
    console.log('\n' + '='.repeat(70));
    console.log('SUCCESS - TOUS LES TESTS FIREBASE ONT REUSSI !');
    console.log('='.repeat(70));
    console.log('\nProchaines etapes :');
    console.log('  1. Demarrer l\'application : npm run dev');
    console.log('  2. Se connecter : admin@seafarm.com / password');
    console.log('  3. Ajouter un site et verifier dans Firebase Console');
    console.log('\n');
    
    process.exit(0);
  }, (error) => {
    console.error('      ERROR - Erreur de synchronisation:', error.message);
    console.error('\nCauses possibles :');
    console.error('  - Realtime Database pas activee dans Firebase Console');
    console.error('  - Regles de securite trop restrictives');
    console.error('  - URL de la database incorrecte');
    console.error('\nSolution :');
    console.error('  1. Aller sur https://console.firebase.google.com/project/seafarm-mntr/database');
    console.error('  2. Cliquer sur "Create Database"');
    console.error('  3. Choisir "Start in test mode"');
    console.error('  4. Copier l\'URL de la database et la mettre dans .env.local\n');
    process.exit(1);
  });
  
} catch (error) {
  console.error('\nERROR:', error.message);
  console.error('\nCauses possibles :');
  console.error('  - Credentials Firebase invalides ou manquantes');
  console.error('  - Realtime Database pas activee dans Firebase Console');
  console.error('  - Connexion internet indisponible');
  console.error('\nSolution :');
  console.error('  Voir NEXT_STEP_ACTIVATE_RTDB.md pour activer Realtime Database\n');
  process.exit(1);
}
