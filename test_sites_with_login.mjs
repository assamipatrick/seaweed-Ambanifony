import { chromium } from 'playwright';

(async () => {
  console.log('🚀 Starting SeaFarm Sites Page Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Capture console logs
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR] ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️  [CONSOLE WARN] ${text}`);
    } else if (text.includes('[sites]') || text.includes('Supabase')) {
      console.log(`💬 [CONSOLE] ${text}`);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.log(`❌ [PAGE ERROR] ${error.message}`);
    console.log(error.stack);
  });

  const appUrl = 'https://3000-iw1hbfa3ilo0b15qntvdt-3844e1b6.sandbox.novita.ai';

  try {
    // Step 1: Go to login page
    console.log('📍 Step 1: Loading login page...');
    await page.goto(`${appUrl}/#/login`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    console.log('✅ Login page loaded\n');

    // Step 2: Login
    console.log('📍 Step 2: Logging in as admin@seafarm.com...');
    await page.fill('input[type="email"]', 'admin@seafarm.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    console.log(`Current URL after login: ${currentUrl}`);
    
    if (currentUrl.includes('/dashboard') || currentUrl.includes('#/')) {
      console.log('✅ Login successful\n');
    } else {
      console.log('⚠️  Login might have failed\n');
    }

    // Step 3: Navigate to Sites page
    console.log('📍 Step 3: Navigating to Sites page...');
    await page.goto(`${appUrl}/#/sites`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    const sitesUrl = page.url();
    console.log(`Current URL: ${sitesUrl}`);

    // Step 4: Check if page is blank
    console.log('\n📍 Step 4: Checking page content...');
    
    const bodyText = await page.textContent('body');
    const hasContent = bodyText && bodyText.trim().length > 100;
    
    if (hasContent) {
      console.log(`✅ Page has content (${bodyText.trim().length} characters)`);
    } else {
      console.log(`❌ Page appears to be blank or has minimal content (${bodyText?.trim().length || 0} characters)`);
    }

    // Check for specific elements
    const hasH1 = await page.locator('h1').count() > 0;
    const hasButton = await page.locator('button').count() > 0;
    const hasTable = await page.locator('table, .grid').count() > 0;

    console.log(`  - Has H1 heading: ${hasH1 ? '✅' : '❌'}`);
    console.log(`  - Has buttons: ${hasButton ? '✅' : '❌'}`);
    console.log(`  - Has table/grid: ${hasTable ? '✅' : '❌'}`);

    // Try to find the page title
    const pageTitle = await page.textContent('h1').catch(() => null);
    if (pageTitle) {
      console.log(`  - Page title: "${pageTitle}"`);
    }

    // Check for error messages
    const errorElements = await page.locator('.error, .alert-error, [role="alert"]').count();
    if (errorElements > 0) {
      console.log(`⚠️  Found ${errorElements} error element(s) on page`);
      const errorText = await page.locator('.error, .alert-error, [role="alert"]').first().textContent();
      console.log(`  Error text: ${errorText}`);
    }

    // Screenshot
    console.log('\n📸 Taking screenshot...');
    await page.screenshot({ path: '/tmp/sites_page_test.png', fullPage: true });
    console.log('✅ Screenshot saved to /tmp/sites_page_test.png');

    // Final verdict
    console.log('\n🎯 Final Verdict:');
    if (!sitesUrl.includes('/sites')) {
      console.log('❌ FAILED: Page was redirected away from /sites');
      console.log(`   Current URL: ${sitesUrl}`);
    } else if (!hasContent) {
      console.log('❌ FAILED: Page is blank (white screen)');
    } else if (!hasH1) {
      console.log('⚠️  WARNING: Page loaded but missing main heading');
    } else {
      console.log('✅ SUCCESS: Sites page loaded correctly');
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error);
  } finally {
    await browser.close();
    console.log('\n✨ Test completed');
  }
})();
