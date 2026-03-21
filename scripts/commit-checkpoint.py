import subprocess
import sys

try:
    # Add the file to git
    subprocess.run(['git', 'add', 'components/mgl/MGLAdminShell.tsx'], cwd='/vercel/share/v0-project', check=True)
    
    # Commit with the specified message
    subprocess.run(['git', 'commit', '-m', 'checkpoint: clean working state - all 13 functions intact'], cwd='/vercel/share/v0-project', check=True)
    
    # Push to the current branch (v0/productaccount-5663-2fa73788)
    subprocess.run(['git', 'push', 'origin', 'v0/productaccount-5663-2fa73788'], cwd='/vercel/share/v0-project', check=True)
    
    print("Successfully committed and pushed to GitHub")
except subprocess.CalledProcessError as e:
    print(f"Error: {e}")
    sys.exit(1)
