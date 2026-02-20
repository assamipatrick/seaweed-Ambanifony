import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const supabaseKey = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: Transform camelCase keys to snake_case
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

async function testWithManagerId() {
  console.log('🧪 TEST AVEC MANAGER_ID\n');
  
  // Test avec managerId (camelCase)
  const testSite = {
    id: randomUUID(),
    name: 'Site Test Manager ID',
    code: `MGR-${Date.now()}`,
    location: 'Madagascar Test',
    managerId: null, // camelCase
  };
  
  console.log('📝 Objet TypeScript (camelCase):');
  console.log(testSite);
  
  // Convertir en snake_case
  const { id, ...rest } = testSite;
  const snakeCaseFields = toSnakeCase(rest);
  const dbSite = { id, ...snakeCaseFields };
  
  console.log('\n📝 Objet pour Supabase (snake_case):');
  console.log(dbSite);
  
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
    console.log('   ID:', data.id);
    return true;
  }
}

testWithManagerId().then(success => {
  if (success) {
    console.log('\n🎉 Le mapping camelCase->snake_case fonctionne !');
  } else {
    console.log('\n❌ Le mapping ne fonctionne pas encore.');
  }
});
