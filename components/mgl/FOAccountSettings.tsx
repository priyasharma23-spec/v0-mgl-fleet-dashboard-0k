"use client";
import { useState } from "react";
import { Save, Upload, Mail, Phone, MapPin, Building2, Edit2, X } from "lucide-react";

export default function FOAccountSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "ABC Logistics Pvt. Ltd.",
    contactPerson: "Rajesh Kumar",
    email: "contact@abclogistics.com",
    phone: "+91 9876543210",
    address: "123 Business Park, Mumbai, Maharashtra 400001",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    gstin: "27AABCU9603R1Z0",
    panNumber: "AAABP5005K",
    bankAccount: "1234567890",
    ifscCode: "HDFC0000001"
  });

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your company profile and account information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Company Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Company Information
        </h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Company Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.companyName}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Contact Person</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.contactPerson}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.email}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.phone}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Address
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.address}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">City</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.city}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">State</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.state}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tax & Banking Information */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Tax & Banking Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">GSTIN</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.gstin}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">PAN Number</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.panNumber}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Bank Account</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">****{formData.bankAccount.slice(-4)}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">IFSC Code</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-input text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm text-foreground font-medium mt-1">{formData.ifscCode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Documents</h2>
        <div className="space-y-3">
          {["GST Certificate", "PAN Certificate", "Business Registration", "Bank Proof"].map((doc) => (
            <div key={doc} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm font-medium text-foreground">{doc}</span>
              <button className="flex items-center gap-1 px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload
              </button>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
