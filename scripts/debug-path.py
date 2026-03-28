#!/usr/bin/env python3
import os
import sys

print(f"Current working directory: {os.getcwd()}")
print(f"Script location: {sys.argv[0]}")
print(f"Files in current dir: {os.listdir('.')[:10]}")

# Try to find the file
for root, dirs, files in os.walk('.'):
    if 'FleetOperatorShell.tsx' in files:
        print(f"Found FleetOperatorShell.tsx at: {os.path.join(root, 'FleetOperatorShell.tsx')}")
        break
