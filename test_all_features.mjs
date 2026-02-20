#!/usr/bin/env node

/**
 * TEST COMPLET DE TOUTES LES FONCTIONNALITÉS SEAFARM MONITOR
 */

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, update, remove } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDvJpor1k-DH-7lNq-rl-wF6xNcQ1SdHAo",
    authDomain: "seafarm-mntr.firebaseapp.com",
    databaseURL: "https://seafarm-mntr-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "seafarm-mntr",
    storageBucket: "seafarm-mntr.firebasestorage.app",
    messagingSenderId: "738426854656",
    appId: "1:738426854656:web:98c0af60ce5e696e4f0e18"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let testResults = { total: 0, passed: 0, failed: 0, errors: [] };

async function runTest(name, testFn) {
    testResults.total++;
    console.log(`\n→ ${name}`);
    try {
        await testFn();
        testResults.passed++;
        console.log(`✓ PASSED: ${name}`);
        return true;
    } catch (error) {
        testResults.failed++;
        testResults.errors.push({ test: name, error: error.message });
        console.log(`✗ FAILED: ${name} - ${error.message}`);
        return false;
    }
}

async function testSitesManagement() {
    console.log('\n## TEST 1: SITES MANAGEMENT (CRUD)');
    
    const testSiteId = 'test-site-' + Date.now();
    const testSite = {
        id: testSiteId,
        name: 'Site Test Automatique',
        code: 'TEST',
        location: '12°34\'56"S, 45°12\'34"E',
        managerId: '',
        zones: []
    };
    
    await runTest('Sites - CREATE', async () => {
        await set(ref(db, `sites/${testSiteId}`), testSite);
        const snapshot = await get(ref(db, `sites/${testSiteId}`));
        if (!snapshot.exists()) throw new Error('Site non créé');
    });
    
    await runTest('Sites - READ', async () => {
        const snapshot = await get(ref(db, `sites/${testSiteId}`));
        if (!snapshot.exists()) throw new Error('Site non trouvé');
    });
    
    await runTest('Sites - UPDATE', async () => {
        await update(ref(db, `sites/${testSiteId}`), { name: 'Site Test Modifié' });
        const snapshot = await get(ref(db, `sites/${testSiteId}`));
        if (snapshot.val().name !== 'Site Test Modifié') throw new Error('Modification échouée');
    });
    
    await runTest('Sites - DELETE', async () => {
        await remove(ref(db, `sites/${testSiteId}`));
        const snapshot = await get(ref(db, `sites/${testSiteId}`));
        if (snapshot.exists()) throw new Error('Site non supprimé');
    });
}

async function testZonesManagement() {
    console.log('\n## TEST 2: ZONES MANAGEMENT');
    
    const testZoneId = 'test-zone-' + Date.now();
    const testZone = {
        id: testZoneId,
        name: 'Zone Test',
        geoPoints: [
            '12°30\'00"S, 45°00\'00"E',
            '12°30\'30"S, 45°00\'00"E',
            '12°30\'30"S, 45°00\'30"E'
        ]
    };
    
    await runTest('Zones - CREATE avec geoPoints', async () => {
        await set(ref(db, `zones/${testZoneId}`), testZone);
        const snapshot = await get(ref(db, `zones/${testZoneId}`));
        if (!snapshot.exists()) throw new Error('Zone non créée');
    });
    
    await runTest('Zones - UPDATE ajouter geoPoint', async () => {
        const snapshot = await get(ref(db, `zones/${testZoneId}`));
        const zone = snapshot.val();
        zone.geoPoints.push('12°31\'00"S, 45°01\'00"E');
        await set(ref(db, `zones/${testZoneId}`), zone);
    });
    
    await runTest('Zones - DELETE', async () => {
        await remove(ref(db, `zones/${testZoneId}`));
        const snapshot = await get(ref(db, `zones/${testZoneId}`));
        if (snapshot.exists()) throw new Error('Zone non supprimée');
    });
}

async function testModulesManagement() {
    console.log('\n## TEST 3: MODULES MANAGEMENT');
    
    const testModuleId = 'test-module-' + Date.now();
    const testModule = {
        id: testModuleId,
        code: 'TEST-Z01-M01',
        siteId: 'test-site',
        zoneId: 'test-zone',
        lines: 10,
        poles: { galvanized: 20, wood: 10, plastic: 5 },
        status: 'free'
    };
    
    await runTest('Modules - CREATE', async () => {
        await set(ref(db, `modules/${testModuleId}`), testModule);
        const snapshot = await get(ref(db, `modules/${testModuleId}`));
        if (!snapshot.exists()) throw new Error('Module non créé');
    });
    
    await runTest('Modules - UPDATE', async () => {
        await update(ref(db, `modules/${testModuleId}`), { lines: 15 });
        const snapshot = await get(ref(db, `modules/${testModuleId}`));
        if (snapshot.val().lines !== 15) throw new Error('Modification échouée');
    });
    
    await runTest('Modules - DELETE', async () => {
        await remove(ref(db, `modules/${testModuleId}`));
        const snapshot = await get(ref(db, `modules/${testModuleId}`));
        if (snapshot.exists()) throw new Error('Module non supprimé');
    });
}

