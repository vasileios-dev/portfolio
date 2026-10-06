# Portfolio · Vasileios Dimitropoulos

Δίγλωσσο (EN / ΕΛ) στατικό portfolio. Καθαρό HTML, CSS και JavaScript, χωρίς framework και χωρίς dependencies.

## Δομή

```
index.html          Αγγλική σελίδα (παράγεται από το build)
el/index.html       Ελληνική σελίδα (παράγεται από το build)
content/en.json     Όλα τα αγγλικά κείμενα
content/el.json     Όλα τα ελληνικά κείμενα
assets/css/style.css
assets/js/main.js   Φόρμα επικοινωνίας
assets/img/         Εικόνες
build.mjs           Φτιάχνει τα index.html από τα JSON
```

## Πώς αλλάζω κείμενα

1. Άλλαξε το `content/en.json` ή το `content/el.json`.
2. Τρέξε `node build.mjs`.
3. Ανέβασε τις αλλαγές στο GitHub. Το Vercel ενημερώνει το site μόνο του.

Τα στοιχεία επικοινωνίας, το domain, το link για ραντεβού και τη φόρμα τα αλλάζεις στην αρχή του `build.mjs` (μπλοκ `site`).

## Τι μένει να συνδεθεί

- **Φόρμα:** φτιάξε δωρεάν λογαριασμό στο formspree.io, δημιούργησε μια φόρμα και βάλε το id της στο `formAction`.
- **Ραντεβού:** φτιάξε δωρεάν λογαριασμό στο cal.com (ή στο Calendly) με ένα event 20 λεπτών και βάλε το link στο `bookingUrl`.
- **Domain:** όταν το αγοράσεις, βάλε το στο `url`.

## Δημοσίευση στο Vercel (δωρεάν)

1. Φτιάξε νέο repo στο GitHub (π.χ. `portfolio`) και ανέβασε αυτόν τον φάκελο.
2. Μπες στο vercel.com με τον λογαριασμό σου στο GitHub, πάτα **Add New → Project** και διάλεξε το repo.
3. Framework preset: **Other**. Build command: `node build.mjs`. Output directory: `.` (η ρίζα).
4. Πάτα **Deploy**. Σε ένα λεπτό είναι online.
5. Για δικό σου domain: Project → Settings → Domains.

Για τοπική προβολή: `npx serve .` ή άνοιξε απευθείας το `index.html`.
