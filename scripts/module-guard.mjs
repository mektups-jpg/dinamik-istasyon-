#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const moduleId = process.argv[2];
const specOnly = process.argv.includes('--spec-only');

const fail = [];
const warn = [];
const pass = [];

if (!moduleId) {
  console.error('Usage: npm run module:check -- <module-id> [--spec-only]');
  process.exit(2);
}

const read = (path) => readFileSync(join(root, path), 'utf8');
const rel = (path) => relative(root, path);

const meb = read('docs/MEB_ATOMLARI.md');
const queue = read('docs/DEVELOPMENT_QUEUE_10_11.md');
const registry = read('src/registry/moduleRegistry.ts');
const specPath = findSpecPath(moduleId);

if (!specPath) {
  fail.push(`Spec bulunamadı: docs/module-specs/* içinde "${moduleId}" geçmeli.`);
} else {
  pass.push(`Spec bulundu: ${rel(specPath)}`);
}

const spec = specPath ? readFileSync(specPath, 'utf8') : '';
const specTitle = spec.match(/^#\s+(.+)$/m)?.[1] ?? '';
const specScope = findSpecScope(spec);
const specAtoms = unique(specScope.match(/MAT\.\d+\.\d+\.\d+\.\d+/g) ?? []);
const specRoute = spec.match(/\/embed\/[a-z0-9/-]+/g)?.find((route) => route.includes(moduleId));
const specTurkishIssues = findTurkishDistributiveWritingIssues(spec);

if (specTurkishIssues.length > 0) {
  fail.push(`Spec içinde Türkçe üleştirme yazımı hatası: ${specTurkishIssues.join(', ')}`);
} else if (spec) {
  pass.push('Spec Türkçe üleştirme yazımı kontrolü geçti.');
}

if (specAtoms.length === 0) {
  fail.push('Spec içinde atom ID bulunamadı.');
} else {
  for (const atomId of specAtoms) {
    if (meb.includes(atomId)) pass.push(`SSOT atom doğrulandı: ${atomId}`);
    else fail.push(`SSOT içinde bulunmayan atom: ${atomId}`);
  }
}

if (specRoute) pass.push(`Spec route doğrulandı: ${specRoute}`);
else fail.push(`Spec içinde module id içeren route bulunamadı: ${moduleId}`);

if (!queue.includes(moduleId) && !(specRoute && queue.includes(specRoute)) && !(specTitle && queue.includes(stripOrderPrefix(specTitle)))) {
  warn.push(`Queue içinde "${moduleId}" açıkça geçmiyor; tablo başlığı Türkçe olabilir, manuel göz at.`);
} else {
  pass.push('Queue kaydı bulundu.');
}

const registryBlock = findRegistryBlock(registry, moduleId);
if (registryBlock) {
  pass.push('Registry kaydı bulundu.');
  const registryAtoms = unique(registryBlock.match(/MAT\.\d+\.\d+\.\d+\.\d+/g) ?? []);
  const missingInRegistry = specAtoms.filter((atomId) => !registryAtoms.includes(atomId));
  const extraInRegistry = registryAtoms.filter((atomId) => !specAtoms.includes(atomId));

  if (missingInRegistry.length === 0 && extraInRegistry.length === 0) {
    pass.push('Registry atomları spec ile eşleşiyor.');
  } else {
    if (missingInRegistry.length > 0) fail.push(`Registry içinde eksik atom: ${missingInRegistry.join(', ')}`);
    if (extraInRegistry.length > 0) fail.push(`Registry içinde spec dışı atom: ${extraInRegistry.join(', ')}`);
  }

  if (specRoute && registryBlock.includes(`path: '${specRoute}'`)) pass.push('Registry route spec ile eşleşiyor.');
  else if (specRoute) fail.push(`Registry route spec ile eşleşmiyor: ${specRoute}`);

  const registryTurkishIssues = findTurkishDistributiveWritingIssues(registryBlock);
  if (registryTurkishIssues.length > 0) {
    fail.push(`Registry içinde Türkçe üleştirme yazımı hatası: ${registryTurkishIssues.join(', ')}`);
  } else {
    pass.push('Registry Türkçe üleştirme yazımı kontrolü geçti.');
  }

  const gradeMatch = registryBlock.match(/grade:\s*(\d+)/);
  if (gradeMatch && Number(gradeMatch[1]) >= 10) pass.push(`Registry grade doğrulandı: ${gradeMatch[1]}`);
  else warn.push('Registry grade 10/11 olarak doğrulanamadı.');
} else if (!specOnly) {
  fail.push(`Registry kaydı bulunamadı: id '${moduleId}'`);
} else {
  warn.push('Spec-only modunda registry kaydı aranmadı.');
}

if (!specOnly) {
  const sourceDir = findModuleSourceDir(moduleId);
  if (!sourceDir) {
    fail.push(`Kaynak klasörü bulunamadı: src/modules/**/${moduleId}`);
  } else {
    pass.push(`Kaynak klasörü bulundu: ${rel(sourceDir)}`);
    const sourceFiles = walk(sourceDir).filter((file) => /\.(ts|tsx)$/.test(file));
    const sourceText = sourceFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
    const sourceTurkishIssues = findTurkishDistributiveWritingIssues(sourceText);
    if (sourceTurkishIssues.length > 0) {
      fail.push(`Kaynakta Türkçe üleştirme yazımı hatası: ${sourceTurkishIssues.join(', ')}`);
    } else {
      pass.push('Kaynak Türkçe üleştirme yazımı kontrolü geçti.');
    }

    const testIds = unique(spec.match(/`([a-z0-9-]+(?:-\*)?)`/g)?.map((value) => value.slice(1, -1)).filter((value) => value.includes('-')) ?? []);
    const concreteTestIds = testIds.filter((value) => !value.includes('*'));

    for (const testId of concreteTestIds) {
      if (sourceText.includes(testId)) pass.push(`Test id bulundu: ${testId}`);
      else fail.push(`Spec test id kaynakta yok: ${testId}`);
    }

    if (/\bany\b|as any/.test(sourceText)) fail.push('Kaynakta `any` kullanımı bulundu.');
    else pass.push('Kaynakta `any` kullanımı yok.');

    for (const file of sourceFiles) {
      const lines = readFileSync(file, 'utf8').split('\n').length;
      if (lines > 420) warn.push(`Dosya 420 satırı aşıyor: ${rel(file)} (${lines})`);
    }

    if (sourceText.includes('HighSchoolLabShell')) pass.push('HighSchoolLabShell kullanımı bulundu.');
    else warn.push('HighSchoolLabShell kullanımı doğrulanamadı.');

    if (sourceText.includes('aria-keyshortcuts') || sourceText.includes('Home')) pass.push('Klavye/Home QA fallback izi bulundu.');
    else warn.push('Klavye/Home QA fallback izi bulunamadı.');
  }
}

report();

function findSpecPath(id) {
  const specsDir = join(root, 'docs/module-specs');
  if (!existsSync(specsDir)) return null;
  for (const name of readdirSync(specsDir)) {
    const path = join(specsDir, name);
    if (statSync(path).isFile() && readFileSync(path, 'utf8').includes(id)) return path;
  }
  return null;
}

function findSpecScope(text) {
  const scopeMatch = text.match(/## (?:Atom Kapsamı|Kapsam)\n([\s\S]*?)(?=\n## )/);
  return scopeMatch?.[1] ?? text;
}

function findRegistryBlock(text, id) {
  const marker = `id: '${id}'`;
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return '';
  const start = text.lastIndexOf('  {', markerIndex);
  const next = text.indexOf('\n  {', markerIndex + marker.length);
  const end = next >= 0 ? next : text.indexOf('\n];', markerIndex);
  return text.slice(start, end);
}

function findModuleSourceDir(id) {
  const modulesDir = join(root, 'src/modules');
  const candidates = walkDirs(modulesDir).filter((dir) => dir.endsWith(`/${id}`));
  return candidates[0] ?? null;
}

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function walkDirs(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const dirs = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      dirs.push(path, ...walkDirs(path));
    }
  }
  return dirs;
}

