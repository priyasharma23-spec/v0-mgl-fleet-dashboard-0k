#!/usr/bin/env python3
import re
import os

# Read the FleetOperatorShell.tsx file
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx', 'r') as f:
    content = f.read()

# Define functions to extract with their line ranges
functions_to_extract = [
    ('FOSignupFlow', 157, 351),
    ('FODashboard', 352, 494),
    ('FOVehiclesList', 495, 572),
    ('FOAddVehicle', 573, 972),
    ('FOCardsView', 973, 1928),
    ('FOFundManagement', 1929, 2113),
    ('FODeliveryTracking', 2114, 2196),
    ('FONotificationsView', 2197, 2226),
]

# Split content into lines
lines = content.split('\n')

# Extract each function
for func_name, start_line, end_line in functions_to_extract:
    # Get the function lines (convert 1-indexed to 0-indexed)
    func_lines = lines[start_line - 1:end_line]
    func_content = '\n'.join(func_lines)
    
    # Find the imports used in FleetOperatorShell
    # Extract the import section from the original file
    import_section = '\n'.join(lines[0:15])
    
    # Create the new file with "use client" and imports
    new_file_content = f'''\"use client\"

import {{ useState }} from \"react\"
import {{ Image }} from \"next/image\"
import {{ Truck, CreditCard, Clock, AlertCircle, ChevronRight, MapPin, Bell, Eye, EyeOff, Upload, CheckCircle, XCircle, BarChart3, RefreshCw, Smartphone, Package, Briefcase, AlertTriangle, TrendingUp }} from \"lucide-react\"
import {{ ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend }} from \"recharts\"
import {{ VehicleStatusBadge, WorkflowStepper }} from \"@/components/mgl/shared\"
import {{ myVehicles, myFO, oems, retrofitters }} from \"@/data/mock\"
import {{ getDealersByOEM, getCategoriesByOEM, getModelsByOEMAndCategory, calculateVehicleAge }} from \"@/lib/vehicle-utils\"
import type {{ VehicleCategory, VehicleStatus }} from \"@/types\"

export default function {func_name}(props: any) {{
{func_content.split('\\n').map(line => line if line.startswith('function') else '  ' + line if line.strip() else line).join('\\n').replace(f'function {func_name}(', '')}

export default {func_name}
'''
    
    # Write the new file
    file_path = f'/vercel/share/v0-project/components/mgl/fo/{func_name}.tsx'
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'w') as f:
        f.write(new_file_content)
    
    print(f'Created {file_path}')

print('Extraction complete!')
