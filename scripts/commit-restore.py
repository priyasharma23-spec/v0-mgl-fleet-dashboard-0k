import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    # Stage the file
    subprocess.run(['git', 'add', 'components/mgl/MGLAdminShell.tsx'], check=True)
    print("[v0] Staged MGLAdminShell.tsx")
    
    # Commit with message
    subprocess.run(['git', 'commit', '-m', 'restore: clean working state from origin/main'], check=True)
    print("[v0] Committed with message: restore: clean working state from origin/main")
    
    # Push to origin
    subprocess.run(['git', 'push', 'origin', 'HEAD'], check=True)
    print("[v0] Pushed to GitHub successfully")
    
except subprocess.CalledProcessError as e:
    print(f"[v0] Git error: {e}")
except Exception as e:
    print(f"[v0] Error: {e}")
