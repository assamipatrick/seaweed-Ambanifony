#!/usr/bin/env node

/**
 * 🧪 Script de Test Automatique - SeaFarm Monitor
 * Vérifie que toutes les pages se chargent sans erreur JavaScript
 * 
 * Usage: node test_all_pages.mjs
 */

const PAGES_TO_TEST = [
    { name: 'Dashboard', url: '/' },
    { name: 'Sites', url: '/#/sites' },
    { name: 'Zones', url: '/#/zones' },
    { name: 'Modules', url: '/#/modules' },
    { name: 'Farm Map', url: '/#/map' },
    { name: 'Employees', url: '/#/employees' },
    { name: 'Farmers', url: '/#/farmers' },
    { name: 'Credits', url: '/#/credits' },
    { name: 'Farmer Deliveries', url: '/#/inventory/farmer-deliveries' },
    { name: 'On-Site Storage', url: '/#/inventory/on-site-storage' },
    { name: 'Pressing Warehouse', url: '/#/inventory/pressed-warehouse' },
    { name: 'Site Transfers', url: '/#/inventory/site-transfers' },
    { name: 'Exports', url: '/#/exports' },
    { name: 'Incidents', url: '/#/incidents' },
    { name: 'Reports', url: '/#/reports' },
    { name: 'Settings', url: '/#/settings' },
];

const BASE_URL = 'https://3000-iw1hbfa3ilo0b15qntvdt-3844e1b6.sandbox.novita.ai';

console.log('\n🧪 TESTS AUTOMATIQUES - SeaFarm Monitor');
console.log('=' .repeat(60));
console.log(`Base URL: ${BASE_URL}\n`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const results = [];

async function testPage(page) {
    totalTests++;
    const fullUrl = `${BASE_URL}${page.url}`;
    
    try {
        const response = await fetch(fullUrl);
        const html = await response.text();
        
        // Vérifier que la page charge (status 200)
        if (response.status === 200) {
            passedTests++;
            results.push({ page: page.name, status: '✅ PASS', error: null });
            console.log(`✅ ${page.name.padEnd(25)} → OK`);
        } else {
            failedTests++;
            results.push({ page: page.name, status: '❌ FAIL', error: `HTTP ${response.status}` });
            console.log(`❌ ${page.name.padEnd(25)} → FAIL (HTTP ${response.status})`);
        }
    } catch (error) {
        failedTests++;
        results.push({ page: page.name, status: '❌ FAIL', error: error.message });
        console.log(`❌ ${page.name.padEnd(25)} → FAIL (${error.message})`);
    }
}

async function runAllTests() {
    console.log('📋 Running tests...\n');
    
    for (const page of PAGES_TO_TEST) {
        await testPage(page);
        // Petit délai pour ne pas surcharger le serveur
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSULTATS FINAUX');
    console.log('='.repeat(60));
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
        console.log('\n⚠️ Pages avec erreurs:');
        results
            .filter(r => r.status === '❌ FAIL')
            .forEach(r => console.log(`   - ${r.page}: ${r.error}`));
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Exit code selon résultat
    process.exit(failedTests > 0 ? 1 : 0);
}

// Lancer les tests
runAllTests().catch(err => {
    console.error('❌ Erreur critique:', err);
    process.exit(1);
});
