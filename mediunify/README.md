# MediUnify — Doctor App (Frontend)

React Native (Expo SDK 57) frontend for the MediUnify Doctor app. Frontend-only —
all data is mocked in `src/data/mockData.js` and login/registration are simulated
in `src/context/AuthContext.js`. No admin verification step: both signing in
and signing up go straight to the home screen.

## Versions
- Expo SDK ~57.0.19
- React Native 0.86.3
- React 19.2.3 / React DOM 19.2.3
- React Native Web 0.21.x

## Flow
Welcome (logo) → Sign In **or** Sign Up → (Sign Up only) Super Admin
Verification screen with a temporary **Skip for Now** button → Home

From Home: Appointments · Patients · Earnings · Availability (4 cards) +
Today's Appointments. Bottom tabs: Home, Appointments, Patients, Profile.

Appointments booked by patients on the patient-side app show up here already
tagged **Video** or **In-Person** — the doctor doesn't set the type, just acts
on it (accept/reject, then start the video call or the in-person consultation).
The Appointments screen splits these into two tabs (In-Person / Video
Consultation), each with its own Today / Pending / Completed / Cancelled
counts.

## What's included
- Registration & Login, with a Super Admin verification step after sign-up
  (currently has a **Skip for Now** button since real verification isn't
  wired to a backend yet — see `VerificationScreen.js` and
  `AuthContext.skipVerification`)
- Doctor profile: personal info, professional details, clinic info,
  qualifications, languages, consultation fee
- Speciality & Service Management — edit primary speciality and the list of
  services patients can book
- Availability — one week's schedule with independent Morning / Afternoon /
  Evening toggles per day, so a doctor who's out for part of a day doesn't
  have to block the whole day; a line shows exactly what patients will see
- Appointment management — In-Person and Video Consultation tabs, each with
  Today / Pending / Completed / Cancelled counts, accept/reject, follow-up tags
- In-person consultation — Patient Details card, consultation notes form
  (complaint, symptoms, diagnosis, treatment plan), and a distinct Follow-Up
  card with a Video/In-Person type picker
- Video consultation — simulated call screen with patient-info overlay
  (age, blood group, allergies, vitals, conditions), plus in-call quick access
  to a Clinical Perception notes panel and the Lab Requirement form without
  ending the call
- Patient records — name, age, blood group, allergies, vitals (heart rate,
  blood pressure, blood sugar), record counts, consultation history, uploaded
  documents, a "Request Document" action, and a health-record access-consent
  badge. **No phone number or email shown anywhere in patient-facing views.**
- Digital prescription builder (multi-medicine, dosage/frequency/duration)
- Test Requirement form — lab tests, radiology/scans, and pharmacy/medicine
  requirements the doctor wants the patient to get done (a one-way request,
  not an order-tracking screen)
- Follow-Ups screen — list of patients due for a follow-up review
- Earnings — today/monthly totals, payment history, withdraw-to-bank flow
- Notifications screen and an Emergency call action, both reachable from a
  consistent header (with the MediUnify logo) on every screen

## Theme
White background throughout, with teal (`#0F766E`) and orange (`#F97316`) as
the accent colors — including the notification (teal) and emergency (orange)
buttons that appear in the header of every screen. Tokens live in
`src/theme/colors.js`.

## Run it

If you're re-installing over a previous copy of this project, **delete the old
`node_modules` folder and `package-lock.json` first**:

```bash
cd mediunify
rmdir /s /q node_modules      # macOS/Linux: rm -rf node_modules
del package-lock.json         # macOS/Linux: rm package-lock.json
npm install
npx expo install --fix
npx expo start -c
```

Scan the QR code with **Expo Go** (must support SDK 57) on your phone, or
press `a` / `i` in the terminal for an Android/iOS simulator, or `w` for web.

If the QR code won't connect, run `npx expo start --tunnel` instead — this
routes the connection over the internet instead of your local Wi-Fi, which
fixes most connection issues on locked-down or mismatched networks.

## Structure

```
App.js
src/
  assets/logo.png          — MediUnify logo, used across Welcome/Login/Home
  theme/colors.js           — design tokens (white theme, teal + orange accents)
  components/               — Card, AppButton, AppInput, StatusPill,
                               ScreenHeader, Logo, TypeTag
  context/AuthContext.js    — mock auth (Sign Up and Sign In both authenticate)
  data/mockData.js          — mock doctor, patients, appointments, wallet, etc.
  navigation/
    AuthStack.js             — Welcome, Registration, Login
    MainTabs.js               — Home, Appointments, Patients, Profile
    RootNavigator.js          — swaps Auth/App stacks, hosts detail screens
  screens/
    WelcomeScreen.js
    RegistrationScreen.js
    VerificationScreen.js      (Super Admin verification, Skip for Now)
    LoginScreen.js
    DashboardScreen.js        (Home)
    AppointmentsScreen.js     (In-Person / Video Consultation tabs)
    PatientsScreen.js
    PatientProfileScreen.js
    ConsultationScreen.js     (in-person notes form + Follow-Up card)
    VideoConsultationScreen.js
    PrescriptionScreen.js
    TestRequirementScreen.js
    SpecialityServicesScreen.js
    FollowUpsScreen.js
    EarningsScreen.js
    AvailabilityScreen.js
    ProfileScreen.js
    NotificationsScreen.js
```

## Notes for wiring up a real backend
- Replace the mock `register`/`login` functions in `AuthContext.js` with real
  API calls.
- Replace `src/data/mockData.js` with data fetched from your backend.
- Appointment type (Video/In-Person) should come from whatever the patient
  selected on the patient-side app — the doctor app only reflects it.
- `VideoConsultationScreen.js` is a simulated call UI. Wire it to your actual
  video SDK (Twilio, Agora, Daily, etc.) by replacing the mock timer/controls
  with real call state.




1. see in ui interface make today , pending, complete button little small box like small rectangle so the down list field can see

2.  give same gap btw the button and card

3. make  proper ui-interface

4. make logo aviablity in all page and give broder to logo 

5.  give border colour to the card and button 

6.  make proper ui -interface

7.  after create account just give pop up that " thanks doctor your credentials have be super admin verfication we well notify u once profile i approved "    ok button


 