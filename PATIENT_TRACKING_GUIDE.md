# Patient Mobile Tracking - Step-by-Step Guide

## Overview
Patients can now track their consultation status using their mobile phone number (10 digits) without needing to log in. They can check:
- ✅ Doctor assigned to them
- ✅ Doctor's current status (Free/Busy)
- ✅ Their token number in the queue
- ✅ How long they've been waiting for consultation
- ✅ Consultation status (Pending, In Progress, Completed)

---

## Step-by-Step Procedure to View Doctor Status on Mobile

### **Step 1: Register Patient with Phone Number**
1. Go to **Patients** page in the dashboard
2. Click **Add Patient** button
3. Fill in all patient details including:
   - Patient Name
   - Age
   - Blood Group
   - Weight
   - Blood Pressure
   - **Phone Number (must be 10 digits)** ← Important!
   - Assign a doctor (optional)
4. Click **Add Patient**

**Example Phone Number Format:** `9876543210` (exactly 10 digits)

---

### **Step 2: Patient Accesses Tracking Page on Mobile**

#### Option A: Direct URL Access
1. Patient opens their mobile browser (Chrome, Safari, Firefox, etc.)
2. Navigate to: `http://<your-hospital-domain>/patient-tracking`
3. *For local testing:* `http://localhost:3000/patient-tracking`

#### Option B: Through Menu (if logged in)
1. Login to the dashboard
2. Click **Patient Tracking** from the sidebar menu
3. Enter phone number

---

### **Step 3: Enter Phone Number**

1. On the **Patient Tracking** page, you'll see a form like this:

```
┌─────────────────────────────────────────┐
│  Patient Tracking                       │
│  Enter your mobile number to track      │
│  your consultation status               │
│                                         │
│  [📱 9876543210               ]         │
│                                         │
│  [Check Status Button]                  │
└─────────────────────────────────────────┘
```

2. Enter your 10-digit phone number
3. Click **Check Status** button

---

### **Step 4: View Your Information**

After entering your phone number, you'll see:

#### **Your Information Section:**
```
┌──────────────────────────────────────┐
│ YOUR INFORMATION                      │
├──────────────────────────────────────┤
│ Name: Naveen Khan                     │
│ Age: 45 years                         │
│ Blood Group: A+                       │
│ Status: Pending                       │
└──────────────────────────────────────┘
```

---

### **Step 5: View Doctor Status**

The **Doctor Status** section shows:

#### **Doctor Details:**
```
┌──────────────────────────────────────┐
│ DOCTOR STATUS                         │
├──────────────────────────────────────┤
│ Doctor Name: Dr. Yamuna               │
│ Specialization: Cardiology            │
│ Doctor Status: [🟢 Free / 🔴 Busy]   │
│ Case Time: 30m per patient            │
│ Your Token: #2                        │
│ Wait Time: 15m                        │
└──────────────────────────────────────┘
```

**Status Meanings:**
- 🟢 **Free** - Doctor is available and not consulting
- 🔴 **Busy** - Doctor is currently with another patient
- **Token #2** - Your position in the queue
- **Wait Time** - How long since you started consultation

---

### **Step 6: Understand Consultation Status**

You'll see different status messages based on your consultation stage:

#### **Status 1: Awaiting Doctor Assignment** ⏳
```
⏳ Awaiting Doctor Assignment
A doctor will be assigned shortly. Please wait.
```
- **What it means:** You're registered but no doctor assigned yet
- **Action:** Wait for hospital staff to assign you

#### **Status 2: Assigned to Doctor** 👨‍⚕️
```
👨‍⚕️ Assigned to Dr. Yamuna
Doctor is available. Consultation can start soon.
(or: Doctor is currently consulting with another patient. Your turn will come shortly.)
```
- **What it means:** You're assigned but consultation hasn't started
- **Action:** Wait for your turn

#### **Status 3: Consultation In Progress** 🩺
```
🩺 Consultation In Progress
You are currently consulting with Dr. Yamuna
Consultation Time: 12m
```
- **What it means:** Doctor is consulting with you now
- **Action:** You're being examined/treated
- **Wait Time Updates:** Shows how long consultation is taking

#### **Status 4: Consultation Ending** ⏹️
```
⏹️ Consultation Ending
Your consultation is being completed. Thank you for visiting.
```
- **What it means:** Consultation is finishing
- **Action:** Doctor will provide you with prescription/next steps

#### **Status 5: Consultation Completed** ✅
```
✅ Consultation Completed
Your consultation with Dr. Yamuna has been completed.
```
- **What it means:** Consultation is fully done
- **Action:** You can collect your reports/prescription from reception

