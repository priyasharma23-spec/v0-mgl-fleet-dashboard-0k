#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

# Restore the file from origin/main
result = subprocess.run(
    ['git', 'checkout', 'origin/main', '--', 'components/mgl/MGLAdminShell.tsx'],
    capture_output=True,
    text=True
)

print("STDOUT:", result.stdout)
print("STDERR:", result.stderr)
print("Return code:", result.returncode)

if result.returncode == 0:
    print("[v0] File successfully restored from origin/main")
else:
    print("[v0] Error restoring file")
    sys.exit(1)
