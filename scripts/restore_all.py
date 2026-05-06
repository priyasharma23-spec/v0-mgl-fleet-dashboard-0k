# MGL Fleet Connect - Restore Script
# Run this after v0 overwrites to restore all SELF_SERVICE changes

# 1. FleetOperatorShell.tsx
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx') as f:
    content = f.read()

content = content.replace(
    '{ label: "RC Uploaded", status: "done" },\n            { label: "Vehicle Verified", status: "done" },\n            { label: "MIC Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },\n            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },',
    '{ label: "RC Uploaded", status: "done" },\n            { label: "Vehicle Verified", status: "done" },\n            { label: "Approved", status: ["APPROVED","CARD_ISSUED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "SUBMITTED" ? "active" : "pending" },\n            { label: "Approved", status: ["CARD_ISSUED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "APPROVED" ? "active" : "pending" },\n            { label: "Card Issued", status: ["CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "CARD_ISSUED" ? "active" : "pending" },'
)
content = content.replace(
    'v.status === "L1_SUBMITTED" ? "bg-amber-100 text-amber-700" :\n                      v.status === "L1_APPROVED" ? "bg-blue-100 text-blue-700" :\n                      v.status === "L1_REJECTED" ? "bg-red-100 text-red-700" :',
    'v.status === "SUBMITTED" ? "bg-amber-100 text-amber-700" :\n                      v.status === "APPROVED" ? "bg-blue-100 text-blue-700" :\n                      v.status === "CARD_ISSUED" ? "bg-purple-100 text-purple-700" :'
)
content = content.replace(
    'v.status === "L1_SUBMITTED" ? "Under MIC Review" :\n                       v.status === "L1_APPROVED" ? "Card Being Issued" :\n                       v.status === "L1_REJECTED" ? "Action Required" :',
    'v.status === "SUBMITTED" ? "Submitted" :\n                       v.status === "APPROVED" ? "Approved" :\n                       v.status === "CARD_ISSUED" ? "Card Being Issued" :'
)
content = content.replace(
    '{(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && (',
    '{(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && v.onboardingType !== "SELF_SERVICE" && ('
)
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx', 'w') as f:
    f.write(content)
print('FleetOperatorShell: done')

# 2. mgl-data.ts statuses
with open('/vercel/share/v0-project/lib/mgl-data.ts') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'VEH011' in l:
        for j in range(i, i+20):
            if 'status:' in lines[j] and 'onboardingType' not in lines[j]:
                lines[j] = '    status: "SUBMITTED",\n'
                break
    if 'VEH012' in l:
        for j in range(i, i+20):
            if 'status:' in lines[j] and 'onboardingType' not in lines[j]:
                lines[j] = '    status: "APPROVED",\n'
                break
with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
    f.writelines(lines)
print('mgl-data statuses: done')

# 3. vehicleStatusConfig
with open('/vercel/share/v0-project/lib/mgl-data.ts') as f:
    content = f.read()
if 'SUBMITTED: { label:' not in content:
    content = content.replace(
        'DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },',
        'DRAFT: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100" },\n  SUBMITTED: { label: "Under MIC Review", color: "text-amber-700", bg: "bg-amber-100" },\n  APPROVED: { label: "Approved", color: "text-blue-700", bg: "bg-blue-100" },\n  CARD_ISSUED: { label: "Card Being Issued", color: "text-purple-700", bg: "bg-purple-100" },'
    )
    with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
        f.write(content)
    print('vehicleStatusConfig: updated')
else:
    print('vehicleStatusConfig: already has SUBMITTED')

# 4. vahaaanData interface
with open('/vercel/share/v0-project/lib/mgl-data.ts') as f:
    content = f.read()
if 'vahaaanData?' not in content:
    content = content.replace(
        'incentiveNote?: string;',
        'incentiveNote?: string;\n  vahaaanData?: { status: string; blacklist_status: string; registered_at: string; issue_date: string; expiry_date: string; owner_data: { name: string; mobile: string }; vehicle_data: { maker_description: string; maker_model: string; category: string; fuel_type: string; body_type: string; chassis_number: string; engine_number: string; color: string; gross_weight: string; manufactured_date: string }; insurance_data: { company: string; policy_number: string; expiry_date: string }; pucc_data: { pucc_number: string; expiry_date: string } };'
    )
    with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
        f.write(content)
    print('vahaaanData interface: updated')
