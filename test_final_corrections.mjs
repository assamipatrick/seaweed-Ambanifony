#!/usr/bin/env node

/**
 * Test final de toutes les corrections appliquées
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Utilitaires
function cleanUuidFields(obj) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key] === '' ? null : obj[key];
    }
  }
  return result;
}

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

// Test 1: Sites (déjà fonctionnel)
async function testSites() {
  console.log('\n📍 Test SITES (avec correction zones)...');
  const site = {
    id: randomUUID(),
    name: 'Site Correction Finale',
    code: `SITE-FINAL-${Date.now()}`,
    location: 'Madagascar Final',
    managerId: '', // Chaîne vide → null
    zones: ['Zone 1', 'Zone 2'], // ❌ N'existe pas en DB → à retirer
  };

  const { zones, ...dbFields } = site; // Retirer zones
  const cleaned = cleanUuidFields(dbFields);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Zones retirées:', !('zones' in snakeCase));
  console.log('  ➜ managerId converti en null:', snakeCase.manager_id === null);

  const { data, error } = await supabase.from('sites').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Site créé:', data.id);
  return true;
}

// Test 2: SeaweedTypes (avec correction code + growthCycleDays)
async function testSeaweedTypes() {
  console.log('\n🌿 Test SEAWEED_TYPES (sans code ni growthCycleDays)...');
  const seaweedType = {
    id: randomUUID(),
    name: `Algue Corrigée ${Date.now()}`,
    code: 'ALG-CODE', // ❌ N'existe pas en DB → à retirer
    growthCycleDays: 60, // ❌ N'existe pas en DB → à retirer
    scientificName: 'Kappaphycus alvarezii',
    description: 'Algue test corrigée',
    wetPrice: 500,
    dryPrice: 5000,
  };

  const { code, growthCycleDays, ...dbFields } = seaweedType; // Retirer les champs invalides
  const cleaned = cleanUuidFields(dbFields);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ code retiré:', !('code' in snakeCase));
  console.log('  ➜ growthCycleDays retiré:', !('growth_cycle_days' in snakeCase));

  const { data, error } = await supabase.from('seaweed_types').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Seaweed Type créé:', data.id);
  return true;
}

// Test 3: Modules (avec correction managerId + validation)
async function testModules() {
  console.log('\n📦 Test MODULES (sans managerId, avec site_id et zone_id)...');
  
  // D'abord créer un site et une zone pour satisfaire les contraintes NOT NULL
  const site = {
    id: randomUUID(),
    name: 'Site pour Module',
    code: `SITE-MOD-${Date.now()}`,
    location: 'Madagascar',
  };
  
  const { data: siteData } = await supabase.from('sites').insert([toSnakeCase(site)]).select().single();
  if (!siteData) {
    console.log('  ❌ Impossible de créer le site parent');
    return false;
  }
  console.log('  ➜ Site parent créé:', siteData.id);
  
  // Créer une zone
  const zone = {
    id: randomUUID(),
    site_id: siteData.id,
    name: `Zone ${Date.now()}`,
    geo_points: [],
  };
  
  const { data: zoneData } = await supabase.from('zones').insert([zone]).select().single();
  if (!zoneData) {
    console.log('  ❌ Impossible de créer la zone parente');
    return false;
  }
  console.log('  ➜ Zone parente créée:', zoneData.id);
  
  // Maintenant créer le module
  const module = {
    id: randomUUID(),
    code: `MOD-${Date.now()}`,
    siteId: siteData.id,
    zoneId: zoneData.id,
    managerId: '', // ❌ N'existe pas en DB → à retirer
    lines: 10,
  };

  const { managerId, ...dbFields } = module; // Retirer managerId
  const cleaned = cleanUuidFields(dbFields);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ managerId retiré:', !('manager_id' in snakeCase));
  console.log('  ➜ site_id fourni:', !!snakeCase.site_id);
  console.log('  ➜ zone_id fourni:', !!snakeCase.zone_id);

  const { data, error } = await supabase.from('modules').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Module créé:', data.id);
  return true;
}

// Test 4: Farmers (avec validation site_id NOT NULL)
async function testFarmers() {
  console.log('\n👨‍🌾 Test FARMERS (avec site_id NOT NULL)...');
  
  // Créer un site parent
  const site = {
    id: randomUUID(),
    name: 'Site pour Farmer',
    code: `SITE-FARM-${Date.now()}`,
    location: 'Madagascar',
  };
  
  const { data: siteData } = await supabase.from('sites').insert([toSnakeCase(site)]).select().single();
  if (!siteData) {
    console.log('  ❌ Impossible de créer le site parent');
    return false;
  }
  console.log('  ➜ Site parent créé:', siteData.id);
  
  // Créer le farmer avec site_id valide
  const farmer = {
    id: randomUUID(),
    firstName: 'Jean',
    lastName: 'Cultivateur',
    code: `FARM-${Date.now()}`,
    siteId: siteData.id, // NOT NULL requis
    gender: 'Male',
    dob: '1980-01-01',
    joinDate: '2024-01-01', // NOT NULL requis
    status: 'ACTIVE',
  };

  const cleaned = cleanUuidFields(farmer);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ site_id fourni (NOT NULL):', !!snakeCase.site_id);

  const { data, error } = await supabase.from('farmers').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Farmer créé:', data.id);
  return true;
}

// Test 5: Employees (role est TEXT, pas UUID)
async function testEmployees() {
  console.log('\n👤 Test EMPLOYEES (role en TEXT)...');
  
  const employee = {
    id: randomUUID(),
    firstName: 'Marie',
    lastName: 'Employée',
    code: `EMP-${Date.now()}`,
    employeeType: 'PERMANENT',
    role: 'Manager', // TEXT, pas UUID
    category: 'Administration',
    phone: '+261340000000',
    email: 'marie@test.com',
    hireDate: '2024-01-01',
    siteId: '', // Nullable
    grossWage: 500000,
    status: 'ACTIVE',
  };

  const cleaned = cleanUuidFields(employee);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ role en TEXT:', typeof snakeCase.role === 'string');
  console.log('  ➜ site_id converti en null:', snakeCase.site_id === null);

  const { data, error } = await supabase.from('employees').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Employee créé:', data.id);
  return true;
}

// Exécution
async function runTests() {
  console.log('\n🧪 TEST FINAL DE TOUTES LES CORRECTIONS APPLIQUÉES');
  console.log('='.repeat(70));
  
  const results = {
    sites: await testSites(),
    seaweedTypes: await testSeaweedTypes(),
    modules: await testModules(),
    farmers: await testFarmers(),
    employees: await testEmployees(),
  };

  console.log('\n📊 RÉSUMÉ:');
  console.log('='.repeat(70));
  let passed = 0;
  let failed = 0;
  
  for (const [entity, success] of Object.entries(results)) {
    const status = success ? '✅ RÉUSSI' : '❌ ÉCHOUÉ';
    console.log(`  ${entity.padEnd(20)} ${status}`);
    if (success) passed++;
    else failed++;
  }

  console.log('\n' + '='.repeat(70));
  console.log(`Total: ${passed}/${Object.keys(results).length} tests réussis`);
  
  if (failed === 0) {
    console.log('\n🎉 TOUTES LES CORRECTIONS FONCTIONNENT !');
    console.log('✅ Sites: zones retiré, managerId → null');
    console.log('✅ SeaweedTypes: code et growthCycleDays retirés');
    console.log('✅ Modules: managerId retiré, site_id + zone_id validés');
    console.log('✅ Farmers: site_id NOT NULL validé');
    console.log('✅ Employees: role en TEXT (pas UUID)');
    console.log('\n🚀 L\'APPLICATION EST PRÊTE POUR LA SYNCHRONISATION COMPLÈTE');
  } else {
    console.log(`\n⚠️  ${failed} test(s) ont échoué - vérifier les corrections`);
  }
}

runTests().catch(console.error);
