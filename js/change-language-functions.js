var languageContent = {
  el: {
    languageBtn: "EL",
    mainTitle: "Κτήση Ελληνικής Ιθαγένειας λόγω Γέννησης και Φοίτησης στην Ελλάδα",
    pageTitle: "Κτήση Ελληνικής Ιθαγένειας λόγω Γέννησης και Φοίτησης στην Ελλάδα",
    infoTitle: "Πληροφορίες για την κτήση Ελληνικής ιθαγένειας λόγω γέννησης και φοίτησης στην Ελλάδα",
    subTitle1:
      "Αυτό το ερωτηματολόγιο μπορεί να σας βοηθήσει να βρείτε αν το παιδί σας μπορεί να λάβει την Ελληνική ιθαγένεια.",
    subTitle2: "H συμπλήρωση του ερωτηματολογίου δεν απαιτεί παραπάνω από 10 λεπτά.",
    subTitle3: "Δεν θα αποθηκεύσουμε ούτε θα μοιραστούμε τις απαντήσεις σας.",
    backButton: "Πίσω",
    nextQuestion: "Επόμενη ερώτηση",
    biggerCursor: "Μεγαλύτερος Δρομέας",
    bigFontSize: "Μεγάλο Κείμενο",
    readAloud: "Ανάγνωση",
    changeContrast: "Αντίθεση",
    readingMask: "Μάσκα Ανάγνωσης",
    footerText:
      "Αυτό το έργο δημιουργήθηκε για τις ανάγκες της πτυχιακής μας εργασίας κατά τη διάρκεια των προπτυχιακών μας σπουδών στο Πανεπιστήμιο Μακεδονίας. Η ομάδα μας αποτελείται από 2 φοιτήτριες της Εφαρμοσμένης Πληροφορικής:",
    and: "και",
    student1: "Αμπατζίδου Ελισάβετ",
    student2: "Δασύρα Ευμορφία Ελπίδα",
    startBtn: "Ας ξεκινήσουμε",
    chooseAnswer: "Επιλέξτε την απάντησή σας",
    oneAnswer: "Μπορείτε να επιλέξετε μόνο μία επιλογή.",
    errorAn: "Λάθος:",
    choose: "Πρέπει να επιλέξετε μια απάντηση",
    faqTitle: "Συχνές Ερωτήσεις",
    rejectionMessage: "Λυπούμαστε αλλά το παιδί σας δεν μπορεί να λάβει την Ελληνική ιθαγένεια.",
    eligibleMessage: "Το παιδί σας μπορεί να λάβει την Ελληνική ιθαγένεια!",
    evidencesTitle: "Τα δικαιολογητικά που πρέπει να προσκομίσετε είναι τα εξής:",
    submit: "Υποβολή",
  },
  en: {
    languageBtn: "EN",
    mainTitle: "Transportation Card for the Disabled",
    pageTitle: "Transportation Card for the Disabled",
    infoTitle: "Information on the issue of Transportation Cards for the Disabled 2023",
    subTitle1:
      "This questionnaire can help you determine if you are eligible to receive the transportation card for the Disabled.",
    subTitle2: "Completing the questionnaire should not take more than 10 minutes.",
    subTitle3: "We will neither store nor share your answers.",
    backButton: "Βack",
    nextQuestion: "Next Question",
    biggerCursor: "Bigger Cursor",
    bigFontSize: " Big Font Size",
    readAloud: "Read Aloud",
    changeContrast: " Change Contrast",
    readingMask: " Reading Mask",
    footerText:
      "This project was created for the needs of our thesis at the University of Macedonia. Our team consists of 2 students of Applied Informatics:",
    and: "and",
    student1: "Ampatzidou Elisavet",
    student2: "Dasyra Evmorfia Elpida",
    startBtn: "Let's start",
    chooseAnswer: "Choose your answer",
    oneAnswer: "You can choose only one option.",
    errorAn: "Error:",
    choose: "You must choose one option",
  },
};

// Retrieve the selected language from localStorage or set default to "el"
var currentLanguage = "el";
// let storedLang = localStorage.getItem("preferredLanguage");
// if (storedLang && languageContent[storedLang]) {
//   currentLanguage = storedLang;
// }
localStorage.setItem("preferredLanguage", currentLanguage);

function toggleLanguage() {
  currentLanguage = currentLanguage === "el" ? "en" : "el";
  localStorage.setItem("preferredLanguage", currentLanguage);
  updateContent();
  start();
}

function updateContent() {
  var components = document.querySelectorAll(".language-component");

  components.forEach(function (component) {
    var componentName = component.dataset.component;
    component.textContent = languageContent[currentLanguage][componentName];
  });
}

// Initialize the content based on the selected language
updateContent();
