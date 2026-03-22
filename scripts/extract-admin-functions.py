#!/usr/bin/env python3
import re

# Read the MGLAdminShell.tsx file
with open('/vercel/share/v0-project/components/mgl/MGLAdminShell.tsx', 'r') as f:
    content = f.read()

# Extract all function definitions with their content
functions = {
    'AdminTransactions': (721, 1121),
    'AdminSettlements': (1122, 1583),
    'AdminReports': (1584, 1784),
    'AdminAnalytics': (1785, 1862),
    'AdminConfig': (1863, None),
}

lines = content.split('\n')

# Create AdminTransactions
txn_lines = lines[720:1121]  # 0-indexed
with open('/vercel/share/v0-project/components/mgl/admin/AdminTransactions.tsx', 'w') as f:
    f.write('"use client"\n\nimport { useState } from "react"\nimport { Download, Eye, X } from "lucide-react"\n\n')
    f.write('\n'.join(txn_lines))
    f.write('\nexport default AdminTransactions\n')

print("Created AdminTransactions.tsx")

# Create AdminSettlements  
settlement_lines = lines[1121:1583]
with open('/vercel/share/v0-project/components/mgl/admin/AdminSettlements.tsx', 'w') as f:
    f.write('"use client"\n\nimport { useState } from "react"\nimport { Search, Download, Eye, ChevronRight, AlertCircle, X } from "lucide-react"\n\n')
    f.write('\n'.join(settlement_lines))
    f.write('\nexport default AdminSettlements\n')

print("Created AdminSettlements.tsx")

# Create AdminReports
report_lines = lines[1583:1784]
with open('/vercel/share/v0-project/components/mgl/admin/AdminReports.tsx', 'w') as f:
    f.write('"use client"\n\nimport { useState } from "react"\nimport { Download, BarChart3 } from "lucide-react"\n\n')
    f.write('\n'.join(report_lines))
    f.write('\nexport default AdminReports\n')

print("Created AdminReports.tsx")

# Create AdminAnalytics
analytics_lines = lines[1784:1862]
with open('/vercel/share/v0-project/components/mgl/admin/AdminAnalytics.tsx', 'w') as f:
    f.write('"use client"\n\nimport { TrendingUp, TrendingDown } from "lucide-react"\n\n')
    f.write('\n'.join(analytics_lines))
    f.write('\nexport default AdminAnalytics\n')

print("Created AdminAnalytics.tsx")

# Create AdminConfig
config_lines = lines[1862:]
with open('/vercel/share/v0-project/components/mgl/admin/AdminConfig.tsx', 'w') as f:
    f.write('"use client"\n\nimport { useState } from "react"\nimport { Plus, Trash2, Edit3 } from "lucide-react"\n\n')
    f.write('\n'.join(config_lines))
    f.write('\nexport default AdminConfig\n')

print("Created AdminConfig.tsx")
