import { execFileSync } from 'node:child_process';
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
execFileSync('pnpm', ['exec', 'wrangler', 'deploy', '--var', `BRANCH:${git('branch', '--show-current')}`, '--var', `COMMIT_HASH:${git('rev-parse', 'HEAD')}`, '--var', `DEPLOYED_AT:${new Date().toISOString()}`], { stdio: 'inherit' });
