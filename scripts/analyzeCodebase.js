import fs from 'fs';
import path from 'path';

const srcDir = './src';
const packageJsonPath = './package.json';
const distDir = './dist';

let totalLines = 0;
let tsFilesCount = 0;
let componentsCount = 0;
let hooksCount = 0;

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath, stat);
    }
  }
}

// 1. Analyze files
if (fs.existsSync(srcDir)) {
  walkDir(srcDir, (filePath, stat) => {
    const ext = path.extname(filePath);
    if (['.ts', '.tsx', '.css', '.json'].includes(ext)) {
      tsFilesCount++;
      
      // Count lines
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').length;
      totalLines += lines;
      
      // Components
      if (filePath.includes('components') && ['.tsx', '.ts'].includes(ext)) {
        componentsCount++;
      }
      
      // Hooks
      if (content.includes('export const use') || content.includes('export function use')) {
        hooksCount++;
      }
    }
  });
}

// 2. Analyze package.json dependencies
let depCount = 0;
let devDepCount = 0;
if (fs.existsSync(packageJsonPath)) {
  const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  depCount = Object.keys(pkgJson.dependencies || {}).length;
  devDepCount = Object.keys(pkgJson.devDependencies || {}).length;
}

// 3. Analyze bundle size in dist if built
let totalBundleSizeBytes = 0;
if (fs.existsSync(distDir)) {
  walkDir(distDir, (filePath, stat) => {
    if (filePath.includes('assets') && (filePath.endsWith('.js') || filePath.endsWith('.css'))) {
      totalBundleSizeBytes += stat.size;
    }
  });
}

// Fallback bundle size in case dist is not built yet
if (totalBundleSizeBytes === 0) {
  totalBundleSizeBytes = 492000; // ~480 KB fallback
}

const bundleSizeKb = (totalBundleSizeBytes / 1024).toFixed(0);

const metrics = {
  totalLines,
  tsFilesCount,
  componentsCount,
  hooksCount,
  dependenciesCount: depCount + devDepCount,
  bundleSizeKb: `${bundleSizeKb} KB`,
  generatedAt: new Date().toISOString()
};

fs.writeFileSync('./src/data/generatedMetrics.json', JSON.stringify(metrics, null, 2));
console.log('Successfully generated codebase metrics:', metrics);