else:
    print('vahaaanData interface: already exists')

# 5. vahaaanData mock data
with open('/vercel/share/v0-project/lib/mgl-data.ts') as f:
    lines = f.readlines()
veh_vahaan = {
    'VEH010': '    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Mumbai Central, Maharashtra", issue_date: "2022-03-15", expiry_date: "2037-03-14", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "TATA MOTORS LTD", maker_model: "LPT 1918", category: "HCV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MAT445203NEB12345", engine_number: "275IDTCR4CNL12345", color: "WHITE", gross_weight: "19000", manufactured_date: "2022-02" }, insurance_data: { company: "National Insurance Co. Ltd", policy_number: "420100/31/2024/12345", expiry_date: "2025-03-14" }, pucc_data: { pucc_number: "PUCC123456", expiry_date: "2025-09-15" } },\n',
    'VEH011': '    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Andheri, Maharashtra", issue_date: "2024-08-10", expiry_date: "2039-08-09", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "MAHINDRA AND MAHINDRA", maker_model: "BOLERO PIK-UP", category: "LCV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MA1PU2HRPNM12345", engine_number: "DIECRPNM12345", color: "WHITE", gross_weight: "2500", manufactured_date: "2024-07" }, insurance_data: { company: "HDFC ERGO Insurance", policy_number: "2311/12345/00/000", expiry_date: "2026-08-09" }, pucc_data: { pucc_number: "PUCC654321", expiry_date: "2026-02-10" } },\n',
    'VEH012': '    vahaaanData: { status: "ACTIVE", blacklist_status: "false", registered_at: "RTO Goregaon, Maharashtra", issue_date: "2023-11-20", expiry_date: "2038-11-19", owner_data: { name: "Priya Transport Services", mobile: "9876543210" }, vehicle_data: { maker_description: "EICHER MOTORS LTD", maker_model: "PRO 2095", category: "ICV", fuel_type: "CNG", body_type: "GOODS CARRIER", chassis_number: "MBIEB4BPNM12345", engine_number: "E494CPNM12345", color: "WHITE", gross_weight: "9500", manufactured_date: "2023-10" }, insurance_data: { company: "New India Assurance Co. Ltd", policy_number: "31010031230100000", expiry_date: "2025-11-19" }, pucc_data: { pucc_number: "PUCC789012", expiry_date: "2025-05-20" } },\n',
}
remaining = set(veh_vahaan.keys())
current_veh = None
for i, l in enumerate(lines):
    for vid in list(remaining):
        if 'id: "' + vid + '"' in l:
            current_veh = vid
    if current_veh and '  },' in l:
        if 'vahaaanData' not in ''.join(lines[max(0,i-30):i+1]):
            lines.insert(i, veh_vahaan[current_veh])
            remaining.discard(current_veh)
            current_veh = None
            if not remaining:
                break
with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
    f.writelines(lines)
print('vahaaanData mock:', 'remaining=' + str(remaining))

# 6. FOVehicleDetailTray.tsx
with open('/vercel/share/v0-project/components/mgl/FOVehicleDetailTray.tsx') as f:
    content = f.read()
