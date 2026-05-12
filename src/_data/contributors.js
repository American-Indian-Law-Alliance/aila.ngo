import { execFileSync } from 'node:child_process';

const coAuthorPattern = /^co-authored-by:\s*(.+?)\s*<([^>]+)>/gim;
const githubNoReplyPattern = /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/i;

function githubUsernameFromEmail(email) {
  const match = email.match(githubNoReplyPattern);
  return match?.[1] ?? null;
}

function isBot(name, email) {
  return /\[bot\]$/i.test(name) || /\[bot\]@users\.noreply\.github\.com$/i.test(email);
}

function preferDisplayName(current, next) {
  if (!current) return next;
  if (current.includes(' ') && !next.includes(' ')) return current;
  if (!current.includes(' ') && next.includes(' ')) return next;
  return current.length >= next.length ? current : next;
}

function addContributor(contributors, name, email, role) {
  const normalizedEmail = email.trim().toLowerCase();
  const displayName = name.trim();

  if (!displayName || !normalizedEmail || isBot(displayName, normalizedEmail)) {
    return;
  }

  const existing = contributors.get(normalizedEmail) ?? {
    name: displayName,
    email: normalizedEmail,
    github: githubUsernameFromEmail(normalizedEmail),
    roles: new Set(),
  };

  existing.name = preferDisplayName(existing.name, displayName);
  existing.github ??= githubUsernameFromEmail(normalizedEmail);
  existing.roles.add(role);
  contributors.set(normalizedEmail, existing);
}

function getGitContributors() {
  const contributors = new Map();
  const log = execFileSync('git', ['log', '--format=%aN%x00%aE%x00%B%x1e'], {
    encoding: 'utf8',
  });

  for (const entry of log.split('\x1e')) {
    const [authorName, authorEmail, ...bodyParts] = entry.split('\x00');
    const body = bodyParts.join('\x00');

    if (authorName && authorEmail) {
      addContributor(contributors, authorName, authorEmail, 'Contributor');
    }

    for (const match of body.matchAll(coAuthorPattern)) {
      addContributor(contributors, match[1], match[2], 'Co-author');
    }
  }

  const mergedContributors = new Map();

  for (const contributor of contributors.values()) {
    const key = contributor.github?.toLowerCase() ?? contributor.name.toLowerCase();
    const githubNameKey = contributor.name.toLowerCase();
    const existing = mergedContributors.get(key) ?? mergedContributors.get(githubNameKey);

    if (existing) {
      existing.name = preferDisplayName(existing.name, contributor.name);
      existing.github ??= contributor.github;
      contributor.roles.forEach(role => existing.roles.add(role));
      mergedContributors.set(existing.github?.toLowerCase() ?? existing.name.toLowerCase(), existing);
      continue;
    }

    mergedContributors.set(key, contributor);
  }

  return Array.from(mergedContributors.values())
    .map(contributor => ({
      ...contributor,
      roles: Array.from(contributor.roles).sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
}

export default function () {
  try {
    return getGitContributors();
  } catch {
    return [];
  }
}