---

## Live Tracking Features

### **Real-Time Updates**
- Refresh the page anytime to see updated status
- **Wait time updates automatically** if consultation is in progress
- Shows live token number and queue position

### **Mobile-Friendly Design**
- ✅ Responsive layout for all screen sizes
- ✅ Easy-to-read large fonts
- ✅ Quick loading on slow connections
- ✅ Dark mode support for comfortable viewing

---

## Example Scenarios

### **Scenario 1: Patient Just Registered**
**Action:** Patient enters phone number
**Result:** Shows "Awaiting Doctor Assignment"
**What to do:** Check back later or ask reception

---

### **Scenario 2: Doctor Assigned, Waiting in Queue**
**Action:** Patient enters phone number
**Result:** Shows Doctor details, Token #3, Doctor status "Busy"
**What to do:** Wait. When Token #1 & #2 finish, it's your turn

---

### **Scenario 3: Patient's Turn - Consultation Started**
**Action:** Patient enters phone number
**Result:** Shows "Consultation In Progress", Wait Time "5m"
**What to do:** Get ready for consultation. Doctor will see you very soon

---

### **Scenario 4: Consultation Complete**
**Action:** Patient enters phone number
**Result:** Shows "Consultation Completed" ✅
**What to do:** Visit reception to get prescription/reports

---

## What Patients Can Track

| Information | Example | Why It Matters |
|------------|---------|-----------------|
| **Assigned Doctor** | Dr. Yamuna | Knows who will treat them |
| **Doctor Status** | Free / Busy | Knows when to expect being seen |
| **Specialization** | Cardiology | Confirms right specialist |
| **Case Time** | 30m | Estimates how long consultation will take |
| **Token Number** | #2 | Knows their position in queue |
| **Wait Time** | 12m | Knows exactly how long they've been waiting |
| **Phone Number** | 9876543210 | Verification of identity |

---

## Important Notes

### **Phone Number Validation**
- ✅ Must be exactly **10 digits**
- ✅ Only numbers (0-9)
- ❌ No spaces, dashes, or special characters

### **Examples of Valid Phone Numbers**
- 9876543210 ✅
- 9123456789 ✅
- 9000000001 ✅

### **Examples of Invalid Phone Numbers**
- 98765432 ❌ (only 8 digits)
- 987654321 ❌ (only 9 digits)
- 98765432102 ❌ (11 digits)
- +919876543210 ❌ (has country code)
- 9876-543-210 ❌ (has dashes)

---

## Troubleshooting

### **Problem: "No Patient Found"**
**Causes:**
1. Phone number not registered in system
2. Wrong phone number entered
3. Different format than when registered

**Solution:**
- Check phone number is correct
- Contact reception desk to verify registration
- Ask hospital staff to check your record

---

### **Problem: "Awaiting Doctor Assignment"**
**Causes:**
1. Patient registered but doctor not yet assigned
2. Doctor will be assigned soon

**Solution:**
- Wait a few minutes and refresh
- Ask reception when doctor will be assigned

---

### **Problem: Wait Time Not Showing**
**Causes:**
1. Consultation hasn't started yet
2. Show only when status is "In Progress"

**Solution:**
- Refresh page to update status
- Start consultation first

---

## For Hospital Staff

### **Adding Patient with Phone Number**
1. Go to Patients page
2. Click "Add Patient"
3. **Enter 10-digit phone number in Phone field**
4. Assign doctor
5. Patient can now track using this number

### **Editing Patient Phone Number**
1. Go to Patients page
2. Click "Edit" on patient row
3. Update phone number (must be 10 digits)
4. Click "Save"

### **Viewing All Patients for a Doctor**
1. Go to "Doctor-Patients" page
2. See all doctors with their assigned patients
3. View each patient's status and phone number

---

## URLs for Access

| Page | URL | Purpose |
|------|-----|---------|
| **Patient Tracking** | `/patient-tracking` | Patients check status using phone |
| **Doctor-Patients** | `/doctor-patients` | Staff view all doctor-patient mapping |
| **Patients** | `/patients` | Staff manage all patients |
| **Doctors** | `/doctors` | Staff manage doctors |

---

## Summary

✅ **Patients can now:**
- Track consultation status anytime using phone number
- See assigned doctor details
- Know their queue position (token)
- Monitor wait time live
- Access from any mobile device
- No login required for patient tracking

✅ **Hospital Staff can:**
- Register patients with phone numbers
- Assign doctors to patients
- View real-time queue status
- Track consultation progress
- Monitor all doctor-patient relationships

---

**Questions?** Contact hospital reception or IT support team.