if 'vahaaanData' not in content:
    old = '              <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>\n                {[\n                  ["Registration Type", v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],\n                  ["Vehicle Number", v.vehicleNumber],\n                  ["OEM", v.oem],\n                  ["Model", v.model],\n                  ["Category", v.category],\n                  ["Dealership", v.dealership],\n                  ["Booking Date", v.bookingDate],\n                  ["Registration Date", v.registrationDate],\n                  ["Delivery Date", v.deliveryDate],\n                ].map(([label, value]) => value ? (\n                  <div key={label} className="flex items-center justify-between text-sm">\n                    <span className="text-muted-foreground">{label}</span>\n                    <span className="font-medium text-foreground text-right">{value}</span>\n                  </div>\n                ) : null)}\n              </div>'
    new = '              {v.onboardingType === "SELF_SERVICE" && v.vahaaanData ? (\n                <div className="space-y-3">\n                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Registration</p>\n                    {[["Vehicle Number", v.vehicleNumber],["Status", v.vahaaanData.status],["Blacklisted", v.vahaaanData.blacklist_status === "false" ? "No" : "Yes"],["RTO", v.vahaaanData.registered_at],["Issue Date", v.vahaaanData.issue_date],["Expiry Date", v.vahaaanData.expiry_date],["Owner", v.vahaaanData.owner_data.name],["Mobile", v.vahaaanData.owner_data.mobile]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>) : null)}\n                  </div>\n                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle</p>\n                    {[["Make", v.vahaaanData.vehicle_data.maker_description],["Model", v.vahaaanData.vehicle_data.maker_model],["Category", v.vahaaanData.vehicle_data.category],["Fuel Type", v.vahaaanData.vehicle_data.fuel_type],["Body Type", v.vahaaanData.vehicle_data.body_type],["Chassis No.", v.vahaaanData.vehicle_data.chassis_number],["Engine No.", v.vahaaanData.vehicle_data.engine_number],["Colour", v.vahaaanData.vehicle_data.color],["GVW", v.vahaaanData.vehicle_data.gross_weight + " kg"],["Mfg. Date", v.vahaaanData.vehicle_data.manufactured_date]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>) : null)}\n                  </div>\n                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insurance</p>\n                    {[["Company", v.vahaaanData.insurance_data.company],["Policy No.", v.vahaaanData.insurance_data.policy_number],["Expiry", v.vahaaanData.insurance_data.expiry_date]].map(([label, value]) => (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>))}\n                  </div>\n                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PUCC</p>\n                    {[["PUCC No.", v.vahaaanData.pucc_data.pucc_number],["Expiry", v.vahaaanData.pucc_data.expiry_date]].map(([label, value]) => (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground">{value}</span></div>))}\n                  </div>\n                </div>\n              ) : (\n                <div className="bg-muted/30 rounded-xl p-4 space-y-2">\n                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>\n                  {[["Registration Type", v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],["Vehicle Number", v.vehicleNumber],["OEM", v.oem],["Model", v.model],["Category", v.category],["Dealership", v.dealership],["Booking Date", v.bookingDate],["Registration Date", v.registrationDate],["Delivery Date", v.deliveryDate]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right">{value}</span></div>) : null)}\n                </div>\n              )}'
    if old in content:
        content = content.replace(old, new)
        print('FOVehicleDetailTray: updated')
    else:
        print('FOVehicleDetailTray: old text not found')
else:
    print('FOVehicleDetailTray: already has vahaaanData')
with open('/vercel/share/v0-project/components/mgl/FOVehicleDetailTray.tsx', 'w') as f:
    f.write(content)

# 7. MGLSidebar - remove My Profile from main nav arrays
with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx') as f:
    lines = f.readlines()
lines = [l for l in lines if not (
    'My Profile' in l and
    ('mic-profile' in l or 'zic-profile' in l or 'admin-profile' in l) and
    'role ===' not in l
)]
with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx', 'w') as f:
    f.writelines(lines)
print('MGLSidebar: My Profile removed from main nav')

# 8. MGLSidebar - fix General section My Profile routing
with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx') as f:
    content = f.read()
if 'role === "mgl-admin" ? "admin-profile"' not in content:
    content = content.replace(
        '{ icon: User, label: "My Profile", view: "fo-profile" },',
        '{ icon: User, label: "My Profile", view: role === "mgl-admin" ? "admin-profile" : role === "mic" ? "mic-profile" : role === "zic" ? "zic-profile" : "fo-profile" },'
    )
    with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx', 'w') as f:
        f.write(content)
    print('MGLSidebar: General My Profile routing fixed')
else:
    print('MGLSidebar: General My Profile routing already correct')

# 9. MGLSidebar - wire onClick to General section
with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx') as f:
    content = f.read()
if 'onViewChange(item.view); onClose()' not in content:
    content = content.replace(
        'key={item.view}\n                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"',
        'key={item.view}\n                onClick={() => { onViewChange(item.view); onClose(); }}\n                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all"'
    )
    with open('/vercel/share/v0-project/components/mgl/MGLSidebar.tsx', 'w') as f:
        f.write(content)
    print('MGLSidebar: General onClick wired')
else:
    print('MGLSidebar: General onClick already wired')

print('\nAll done!')