function unique(values) {
  return [...new Set(values)];
}

function titleGuess(id) {
  return id.replaceAll('-', ' ');
}

function stripOrderPrefix(title) {
  return title.replace(/^\d{2}-\d{2}\s+/, '').trim();
}

function findTurkishDistributiveWritingIssues(text) {
  const issues = [];
  const pattern = /\b(\d+)['’](?:şer|şar|er|ar)(?:li|lı|lik|lık|le|la)?\b/giu;
  const correctionByNumber = {
    1: 'birer',
    2: 'ikişer',
    3: 'üçer',
    4: 'dörder',
    5: 'beşer',
    6: 'altışar',
    7: 'yedişer',
    8: 'sekizer',
    9: 'dokuzar',
    10: 'onar',
    100: 'yüzer',
    1000: 'biner',
  };

  for (const match of text.matchAll(pattern)) {
    const raw = match[0];
    const number = Number(match[1]);
    const base = correctionByNumber[number] ?? 'sayıyı yazıyla kullan';
    const suffix = raw.toLocaleLowerCase('tr-TR');
    const correction = suffix.endsWith('li') || suffix.endsWith('lı') ? `${base}li` : base;
    issues.push(`${raw} → ${correction}`);
  }

  return unique(issues);
}

function report() {
  console.log(`\nModule guard: ${moduleId}${specOnly ? ' (spec-only)' : ''}`);
  for (const item of pass) console.log(`  PASS  ${item}`);
  for (const item of warn) console.log(`  WARN  ${item}`);
  for (const item of fail) console.log(`  FAIL  ${item}`);
  console.log(`\nSummary: ${pass.length} pass, ${warn.length} warn, ${fail.length} fail`);
  process.exit(fail.length > 0 ? 1 : 0);
}
