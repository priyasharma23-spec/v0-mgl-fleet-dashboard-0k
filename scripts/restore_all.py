# ── FleetOperatorShell.tsx ──────────────────────────────────────
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx') as f:
    content = f.read()

content = content.replace(
    '{ label: "RC Uploaded", status: "done" },\n            { label: "Vehicle Verified", status: "done" },\n            { label: "MIC Review", status: v.l1ApprovedAt ? "done" : v.l1SubmittedAt ? "active" : "pending" },\n            { label: "Card Issued", status: v.cardActivatedAt ? "done" : v.cardNumber ? "active" : "pending" },',
    '{ label: "RC Uploaded", status: "done" },\n            { label: "Vehicle Verified", status: "done" },\n            { label: "MIC Approval", status: ["APPROVED","CARD_ISSUED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "SUBMITTED" ? "active" : "pending" },\n            { label: "Approved", status: ["CARD_ISSUED","CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "APPROVED" ? "active" : "pending" },\n            { label: "Card Issued", status: ["CARD_PRINTED","CARD_DISPATCHED","CARD_ACTIVE"].includes(v.status) ? "done" : v.status === "CARD_ISSUED" ? "active" : "pending" },'
)
content = content.replace(
    'v.status === "L1_SUBMITTED" ? "bg-amber-100 text-amber-700" :\n                      v.status === "L1_APPROVED" ? "bg-blue-100 text-blue-700" :\n                      v.status === "L1_REJECTED" ? "bg-red-100 text-red-700" :',
    'v.status === "SUBMITTED" ? "bg-amber-100 text-amber-700" :\n                      v.status === "APPROVED" ? "bg-blue-100 text-blue-700" :\n                      v.status === "CARD_ISSUED" ? "bg-purple-100 text-purple-700" :'
)
content = content.replace(
    'v.status === "L1_SUBMITTED" ? "Under MIC Review" :\n                       v.status === "L1_APPROVED" ? "Card Being Issued" :\n                       v.status === "L1_REJECTED" ? "Action Required" :',
    'v.status === "SUBMITTED" ? "Under MIC Review" :\n                       v.status === "APPROVED" ? "Approved" :\n                       v.status === "CARD_ISSUED" ? "Card Being Issued" :'
)
content = content.replace(
    '{(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && (',
    '{(v.status === "L1_REJECTED" || v.status === "L2_REJECTED") && v.onboardingType !== "SELF_SERVICE" && ('
)
with open('/vercel/share/v0-project/components/mgl/FleetOperatorShell.tsx', 'w') as f:
    f.write(content)
print('FleetOperatorShell: SUBMITTED badge:', '"SUBMITTED" ? "bg-amber-100' in content)
print('FleetOperatorShell: Action Required hidden:', 'onboardingType !== "SELF_SERVICE"' in content)
print('FleetOperatorShell: MIC Approval step:', 'MIC Approval' in content)

# ── mgl-data.ts statuses ────────────────────────────────────────
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
print('mgl-data: statuses fixed')

# ── mgl-data.ts vahaaanData interface ───────────────────────────
with open('/vercel/share/v0-project/lib/mgl-data.ts') as f:
    content = f.read()
if 'vahaaanData?' not in content:
    content = content.replace(
        '  incentiveNote?: string;',
        '  incentiveNote?: string;\n  vahaaanData?: { status: string; blacklist_status: string; registered_at: string; issue_date: string; expiry_date: string; owner_data: { name: string; mobile: string }; vehicle_data: { maker_description: string; maker_model: string; category: string; fuel_type: string; body_type: string; chassis_number: string; engine_number: string; color: string; gross_weight: string; manufactured_date: string }; insurance_data: { company: string; policy_number: string; expiry_date: string }; pucc_data: { pucc_number: string; expiry_date: string } };'
    )
    print('mgl-data: interface updated')
else:
    print('mgl-data: interface already has vahaaanData')
with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
    f.write(content)

