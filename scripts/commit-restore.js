import { execSync } from 'child_process';

try {
  console.log("[v0] Staging MGLAdminShell.tsx...");
  execSync('git add components/mgl/MGLAdminShell.tsx', { cwd: '/vercel/share/v0-project' });
  
  console.log("[v0] Committing with message...");
  execSync('git commit -m "restore: clean working state from origin/main"', { cwd: '/vercel/share/v0-project' });
  
  console.log("[v0] Pushing to GitHub...");
  execSync('git push', { cwd: '/vercel/share/v0-project' });
  
  console.log("[v0] Successfully committed and pushed!");
} catch (error) {
  console.error("[v0] Error during commit/push:", error.message);
  process.exit(1);
}
