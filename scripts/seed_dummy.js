/**
 * Dummy Data Seed Script
 * Creates sample users, KPIs, trends, alerts, integrations, and content for testing
 *
 * Usage: node scripts/seed_dummy.js [profile]
 * - profile: 'minimal' or 'full' (default: 'full')
 */

const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig);

// Sample data
const SAMPLE_USERS = [
  {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'Admin',
    password: 'admin123',
  },
  {
    email: 'owner@example.com',
    name: 'Account Owner',
    role: 'Owner',
    password: 'owner123',
  },
  {
    email: 'analyst@example.com',
    name: 'Data Analyst',
    role: 'Analyst',
    password: 'analyst123',
  },
  {
    email: 'viewer@example.com',
    name: 'Viewer User',
    role: 'Viewer',
    password: 'viewer123',
  },
];

const SAMPLE_HASHTAGS = [
  '#flashsale',
  '#newarrival',
  '#trending',
  '#viral',
  '#hotdeal',
  '#fashion',
  '#beauty',
  '#tech',
  '#lifestyle',
  '#fitness',
  '#foodie',
  '#travel',
  '#gaming',
  '#music',
  '#art',
];

const SAMPLE_PLATFORMS = [
  'TikTok',
  'Instagram',
  'Shopee',
  'Lazada',
  'Facebook',
];
const SAMPLE_REGIONS = ['North', 'South', 'East', 'West', 'Central'];

async function generateUsers() {
  console.log('🔐 Creating users...');
  const users = [];

  for (const userData of SAMPLE_USERS) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await db('users')
      .insert({
        email: userData.email,
        name: userData.name,
        password_hash: hashedPassword,
        role: userData.role,
        status: 'active',
      })
      .returning('id');

    const userId = result.id;

    // Create user preferences
    await db('user_preferences').insert({
      user_id: userId,
      language: 'EN',
      timezone: 'UTC',
      two_fa_enabled: false,
    });

    users.push({ id: userId, ...userData });
    console.log(`  ✓ Created ${userData.role}: ${userData.email}`);
  }

  return users;
}

async function generateKPIs(projectId, days = 30) {
  console.log('📊 Creating KPI records...');
  const kpis = [];
  const metrics = ['revenue', 'trend_score', 'sentiment'];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    for (const metric of metrics) {
      let value;
      if (metric === 'revenue') {
        value = 100000 + Math.random() * 50000;
      } else if (metric === 'trend_score') {
        value = 60 + Math.random() * 30;
      } else {
        value = 0.5 + Math.random() * 0.4;
      }

      kpis.push({
        metric,
        value: value.toFixed(2),
        timestamp: date.toISOString(),
        project_id: projectId,
      });
    }
  }

  await db('kpis').insert(kpis);
  console.log(`  ✓ Created ${kpis.length} KPI records`);
}

async function generateTrends(projectId, count = 50) {
  console.log('🔥 Creating trends...');
  const trends = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 10));

    trends.push({
      hashtag:
        SAMPLE_HASHTAGS[Math.floor(Math.random() * SAMPLE_HASHTAGS.length)],
      mentions: Math.floor(1000 + Math.random() * 10000),
      sentiment: (0.3 + Math.random() * 0.6).toFixed(2),
      date: date.toISOString().split('T')[0],
      project_id: projectId,
      platform:
        SAMPLE_PLATFORMS[Math.floor(Math.random() * SAMPLE_PLATFORMS.length)],
      region: SAMPLE_REGIONS[Math.floor(Math.random() * SAMPLE_REGIONS.length)],
    });
  }

  await db('trends').insert(trends);
  console.log(`  ✓ Created ${trends.length} trend records`);
}

async function generateAlerts(users) {
  console.log('🔔 Creating alerts...');
  const alerts = [];

  for (let i = 0; i < 10; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    alerts.push({
      user_id: user.id,
      type: ['trend', 'kpi', 'system'][Math.floor(Math.random() * 3)],
      target:
        SAMPLE_HASHTAGS[Math.floor(Math.random() * SAMPLE_HASHTAGS.length)],
      threshold: (1000 + Math.random() * 9000).toFixed(0),
      channel: ['email', 'in_app'][Math.floor(Math.random() * 2)],
      muted: Math.random() > 0.7,
      is_read: Math.random() > 0.5,
      message: 'Alert threshold reached for target',
    });
  }

  await db('alerts').insert(alerts);
  console.log(`  ✓ Created ${alerts.length} alerts`);
}

