import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxujxjcuyfbvmzahyzcv.supabase.co';
const supabaseKey = 'sb_publishable_ufzODkevI8XjDtRhGkgo7Q_zN6QKORd';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🧪 Testing Supabase Sites Table...\n');

async function testSites() {
  try {
    // Test 1: Fetch all sites
    console.log('Test 1: Fetching all sites...');
    const { data: sites, error } = await supabase
      .from('sites')
      .select('*');

    if (error) {
      console.error('❌ Error fetching sites:', error);
      return;
    }

    console.log(`✅ Found ${sites?.length || 0} sites`);
    
    if (sites && sites.length > 0) {
      console.log('\n📋 Sites data:');
      sites.forEach((site, index) => {
        console.log(`\n  Site ${index + 1}:`);
        console.log(`    - id: ${site.id}`);
        console.log(`    - name: ${site.name}`);
        console.log(`    - code: ${site.code || 'N/A'}`);
        console.log(`    - location: ${site.location || 'N/A'}`);
        console.log(`    - managerId: ${site.managerId || 'N/A'}`);
        console.log(`    - zones: ${site.zones ? JSON.stringify(site.zones) : 'undefined'}`);
        console.log(`    - zones is array: ${Array.isArray(site.zones)}`);
        console.log(`    - Has zones property: ${site.hasOwnProperty('zones')}`);
      });
    } else {
      console.log('⚠️  No sites found in database');
    }

    // Test 2: Check table structure
    console.log('\n\nTest 2: Checking table columns...');
    const { data: columns, error: columnsError } = await supabase
      .from('sites')
      .select('*')
      .limit(1);

    if (columns && columns.length > 0) {
      console.log('✅ Table columns:', Object.keys(columns[0]));
    }

    console.log('\n✨ Test completed successfully');

  } catch (err) {
    console.error('❌ Test failed:', err);
  }
}

testSites();