async function testEmployeesManagement() {
    console.log('\n## TEST 4: EMPLOYEES MANAGEMENT');
    
    const testEmployeeId = 'test-employee-' + Date.now();
    const testEmployee = {
        id: testEmployeeId,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.test@seafarm.com',
        phone: '+261340000000',
        role: 'technician',
        hireDate: '2026-02-20'
    };
    
    await runTest('Employees - CREATE', async () => {
        await set(ref(db, `employees/${testEmployeeId}`), testEmployee);
        const snapshot = await get(ref(db, `employees/${testEmployeeId}`));
        if (!snapshot.exists()) throw new Error('Employé non créé');
    });
    
    await runTest('Employees - DELETE', async () => {
        await remove(ref(db, `employees/${testEmployeeId}`));
        const snapshot = await get(ref(db, `employees/${testEmployeeId}`));
        if (snapshot.exists()) throw new Error('Employé non supprimé');
    });
}

async function testFarmersManagement() {
    console.log('\n## TEST 5: FARMERS MANAGEMENT');
    
    const testFarmerId = 'test-farmer-' + Date.now();
    const testFarmer = {
        id: testFarmerId,
        firstName: 'Rakoto',
        lastName: 'Test',
        phone: '+261320000000',
        address: 'Ambanifony'
    };
    
    await runTest('Farmers - CREATE', async () => {
        await set(ref(db, `farmers/${testFarmerId}`), testFarmer);
        const snapshot = await get(ref(db, `farmers/${testFarmerId}`));
        if (!snapshot.exists()) throw new Error('Agriculteur non créé');
    });
    
    await runTest('Farmers - DELETE', async () => {
        await remove(ref(db, `farmers/${testFarmerId}`));
        const snapshot = await get(ref(db, `farmers/${testFarmerId}`));
        if (snapshot.exists()) throw new Error('Agriculteur non supprimé');
    });
}

async function testExistingData() {
    console.log('\n## TEST 6: DONNÉES EXISTANTES');
    
    await runTest('Vérifier Sites existants', async () => {
        const snapshot = await get(ref(db, 'sites'));
        if (!snapshot.exists()) throw new Error('Aucun site');
        const sites = Object.values(snapshot.val());
        console.log(`   → ${sites.length} sites trouvés`);
    });
    
    await runTest('Vérifier Zones existantes', async () => {
        const snapshot = await get(ref(db, 'zones'));
        if (!snapshot.exists()) throw new Error('Aucune zone');
        const zones = Object.values(snapshot.val());
        console.log(`   → ${zones.length} zones trouvées`);
    });
    
    await runTest('Vérifier Modules existants', async () => {
        const snapshot = await get(ref(db, 'modules'));
        if (!snapshot.exists()) throw new Error('Aucun module');
        const modules = Object.values(snapshot.val());
        console.log(`   → ${modules.length} modules trouvés`);
    });
}

async function runAllTests() {
    console.log('='.repeat(80));
    console.log('SEAFARM MONITOR - TEST COMPLET AUTOMATISÉ');
    console.log('='.repeat(80));
    
    try {
        await testSitesManagement();
        await testZonesManagement();
        await testModulesManagement();
        await testEmployeesManagement();
        await testFarmersManagement();
        await testExistingData();
        
        console.log('\n' + '='.repeat(80));
        console.log('RÉSUMÉ DES TESTS');
        console.log('='.repeat(80));
        console.log(`Total: ${testResults.total}`);
        console.log(`✓ Réussis: ${testResults.passed}`);
        console.log(`✗ Échoués: ${testResults.failed}`);
        
        const successRate = ((testResults.passed / testResults.total) * 100).toFixed(2);
        console.log(`\nTaux de réussite: ${successRate}%`);
        
        if (testResults.failed > 0) {
            console.log('\nERREURS:');
            testResults.errors.forEach((err, i) => {
                console.log(`${i + 1}. ${err.test}: ${err.error}`);
            });
        }
        
        process.exit(testResults.failed === 0 ? 0 : 1);
        
    } catch (error) {
        console.error('Erreur fatale:', error.message);
        process.exit(1);
    }
}

runAllTests().catch(console.error);
