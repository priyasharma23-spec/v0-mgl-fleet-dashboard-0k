#!/usr/bin/env python3
import os

# Read the FleetOperatorShell.tsx file from the project root
with open('components/mgl/FleetOperatorShell.tsx', 'r') as f:
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

# Create directory if it doesn't exist
os.makedirs('components/mgl/fo', exist_ok=True)

# Extract each function
for func_name, start_line, end_line in functions_to_extract:
    # Get the function lines (convert 1-indexed to 0-indexed)
    func_lines = lines[start_line - 1:end_line]
    func_content = '\n'.join(func_lines)
    
    # Create the new file with "use client" and imports
    new_file_content = '"use client"\n\n'
    new_file_content += 'import { useState } from "react"\n'
    new_file_content += 'import Image from "next/image"\n'
    new_file_content += 'import { Truck, CreditCard, Clock, AlertCircle, ChevronRight, MapPin, Bell, Eye, EyeOff, Upload, CheckCircle, XCircle, BarChart3, RefreshCw, Smartphone, Package, Briefcase, AlertTriangle, TrendingUp } from "lucide-react"\n'
    new_file_content += 'import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from "recharts"\n'
    new_file_content += 'import { VehicleStatusBadge, WorkflowStepper } from "@/components/mgl/shared"\n'
    new_file_content += 'import { myVehicles, myFO, oems, retrofitters } from "@/data/mock"\n'
    new_file_content += 'import { getDealersByOEM, getCategoriesByOEM, getModelsByOEMAndCategory, calculateVehicleAge } from "@/lib/vehicle-utils"\n'
    new_file_content += 'import type { VehicleCategory, VehicleStatus } from "@/types"\n\n'
    new_file_content += func_content + '\n'
    
    # Write the new file
    file_path = f'components/mgl/fo/{func_name}.tsx'
    with open(file_path, 'w') as f:
        f.write(new_file_content)
    
    print(f'Created {file_path}')

print('Extraction complete!')

