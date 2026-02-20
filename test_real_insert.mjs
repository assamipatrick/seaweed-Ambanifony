import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const supabaseKey = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealInsert() {
  console.log('🧪 TEST D\'INSERTION RÉEL DANS SUPABASE\n');
  console.log('='.repeat(60));
  
  // Test avec un vrai UUID
  const testSite = {
    id: randomUUID(), // UUID valide
    name: 'Site Test RLS Final',
    code: `TEST-${Date.now()}`,
    location: 'Madagascar - Test RLS'
  };
  
  console.log('\n📝 Tentative d\'insertion avec:');
  console.log('   ID (UUID):', testSite.id);
  console.log('   Nom:', testSite.name);
  console.log('   Code:', testSite.code);
  console.log('   Localisation:', testSite.location);
  
  console.log('\n⏳ Insertion en cours...');
  
  const { data, error } = await supabase
    .from('sites')
    .insert([testSite])
    .select()
    .single();
  
  if (error) {
    console.log('\n❌ ERREUR D\'INSERTION:');
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    console.log('   Détails:', error.details);
    console.log('   Hint:', error.hint);
    
    // Analyser le type d'erreur
    if (error.message.includes('row-level security') || 
        error.message.includes('policy') ||
        error.code === '42501' ||
        error.message.includes('permission denied')) {
      console.log('\n🔒 LE PROBLÈME EST LE RLS !');
      console.log('   Row Level Security bloque l\'insertion');
      console.log('\n✅ SOLUTION:');
      console.log('   1. Ouvrir: https://kxujxjcuyfbvmzahyzcv.supabase.co/project/kxujxjcuyfbvmzahyzcv/editor/sql');
      console.log('   2. Exécuter le script dans FIX_NOW.md');
      console.log('   3. Réessayer ce test');
    } else if (error.code === '23505') {
      console.log('\n✅ PAS DE PROBLÈME RLS !');
      console.log('   Le site existe déjà (duplicate key)');
      console.log('   Cela signifie que l\'insertion fonctionne normalement');
    } else {
      console.log('\n⚠️  AUTRE PROBLÈME:');
      console.log('   Vérifier le message d\'erreur ci-dessus');
    }
  } else {
    console.log('\n✅ INSERTION RÉUSSIE !');
    console.log('   Site inséré:', data);
    console.log('\n🎉 RLS N\'EST PAS LE PROBLÈME !');
    console.log('   La synchronisation Supabase fonctionne correctement');
    
    // Vérifier qu'on peut bien le relire
    console.log('\n📖 Vérification: Lecture du site inséré...');
    const { data: readData, error: readError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', testSite.id)
      .single();
    
    if (readError) {
      console.log('   ❌ Erreur de lecture:', readError.message);
    } else {
      console.log('   ✅ Site relu avec succès:', readData?.name);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RÉSUMÉ:');
  console.log('   - Si "LE PROBLÈME EST LE RLS" → Exécuter le script SQL');
  console.log('   - Si "INSERTION RÉUSSIE" → Le problème est dans le code de l\'app');
  console.log('   - Si "AUTRE PROBLÈME" → Partager les logs avec l\'assistant');
  console.log('\n');
}

testRealInsert().catch(console.error);