async function generateIntegrations(projectId) {
  console.log('🔗 Creating integrations...');
  const integrations = [
    {
      project_id: projectId,
      provider: 'TikTok',
      status: 'connected',
      last_sync: new Date(Date.now() - 3600000).toISOString(),
      config: JSON.stringify({ api_version: 'v1' }),
    },
    {
      project_id: projectId,
      provider: 'Shopee',
      status: 'disconnected',
      last_sync: null,
      config: JSON.stringify({}),
    },
    {
      project_id: projectId,
      provider: 'Google Analytics',
      status: 'connected',
      last_sync: new Date(Date.now() - 7200000).toISOString(),
      config: JSON.stringify({ property_id: '12345' }),
    },
    {
      project_id: projectId,
      provider: 'POS System',
      status: 'error',
      last_sync: new Date(Date.now() - 86400000).toISOString(),
      config: JSON.stringify({ endpoint: 'https://api.pos.example.com' }),
    },
    {
      project_id: projectId,
      provider: 'Instagram',
      status: 'connected',
      last_sync: new Date(Date.now() - 1800000).toISOString(),
      config: JSON.stringify({ business_account_id: '67890' }),
    },
  ];

  await db('integrations').insert(integrations);
  console.log(`  ✓ Created ${integrations.length} integrations`);
}

async function generateContent(users) {
  console.log('📝 Creating content calendar entries...');
  const content = [];

  for (let i = 0; i < 15; i++) {
    const user = users[Math.floor(Math.random() * 3)]; // Only Admin, Owner, Analyst
    const scheduledDate = new Date();
    scheduledDate.setDate(
      scheduledDate.getDate() + Math.floor(Math.random() * 30),
    );

    content.push({
      user_id: user.id,
      content: `Sample post content for ${SAMPLE_PLATFORMS[Math.floor(Math.random() * SAMPLE_PLATFORMS.length)]}. Check out our latest ${SAMPLE_HASHTAGS[Math.floor(Math.random() * SAMPLE_HASHTAGS.length)]}!`,
      scheduled_at: scheduledDate.toISOString(),
      platform:
        SAMPLE_PLATFORMS[Math.floor(Math.random() * SAMPLE_PLATFORMS.length)],
      status: ['draft', 'scheduled', 'published'][
        Math.floor(Math.random() * 3)
      ],
      tone: ['Professional', 'Casual', 'Trendy'][Math.floor(Math.random() * 3)],
    });
  }

  await db('content_calendar').insert(content);
  console.log(`  ✓ Created ${content.length} content calendar entries`);
}

async function generateAuditLogs(users) {
  console.log('📋 Creating audit logs...');
  const logs = [];
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'APPLY', 'EXPORT'];
  const resources = ['user', 'dashboard', 'trend', 'report', 'integration'];

  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    logs.push({
      user_id: user.id,
      action: actions[Math.floor(Math.random() * actions.length)],
      resource: resources[Math.floor(Math.random() * resources.length)],
      resource_id: Math.floor(Math.random() * 100),
      details: JSON.stringify({ note: 'Sample audit log entry' }),
      ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
      user_agent: 'Mozilla/5.0 (Test User Agent)',
    });
  }

  await db('audit_logs').insert(logs);
  console.log(`  ✓ Created ${logs.length} audit log entries`);
}

async function clearExistingData() {
  console.log('🗑️  Clearing existing seed data...');

  await db('audit_logs').del();
  await db('content_calendar').del();
  await db('report_schedules').del();
  await db('reports').del();
  await db('uploaded_files').del();
  await db('integrations').del();
  await db('alerts').del();
  await db('trends').del();
  await db('kpis').del();
  await db('user_preferences').del();
  await db('sessions').del();
  await db('users').del();

  console.log('  ✓ Cleared all seed data');
}

async function seedData(profile = 'full') {
  try {
    console.log(`\n🌱 Starting seed process (profile: ${profile})...\n`);

    // Clear existing data
    await clearExistingData();

    // Generate users
    const users = await generateUsers();

    // Get or use default project ID (assuming project_id 1 exists or is null)
    const projectId = 1;

    // Generate KPIs
    if (profile === 'full') {
      await generateKPIs(projectId, 30);
      await generateTrends(projectId, 50);
    } else {
      await generateKPIs(projectId, 7);
      await generateTrends(projectId, 20);
    }

    // Generate alerts
    await generateAlerts(users);

    // Generate integrations
    await generateIntegrations(projectId);

    // Generate content
    if (profile === 'full') {
      await generateContent(users);
      await generateAuditLogs(users);
    }

    console.log('\n✅ Seed completed successfully!\n');
    console.log('📧 Test Accounts:');
    console.log('  Admin:   admin@example.com / admin123');
    console.log('  Owner:   owner@example.com / owner123');
    console.log('  Analyst: analyst@example.com / analyst123');
    console.log('  Viewer:  viewer@example.com / viewer123\n');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Execute
const profile = process.argv[2] || 'full';
seedData(profile)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