# ── mgl-data.ts vahaaanData mock data ───────────────────────────
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
        if f'id: "{vid}"' in l:
            current_veh = vid
    if current_veh and '  },' in l:
        if 'vahaaanData' not in ''.join(lines[max(0,i-5):i+1]):
            lines.insert(i, veh_vahaan[current_veh])
            remaining.discard(current_veh)
            current_veh = None
            if not remaining:
                break
with open('/vercel/share/v0-project/lib/mgl-data.ts', 'w') as f:
    f.writelines(lines)
print('mgl-data: vahaan mock remaining:', remaining)

# ── FOVehicleDetailTray.tsx ──────────────────────────────────────
with open('/vercel/share/v0-project/components/mgl/FOVehicleDetailTray.tsx') as f:
    content = f.read()
if 'vahaaanData' not in content:
    old = '''              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                {[
                  ["Registration Type", v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],
                  ["Vehicle Number", v.vehicleNumber],
                  ["OEM", v.oem],
                  ["Model", v.model],
                  ["Category", v.category],
                  ["Dealership", v.dealership],
                  ["Booking Date", v.bookingDate],
                  ["Registration Date", v.registrationDate],
                  ["Delivery Date", v.deliveryDate],
                ].map(([label, value]) => value ? (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground text-right">{value}</span>
                  </div>
                ) : null)}
              </div>'''
    new = '''              {v.onboardingType === "SELF_SERVICE" && v.vahaaanData ? (
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Registration</p>
                    {[["Vehicle Number", v.vehicleNumber],["Status", v.vahaaanData.status],["Blacklisted", v.vahaaanData.blacklist_status === "false" ? "No" : "Yes"],["RTO", v.vahaaanData.registered_at],["Issue Date", v.vahaaanData.issue_date],["Expiry Date", v.vahaaanData.expiry_date],["Owner", v.vahaaanData.owner_data.name],["Mobile", v.vahaaanData.owner_data.mobile]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>) : null)}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle</p>
                    {[["Make", v.vahaaanData.vehicle_data.maker_description],["Model", v.vahaaanData.vehicle_data.maker_model],["Category", v.vahaaanData.vehicle_data.category],["Fuel Type", v.vahaaanData.vehicle_data.fuel_type],["Body Type", v.vahaaanData.vehicle_data.body_type],["Chassis No.", v.vahaaanData.vehicle_data.chassis_number],["Engine No.", v.vahaaanData.vehicle_data.engine_number],["Colour", v.vahaaanData.vehicle_data.color],["GVW", v.vahaaanData.vehicle_data.gross_weight + " kg"],["Mfg. Date", v.vahaaanData.vehicle_data.manufactured_date]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>) : null)}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Insurance</p>
                    {[["Company", v.vahaaanData.insurance_data.company],["Policy No.", v.vahaaanData.insurance_data.policy_number],["Expiry", v.vahaaanData.insurance_data.expiry_date]].map(([label, value]) => (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right max-w-[60%]">{value}</span></div>))}
                  </div>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">PUCC</p>
                    {[["PUCC No.", v.vahaaanData.pucc_data.pucc_number],["Expiry", v.vahaaanData.pucc_data.expiry_date]].map(([label, value]) => (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground">{value}</span></div>))}
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
                  {[["Registration Type", v.onboardingType === "SELF_SERVICE" ? "Self-Service" : v.vehicleType === "retrofit" ? "Retrofitment" : "New Purchase"],["Vehicle Number", v.vehicleNumber],["OEM", v.oem],["Model", v.model],["Category", v.category],["Dealership", v.dealership],["Booking Date", v.bookingDate],["Registration Date", v.registrationDate],["Delivery Date", v.deliveryDate]].map(([label, value]) => value ? (<div key={label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-medium text-foreground text-right">{value}</span></div>) : null)}
                </div>
              )}'''
    if old in content:
        content = content.replace(old, new)
        print('FOVehicleDetailTray: updated')
    else:
        print('FOVehicleDetailTray: old text not found - may need manual fix')
else:
    print('FOVehicleDetailTray: already has vahaaanData')
with open('/vercel/share/v0-project/components/mgl/FOVehicleDetailTray.tsx', 'w') as f:
    f.write(content)
