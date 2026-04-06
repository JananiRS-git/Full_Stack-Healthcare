# Patient Tracking - Quick Reference

## 🏥 For Patients: How to Check Your Doctor Status

### Quick Steps (1 minute):
1. **Open on Mobile:** Go to `/patient-tracking` 
2. **Enter Phone:** Enter your 10-digit number (e.g., 9876543210)
3. **Click Submit:** Press "Check Status"
4. **View Status:** See doctor details, queue position, and wait time

---

## 📱 What You'll See

```
YOUR INFORMATION
├─ Name: Naveen Khan
├─ Age: 45 years
├─ Blood Group: A+
└─ Status: Pending

DOCTOR STATUS  
├─ Doctor: Dr. Yamuna
├─ Specialty: Cardiology
├─ Doctor Status: [🟢 Free / 🔴 Busy]
├─ Your Token: #2
└─ Wait Time: 12m
```

---

## 🎯 Status Meanings

| Status | Icon | Meaning | Wait For |
|--------|------|---------|----------|
| Awaiting Assignment | ⏳ | No doctor yet | 5-15 min |
| Assigned | 👨‍⚕️ | Doctor ready | Your turn |
| In Progress | 🩺 | Your consultation | 15-30 min |
| Ending | ⏹️ | Wrapping up | <5 min |
| Completed | ✅ | All done | Receipt |

---

## 📞 Valid Phone Formats

✅ **CORRECT:** 9876543210
✅ **CORRECT:** 9123456789

❌ **WRONG:** 98765432 (too short)
❌ **WRONG:** +919876543210 (country code)
❌ **WRONG:** 9876-543-210 (dashes)

---

## 🔄 Live Features

- **Auto-refresh:** Status updates every time you open
- **Live wait time:** Shows exact consultation duration
- **Queue position:** Tells your token number
- **Doctor status:** See if doctor is Free or Busy

---

## 💼 For Staff: Registering Patients

### Required Fields:
```
1. Patient Name ..................... (text)
2. Age ......................... (numbers)
3. Blood Group ..................  (A+/B+/O+)
4. Weight (kg) ................. (numbers)
5. Blood Pressure ............. (120/80 format)
6. Phone Number ......... (10 digits, REQUIRED)
7. Doctor Assignment ................. (optional)
```

**Example:**
```
Name: Naveen Khan
Age: 45
Blood Group: A+
Weight: 70
BP: 120/80
Phone: 9876543210  ← This is what patient uses
Doctor: Dr. Yamuna
```

---

## 🚀 Access Points

**For Patients:**
- URL: `http://your-hospital.com/patient-tracking`
- No login needed
- Mobile-optimized

**For Staff:**
- Sidebar: "Patient Tracking" menu
- Alternative: "Patients" to add/edit

---

## ⚡ Key Features

✅ **10-digit phone verification**
✅ **Real-time queue tracking**
✅ **Live wait time display**
✅ **Doctor status updates**
✅ **Mobile-responsive design**
✅ **No login required**
✅ **Instant status check**
✅ **Token management**

---

## 📋 Common Scenarios

### Scenario 1: Just Arrived
```
Patient enters phone → System shows "Awaiting Assignment"
Action: Hospital assigns doctor
Timeline: 5-15 minutes
```

### Scenario 2: Doctor Assigned, Waiting
```
Phone search → Doctor assigned, Token #2, Doctor Busy
Action: Patiently wait, refresh to see updates
Timeline: 15-30 minutes depending on queue
```

### Scenario 3: Your Turn Now
```
Phone search → Consultation In Progress, Wait Time 5m
Action: Get ready, doctor will see you immediately
Timeline: <5 minutes
```

### Scenario 4: All Done
```
Phone search → Consultation Completed ✅
Action: Go to reception for prescription/reports
Timeline: Done
```

---

## ❓ FAQ

**Q: Why isn't my phone number found?**
A: Phone number wasn't registered or is different format. Ask reception.

**Q: How often do I refresh?**
A: Refresh anytime to see latest status. Especially when expecting your turn.

**Q: Can I share my phone number with others?**
A: Yes, anyone can use your number to check your status.

**Q: Does patient need to login?**
A: NO! Patient tracking is public. No login needed.

**Q: Is my data secure?**
A: Only public consultation status shown. Personal data not visible.

---

## 📊 Workflow

```
Patient Registered → Doctor Assigned → List Updated →
Consultation → Queue Managed → Status Shown →
Patient Checks Phone → Real-Time Info Displayed
```

---

**For Questions:** Contact Reception / IT Support
**Need Help?** Ask hospital staff at desk
