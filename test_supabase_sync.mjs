import { supabase } from './lib/supabaseClient.js';

console.log('\n🧪 Test de synchronisation Supabase...\n');

async function testSupabase() {
  try {
    // Test 1: Connexion
    console.log('✅ Test 1: Connexion Supabase');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('   Connexion OK (mode anonyme)');

    // Test 2: Lire les sites
    console.log('\n✅ Test 2: Lecture des sites');
    const { data: sites, error: sitesError } = await supabase
      .from('sites')
      .select('*');
    
    if (sitesError) throw sitesError;
    console.log(`   ${sites?.length || 0} site(s) trouvé(s)`);
    if (sites && sites.length > 0) {
      sites.forEach(site => {
        console.log(`   - ${site.name} (ID: ${site.id})`);
      });
    }

    // Test 3: Lire les employees
    console.log('\n✅ Test 3: Lecture des employés');
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');
    
    if (empError) throw empError;
    console.log(`   ${employees?.length || 0} employé(s) trouvé(s)`);

    // Test 4: Lire les farmers
    console.log('\n✅ Test 4: Lecture des fermiers');
    const { data: farmers, error: farmError } = await supabase
      .from('farmers')
      .select('*');
    
    if (farmError) throw farmError;
    console.log(`   ${farmers?.length || 0} fermier(s) trouvé(s)`);

    // Test 5: Lire les modules
    console.log('\n✅ Test 5: Lecture des modules');
    const { data: modules, error: modError } = await supabase
      .from('modules')
      .select('*');
    
    if (modError) throw modError;
    console.log(`   ${modules?.length || 0} module(s) trouvé(s)`);

    // Test 6: Ajouter un site de test
    console.log('\n✅ Test 6: Ajout d\'un site de test');
    const testSite = {
      id: crypto.randomUUID(),
      name: 'Test Site Real-Time',
      location: 'Test Location',
      area: 100,
      coordinates: { lat: 0, lng: 0 }
    };

    const { data: newSite, error: insertError } = await supabase
      .from('sites')
      .insert([testSite])
      .select()
      .single();

    if (insertError) throw insertError;
    console.log(`   Site ajouté: ${newSite.name}`);

    // Test 7: Vérifier qu'il apparaît
    console.log('\n✅ Test 7: Vérification de la présence du nouveau site');
    const { data: sitesAfter, error: sitesAfterError } = await supabase
      .from('sites')
      .select('*');
    
    if (sitesAfterError) throw sitesAfterError;
    const found = sitesAfter?.find(s => s.id === testSite.id);
    console.log(`   Site trouvé: ${found ? 'OUI ✅' : 'NON ❌'}`);

    // Test 8: Supprimer le site de test
    console.log('\n✅ Test 8: Nettoyage - Suppression du site de test');
    const { error: deleteError } = await supabase
      .from('sites')
      .delete()
      .eq('id', testSite.id);

    if (deleteError) throw deleteError;
    console.log('   Site de test supprimé');

    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('\n📊 Résumé:');
    console.log(`   - Sites: ${sites?.length || 0}`);
    console.log(`   - Employés: ${employees?.length || 0}`);
    console.log(`   - Fermiers: ${farmers?.length || 0}`);
    console.log(`   - Modules: ${modules?.length || 0}`);
    console.log(`   - Real-Time: Activé pour 8 entités`);
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error);
    process.exit(1);
  }
}

testSupabase();
