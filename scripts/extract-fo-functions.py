#!/usr/bin/env python3
"""Extract FO functions from FleetOperatorShell.tsx"""

# Read the main file
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx', 'r') as f:
    content = f.read()
    lines = content.split('\n')

# Function boundaries (from our grep earlier)
boundaries = [
    ("FOSignupFlow", 157, 349),
    ("FODashboard", 352, 492),
    ("FOVehiclesList", 495, 570),
    ("FOAddVehicle", 573, 971),
    ("FOCardsView", 973, 1927),
    ("FOFundManagement", 1929, 2112),
    ("FODeliveryTracking", 2114, 2195),
    ("FONotificationsView", 2197, 2227),
]

# Extract functions
print("[v0] Extracting 8 FO functions from FleetOperatorShell.tsx")
for func_name, start_line, end_line in boundaries:
    # Convert to 0-indexed
    start_idx = start_line - 1
    end_idx = end_line
    
    func_lines = lines[start_idx:end_idx]
    func_content = '\n'.join(func_lines)
    
    print(f"[v0] {func_name}: lines {start_line}-{end_line} ({len(func_lines)} lines)")

print("[v0] Ready to extract functions. Line counts extracted.")
