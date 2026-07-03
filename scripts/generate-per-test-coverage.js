const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const nycOutputDir = path.resolve(__dirname, '../.nyc_output');
const coverageDir = path.resolve(__dirname, '../coverage/tests');
const tempDir = path.resolve(__dirname, '../.nyc_tmp');

let portalPath = path.resolve(__dirname, '../../employee-management-portal');
if (!fs.existsSync(portalPath)) {
  portalPath = path.resolve(__dirname, '../..');
}
const cleanPortalPath = portalPath.replace(/\\/g, '/');

// Clean and create target folders
if (fs.existsSync(coverageDir)) {
  fs.rmSync(coverageDir, { recursive: true, force: true });
}
fs.mkdirSync(coverageDir, { recursive: true });

// Check if .nyc_output exists
if (!fs.existsSync(nycOutputDir)) {
  console.error('Error: .nyc_output folder not found. Please run tests first.');
  process.exit(1);
}

// Read all JSON coverage files
const files = fs.readdirSync(nycOutputDir).filter(f => f.endsWith('.json'));

if (files.length === 0) {
  console.log('No coverage files found in .nyc_output/');
  process.exit(0);
}

console.log(`Generating per-test reports for ${files.length} test cases...`);

const testReports = [];

files.forEach((file, index) => {
  const filePath = path.join(nycOutputDir, file);
  // File name format: coverage-[test-name].json
  const testName = file.replace(/^coverage-/, '').replace(/\.json$/, '');
  const cleanTestName = testName.replace(/_/g, ' ').toUpperCase();

  // Create temporary directory for this specific JSON file
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy this file to temp dir
  fs.copyFileSync(filePath, path.join(tempDir, 'out.json'));

  const reportOutput = path.join(coverageDir, testName);

  try {
    const cleanTempDir = tempDir.replace(/\\/g, '/');
    const cleanReportOutput = reportOutput.replace(/\\/g, '/');
    // Run nyc report specifically for this file (cross-platform absolute paths)
    execSync(
      `npx nyc report --cwd "${cleanPortalPath}" --temp-dir "${cleanTempDir}" --reporter=html --report-dir "${cleanReportOutput}"`,
      { stdio: 'ignore' }
    );
    testReports.push({ name: cleanTestName, path: `./${testName}/index.html` });
    console.log(`[${index + 1}/${files.length}] Generated report for: ${cleanTestName}`);
  } catch (err) {
    console.error(`Failed to generate report for ${cleanTestName}:`, err.message);
  }
});

// Clean temp directory
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// Generate summary HTML landing page
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Per-Test Code Coverage Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --background: #f8fafc;
      --card: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #64748b;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --radius: 12px;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--background);
      color: var(--text);
      padding: 3rem 2rem;
      min-h-screen: 100vh;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      color: var(--text);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 0.95rem;
      color: var(--muted);
      font-weight: 500;
    }

    .list-container {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    ul {
      list-style: none;
      divide-y: 1px solid var(--border);
    }

    li {
      border-bottom: 1px solid var(--border);
      transition: background-color 0.15s ease;
    }

    li:last-child {
      border-bottom: none;
    }

    li:hover {
      background: #f1f5f9;
    }

    a {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      text-decoration: none;
      color: var(--text);
      font-size: 0.95rem;
      font-weight: 600;
      transition: color 0.15s ease;
    }

    a:hover {
      color: var(--primary);
    }

    .arrow-icon {
      font-size: 1.2rem;
      color: var(--muted);
      transition: transform 0.15s ease;
    }

    a:hover .arrow-icon {
      transform: translateX(4px);
      color: var(--primary);
    }

    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: #eff6ff;
      color: #1e40af;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 750;
      margin-right: 1rem;
      border: 1px solid #bfdbfe;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Per-Test Code Coverage Dashboard</h1>
      <p class="subtitle">Click on any test case below to open its specific line-by-line code coverage report.</p>
    </header>
    
    <div class="list-container">
      <ul>
        ${testReports
          .map(
            (r) => `
        <li>
          <a href="${r.path}" target="_blank">
            <div>
              <span class="badge">TEST CASE</span>
              <span>${r.name}</span>
            </div>
            <span class="arrow-icon">→</span>
          </a>
        </li>`
          )
          .join('\n')}
      </ul>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(coverageDir, 'index.html'), htmlContent);
console.log(`\n✓ Standalone per-test reports compiled inside coverage/tests/`);
console.log(`👉 Main index dashboard: file://${path.join(coverageDir, 'index.html')}`);
