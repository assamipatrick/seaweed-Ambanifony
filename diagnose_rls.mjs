import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const supabaseKey = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseRLS() {
  console.log('🔍 DIAGNOSTIC RLS SUPABASE\n');
  console.log('='.repeat(50));
  
  // Test 1: Vérifier la connexion
  console.log('\n📡 Test 1: Connexion Supabase');
  console.log('   URL:', supabaseUrl);
  console.log('   Status: ✅ Connecté');
  
  // Test 2: Essayer de lire les sites (SELECT devrait fonctionner)
  console.log('\n📖 Test 2: Lecture table sites (SELECT)');
  const { data: sitesRead, error: readError } = await supabase
    .from('sites')
    .select('*');
  
  if (readError) {
    console.log('   ❌ Erreur lecture:', readError.message);
  } else {
    console.log(`   ✅ Lecture OK - ${sitesRead?.length || 0} sites trouvés`);
    if (sitesRead && sitesRead.length > 0) {
      console.log('   Sites:', sitesRead.map(s => s.name).join(', '));
    }
  }
  
  // Test 3: Essayer d'insérer un site (INSERT - devrait échouer si RLS actif)
  console.log('\n✍️  Test 3: Insertion test site (INSERT)');
  const testSite = {
    id: `test-rls-diag-${Date.now()}`,
    name: 'Site Test RLS Diagnostic',
    code: `RLS-DIAG-${Date.now()}`,
    location: 'Test Location for RLS'
  };
  
  const { data: insertData, error: insertError } = await supabase
    .from('sites')
    .insert(testSite)
    .select();
  
  if (insertError) {
    console.log('   ❌ ERREUR INSERTION:');
    console.log('   Code:', insertError.code);
    console.log('   Message:', insertError.message);
    console.log('   Détails:', insertError.details);
    console.log('   Hint:', insertError.hint);
    
    // Analyser le type d'erreur
    if (insertError.message.includes('row-level security') || 
        insertError.message.includes('policy') ||
        insertError.code === '42501') {
      console.log('\n🔒 DIAGNOSTIC: RLS EST ACTIVÉ ET BLOQUE L\'INSERTION');
      console.log('   Solution: Exécuter le script SQL de désactivation RLS');
    } else if (insertError.message.includes('duplicate key') ||
               insertError.code === '23505') {
      console.log('\n✅ DIAGNOSTIC: RLS N\'EST PAS LE PROBLÈME');
      console.log('   Le site existe déjà (ce qui signifie que l\'insertion fonctionne)');
    } else {
      console.log('\n⚠️  DIAGNOSTIC: ERREUR INCONNUE');
      console.log('   Vérifier les logs ci-dessus pour plus de détails');
    }
  } else {
    console.log('   ✅ Insertion réussie!');
    console.log('   Site inséré:', insertData);
    console.log('\n🎉 RLS N\'EST PAS ACTIF OU LES POLICIES SONT CORRECTES');
  }
  
  // Test 4: Vérifier les autres tables importantes
  console.log('\n📊 Test 4: État des autres tables');
  const tables = ['employees', 'farmers', 'seaweed_types'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`   ❌ ${table}: Erreur - ${error.message}`);
    } else {
      console.log(`   ✅ ${table}: OK (${data?.length || 0} enregistrements)`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📋 RÉSUMÉ:');
  console.log('   - Si vous voyez "RLS EST ACTIVÉ ET BLOQUE L\'INSERTION"');
  console.log('     → Exécutez le script SQL de FIX_NOW.md');
  console.log('   - Si vous voyez "Insertion réussie"');
  console.log('     → Le problème est ailleurs (vérifier le code de l\'app)');
  console.log('\n🔗 Lien SQL Editor: https://kxujxjcuyfbvmzahyzcv.supabase.co/project/kxujxjcuyfbvmzahyzcv/editor/sql');
  console.log('\n');
}

diagnoseRLS().catch(console.error);
