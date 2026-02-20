import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const supabaseKey = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(supabaseUrl, supabaseKey);

function toSnakeCase(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      result[snakeKey] = obj[key];
    }
  }
  return result;
}

function cleanUuidFields(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      result[key] = value === '' ? null : value;
    }
  }
  return result;
}

async function testWithEmptyString() {
  console.log('🧪 TEST AVEC CHAÎNE VIDE POUR managerId\n');
  
  // Simuler ce que le formulaire envoie
  const formData = {
    id: randomUUID(),
    name: 'Site Test Empty String',
    code: `EMPTY-${Date.now()}`,
    location: 'Test Location',
    managerId: '', // ← Chaîne vide (comme le formulaire)
  };
  
  console.log('📝 Données du formulaire:');
  console.log(formData);
  console.log('  managerId type:', typeof formData.managerId);
  console.log('  managerId value:', JSON.stringify(formData.managerId));
  
  // Appliquer le nettoyage
  const { id, ...rest } = formData;
  const cleaned = cleanUuidFields(rest);
  const snakeCase = toSnakeCase(cleaned);
  const dbSite = { id, ...snakeCase };
  
  console.log('\n📝 Après nettoyage et conversion:');
  console.log(dbSite);
  console.log('  manager_id type:', typeof dbSite.manager_id);
  console.log('  manager_id value:', dbSite.manager_id);
  
  console.log('\n⏳ Insertion...');
  const { data, error } = await supabase
    .from('sites')
    .insert([dbSite])
    .select()
    .single();
  
  if (error) {
    console.log('\n❌ ERREUR:');
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    return false;
  } else {
    console.log('\n✅ SUCCÈS !');
    console.log('   Site inséré:', data.name);
    console.log('   manager_id:', data.manager_id);
    return true;
  }
}

testWithEmptyString().then(success => {
  if (success) {
    console.log('\n🎉 Le nettoyage des chaînes vides fonctionne !');
  } else {
    console.log('\n❌ Le nettoyage ne fonctionne pas encore.');
  }
});
