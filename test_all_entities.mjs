#!/usr/bin/env node

/**
 * Test complet de toutes les entités avec cleanUuidFields et toSnakeCase
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Utilitaires de transformation
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

// Tests par entité
async function testSites() {
  console.log('\n📍 Test SITES...');
  const site = {
    id: randomUUID(),
    name: 'Site Test Complet',
    code: `SITE-TEST-${Date.now()}`,
    location: 'Madagascar Test',
    managerId: '', // Chaîne vide à convertir en null
  };

  const cleaned = cleanUuidFields(site);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Original:', { managerId: site.managerId, type: typeof site.managerId });
  console.log('  ➜ Cleaned:', { manager_id: snakeCase.manager_id, type: typeof snakeCase.manager_id });

  const { data, error } = await supabase.from('sites').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Site créé:', data.id);
  return true;
}

async function testEmployees() {
  console.log('\n👤 Test EMPLOYEES...');
  const employee = {
    id: randomUUID(),
    firstName: 'Jean',
    lastName: 'Dupont',
    code: `EMP-${Date.now()}`,
    type: 'PERMANENT',
    siteId: '', // Chaîne vide à convertir en null
    roleId: '', // Chaîne vide à convertir en null
  };

  const cleaned = cleanUuidFields(employee);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Original:', { siteId: employee.siteId, roleId: employee.roleId });
  console.log('  ➜ Cleaned:', { site_id: snakeCase.site_id, role_id: snakeCase.role_id });

  const { data, error } = await supabase.from('employees').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Employee créé:', data.id);
  return true;
}

async function testFarmers() {
  console.log('\n👨‍🌾 Test FARMERS...');
  const farmer = {
    id: randomUUID(),
    firstName: 'Marie',
    lastName: 'Martin',
    code: `FARM-${Date.now()}`,
    siteId: '', // Chaîne vide à convertir en null
  };

  const cleaned = cleanUuidFields(farmer);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Original:', { siteId: farmer.siteId });
  console.log('  ➜ Cleaned:', { site_id: snakeCase.site_id });

  const { data, error } = await supabase.from('farmers').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Farmer créé:', data.id);
  return true;
}

async function testSeaweedTypes() {
  console.log('\n🌿 Test SEAWEED_TYPES...');
  const seaweedType = {
    id: randomUUID(),
    name: `Algue Test ${Date.now()}`,
    code: `ALG-${Date.now()}`,
    growthCycleDays: 60,
  };

  const cleaned = cleanUuidFields(seaweedType);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Snake case:', { growth_cycle_days: snakeCase.growth_cycle_days });

  const { data, error } = await supabase.from('seaweed_types').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Seaweed Type créé:', data.id);
  return true;
}

async function testModules() {
  console.log('\n📦 Test MODULES...');
  const module = {
    id: randomUUID(),
    name: `Module Test ${Date.now()}`,
    siteId: '', // Chaîne vide à convertir en null
    managerId: '', // Chaîne vide à convertir en null
  };

  const cleaned = cleanUuidFields(module);
  const snakeCase = toSnakeCase(cleaned);
  
  console.log('  ➜ Original:', { siteId: module.siteId, managerId: module.managerId });
  console.log('  ➜ Cleaned:', { site_id: snakeCase.site_id, manager_id: snakeCase.manager_id });

  const { data, error } = await supabase.from('modules').insert([snakeCase]).select().single();
  
  if (error) {
    console.log('  ❌ Erreur:', error.code, error.message);
    return false;
  }
  
  console.log('  ✅ Module créé:', data.id);
  return true;
}

// Exécution des tests
async function runAllTests() {
  console.log('\n🧪 TEST COMPLET DES TRANSFORMATIONS POUR TOUTES LES ENTITÉS');
  console.log('='  .repeat(70));
  
  const results = {
    sites: await testSites(),
    employees: await testEmployees(),
    farmers: await testFarmers(),
    seaweedTypes: await testSeaweedTypes(),
    modules: await testModules(),
  };

  console.log('\n📊 RÉSUMÉ DES TESTS:');
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
    console.log('\n🎉 TOUS LES TESTS ONT RÉUSSI !');
    console.log('✅ cleanUuidFields() fonctionne correctement');
    console.log('✅ toSnakeCase() fonctionne correctement');
    console.log('✅ Toutes les entités peuvent être créées dans Supabase');
  } else {
    console.log(`\n⚠️  ${failed} test(s) ont échoué`);
  }
}

runAllTests().catch(console.error);
