#!/usr/bin/env node

/**
 * Generates resume.md from resume.json (single source of truth).
 * 
 * Usage: node scripts/generate-resume-md.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'resume.json');
const OUTPUT = path.join(ROOT, 'resume.md');

const data = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

function calculateYearsOfExperience() {
  const now = new Date();
  let years = now.getFullYear() - data.experienceStartYear;
  // experienceStartMonth is 1-indexed (3 = March)
  if (now.getMonth() + 1 < data.experienceStartMonth) {
    years--;
  }
  return years;
}

function buildMarkdown() {
  const years = calculateYearsOfExperience();
  const lines = [];

  // Header
  lines.push(`# ${data.meta.name}`);
  lines.push('');
  lines.push(`${data.meta.title} | ${data.meta.subtitle}`);
  lines.push('');

  // Contact & social
  const socialLinks = data.meta.social.map((s, i) => {
    return `[![${s.platform}][image${i + 1}]](${s.url})`;
  }).join(' ');
  lines.push(`${data.meta.location} | [${data.meta.email}](mailto:${data.meta.email})  `);
  lines.push(socialLinks);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Profile
  const profileText = data.profile.replace('{years}', String(years));
  lines.push('## Profile');
  lines.push('');
  lines.push(profileText);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Skills
  lines.push('## Skills');
  lines.push('');
  const skillEntries = Object.entries(data.skills);
  skillEntries.forEach(([category, skills], i) => {
    const trailing = i < skillEntries.length - 1 ? '  ' : '';
    lines.push(`**${category}:** ${skills.join(', ')}${trailing}`);
  });
  lines.push('');
  lines.push('---');
  lines.push('');

  // Experience
  lines.push('## Experience');
  lines.push('');
  for (const job of data.experience) {
    lines.push(`### ${job.company} — ${job.location}`);
    lines.push(`**${job.role}** | *${job.period}*`);
    lines.push('');
    lines.push(`* ${job.description}`);
    for (const h of job.highlights) {
      lines.push(`* ${h}`);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');

  // Education
  lines.push('## Education');
  lines.push('');
  for (const edu of data.education) {
    lines.push(`### ${edu.school}`);
    lines.push(`**${edu.degree}** | *${edu.period}*`);
    lines.push('');
  }

  // Image references (for social icons in markdown)
  data.meta.social.forEach((s, i) => {
    lines.push(`[image${i + 1}]: ${s.icon}`);
  });
  lines.push('');

  return lines.join('\n');
}

const md = buildMarkdown();
fs.writeFileSync(OUTPUT, md, 'utf-8');
console.log(`✅ Generated ${path.relative(ROOT, OUTPUT)} (${md.length} bytes)`);
