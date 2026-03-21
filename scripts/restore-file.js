import { execSync } from 'child_process';
import path from 'path';

try {
  const result = execSync('git checkout origin/main -- components/mgl/MGLAdminShell.tsx', {
    cwd: '/vercel/share/v0-project',
    encoding: 'utf-8'
  });
  console.log('[v0] File restored successfully');
  console.log(result);
} catch (error) {
  console.error('[v0] Error restoring file:', error.message);
  process.exit(1);
}
