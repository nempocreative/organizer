import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(scriptDir, '../../..');
const slidePackageDir = path.join(workspaceRoot, 'lib/nempo-kenalan-deck');
const builtSlidesDir = path.join(slidePackageDir, 'dist/public');
const targetDir = path.join(workspaceRoot, 'artifacts/nempo-mou/public/kenalan');

execFileSync('pnpm', ['--filter', '@workspace/nempo-kenalan-deck', 'run', 'build'], {
  cwd: workspaceRoot,
  env: {
    ...process.env,
    BASE_PATH: '/nempo-mou/kenalan/',
    NODE_ENV: 'production',
    PORT: '19253',
  },
  stdio: 'inherit',
});

if (!existsSync(path.join(builtSlidesDir, 'index.html'))) {
  throw new Error('Build deck Nempo Kenalan tidak menghasilkan index.html.');
}

rmSync(targetDir, { recursive: true, force: true });
mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(builtSlidesDir, targetDir, { recursive: true });
cpSync(
  path.join(slidePackageDir, 'src/data/slides-manifest.json'),
  path.join(targetDir, 'slides-manifest.json'),
);
