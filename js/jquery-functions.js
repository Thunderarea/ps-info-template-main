var currentQuestion = 0;
var totalQuestions = 0;
var userAnswers = {};
var all_questions = {};
var questionIds = [];
var all_evidences;
var faq;
var texts = {};

//hide the form buttons when its necessary
function hideFormBtns() {
  $("#nextQuestion").hide();
  $("#backButton").hide();
}

function getTexts() {
  return fetch(`question-utils/texts-${currentLanguage}.json`)
    .then((response) => response.json())
    .then((data) => {
      texts = data;
    })
    .catch((error) => {
      showFileFetchError(`texts-${currentLanguage}.json`, error);
    });
}

//Once the form begins, the questions' data and length are fetched.
function getQuestions() {
  return fetch(`question-utils/all-questions-${currentLanguage}.json`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((question) => {
        all_questions[question.id] = question;
        questionIds.push(question.id);
      });
      totalQuestions = questionIds.length;
    })
    .catch((error) => {
      showFileFetchError(`all-questions-${currentLanguage}.json`, error);
    });
}

//Once the form begins, the evidences' data and length are fetched.
function getEvidences() {
  return fetch(`question-utils/cpsv-${currentLanguage}.json`)
    .then((response) => response.json())
    .then((data) => {
      all_evidences = data;
      totalEvidences = data.length;
    })
    .catch((error) => {
      showFileFetchError(`cpsv-${currentLanguage}.json`, error);
    });
}

async function getResultMessages() {
  try {
    const response = await fetch(`question-utils/result-messages-${currentLanguage}.json`);
    const data = await response.json();
    return data;
  } catch (error) {
    showFileFetchError(`result-messages-${currentLanguage}.json`, error);
  }
}

//Once the form begins, the faqs' data is fetched.
function getFaq() {
  return fetch(`question-utils/faq-${currentLanguage}.json`)
    .then((response) => response.json())
    .then((data) => {
      faq = data;
      totalFaq = data.length;
    })
    .catch((error) => {
      showFileFetchError(`faq-${currentLanguage}.json`, error, false);
    });
}

function showFileFetchError(fileName, error, hideBtns = true) {
  console.error(`Failed to fetch ${fileName}:`, error);
  // Show error message to the user
  const errorMessage = document.createElement("div");
  errorMessage.textContent = `Error: Failed to fetch ${fileName}.`;
  $(".question-container").html(errorMessage);
  hideBtns && hideFormBtns();
}

//text added in the final result
function setResult(text) {
  const resultWrapper = document.getElementById("resultWrapper");
  const result = document.createElement("h5");
  result.textContent = text;
  resultWrapper.appendChild(result);
}

function loadFaqs() {
  var faqElement = document.createElement("div");

  faqElement.innerHTML = `
        <div class="govgr-heading-m language-component" data-component="faq" tabIndex="15">
          ${texts.faqTitle}
        </div>
    `;

  var ft = 16;
  faq.forEach((faqItem) => {
    var faqSection = document.createElement("details");
    faqSection.className = "govgr-accordion__section";
    faqSection.tabIndex = ft;

    faqSection.innerHTML = `
        <summary class="govgr-accordion__section-summary">
          <h2 class="govgr-accordion__section-heading">
            <span class="govgr-accordion__section-button">
              ${faqItem.question}
            </span>
          </h2>
        </summary>
        <div class="govgr-accordion__section-content">
          <p class="govgr-body">
          ${convertURLsToLinks(faqItem.answer)}
          </p>
        </div>
      `;

    faqElement.appendChild(faqSection);
    ft++;
  });

  $(".faqContainer").html(faqElement);
}

// get the url from faqs and link it
function convertURLsToLinks(text) {
  return text.replace(/https:\/\/www\.gov\.gr\/[\S]+/g, '<a href="$&" target="_blank">' + "myKEPlive" + "</a>" + ".");
}

//Εachtime back/next buttons are pressed the form loads a question
function loadQuestion(noError) {
  $("#nextQuestion").show();
  if (currentQuestion > 0) {
    $("#backButton").show();
  }

  question = all_questions[questionIds[currentQuestion]];

  var questionElement = document.createElement("div");

  const optionsHTML = `
      ${question.options
        .map(
          (option, index) => `
            <div class='govgr-radios__item'>
                <label class='govgr-label govgr-radios__label'>
                    ${option.text}
                    <input class='govgr-radios__input' type='radio' name='question-option' value='${option.text}' />
                </label>
            </div>
          `
        )
        .join("")}
    `;

  //If the user has answered the question (checked a value), no error occurs. Otherwise you get an error (meaning that user needs to answer before he continues to the next question)!
  if (noError) {
    questionElement.innerHTML = `
                <div class='govgr-field'>
                    <fieldset class='govgr-fieldset' aria-describedby='radio-country'>
                        <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                            ${question.question}
                        </legend>
                        <div class='govgr-radios' id='radios-${currentQuestion}'>
                            <ul>
                                ${optionsHTML}
                            </ul>
                        </div>
                    </fieldset>
                </div>
            `;
  } else {
    questionElement.innerHTML = `
            <div class='govgr-field govgr-field__error' id='$id-error'>
            <legend role='heading' aria-level='1' class='govgr-fieldset__legend govgr-heading-l'>
                        ${question.question}
                    </legend>
                <fieldset class='govgr-fieldset' aria-describedby='radio-error'>
                    <legend  class='govgr-fieldset__legend govgr-heading-m language-component' data-component='chooseAnswer'>
                        Επιλέξτε την απάντησή σας
                    </legend>
                    <p class='govgr-hint language-component' data-component='oneAnswer'>Μπορείτε να επιλέξετε μόνο μία επιλογή.</p>
                    <div class='govgr-radios id='radios-${currentQuestion}'>
                        <p class='govgr-error-message'>
                            <span class='govgr-visually-hidden language-component' data-component='errorAn'>Λάθος:</span>
                            <span class='language-component' data-component='choose'>Πρέπει να επιλέξετε μια απάντηση</span>
                        </p>
                            ${optionsHTML}
                    </div>
                </fieldset>
            </div>
        `;

    //The reason for manually updating the components of the <<error>> questionElement is because the
    //querySelectorAll method works on elements that are already in the DOM (Document Object Model)
    if (currentLanguage === "en") {
      // Manually update the english format of the last 4 text elements in change-language.js
      //chooseAnswer: "Choose your answer",
      //oneAnswer: "You can choose only one option.",
      //errorAn: "Error:",
      //choose: "You must choose one option"
      var components = Array.from(questionElement.querySelectorAll(".language-component"));
      components.slice(-4).forEach(function (component) {
        var componentName = component.dataset.component;
        component.textContent = languageContent[currentLanguage][componentName];
      });
    }
  }

  $(".question-container").html(questionElement);
}

function skipToEnd(message) {
  currentQuestion = -1;
  const errorEnd = document.createElement("h5");
  errorEnd.className = "govgr-error-summary";
  errorEnd.textContent = texts.rejectionMessage + " " + message;
  $(".question-container").html(errorEnd);
  hideFormBtns();
}

function addEvidence(selectedEvidence) {
  const evidenceListElement = document.getElementById("evidences");
  selectedEvidence.evs.forEach((evsItem) => {
    const listItem = document.createElement("li");
    listItem.textContent = evsItem.name;
    evidenceListElement.appendChild(listItem);
  });
}

function conditionsAreMet(item, allAnswers) {
  return item.conditions.some((group) =>
    group.every((condition) => {
      const userAnswer = allAnswers[condition.question];
      const matches = condition.answer.includes(userAnswer);
      return condition.should ? matches : !matches;
    })
  );
}

function collectResults() {
  let allAnswers = {};

  questionIds.forEach((questionId) => {
    let optionIndex = sessionStorage.getItem(questionId);
    allAnswers[questionId] = parseInt(optionIndex);
  });
  console.log(allAnswers);

  collectEvidences(allAnswers);
  collectResultMessages(allAnswers);
}

function collectEvidences(allAnswers) {
  all_evidences.forEach((evidence) => {
    if ("conditions" in evidence) {
      conditionsAreMet(evidence, allAnswers) && addEvidence(evidence);
    } else addEvidence(evidence);
  });
}

async function collectResultMessages(allAnswers) {
  const messages = await getResultMessages();
  messages.forEach((message) => {
    if ("conditions" in message) {
      conditionsAreMet(message, allAnswers) && setResult(message.text);
    } else setResult(message.text);
  });
}

function submitForm() {
  const resultWrapper = document.createElement("div");
  resultWrapper.innerHTML = `<h1 class='answer'>${texts.eligibleMessage}</h1>`;
  resultWrapper.setAttribute("id", "resultWrapper");
  $(".question-container").html(resultWrapper);

  const evidenceListElement = document.createElement("ol");
  evidenceListElement.setAttribute("id", "evidences");
  $(".question-container").append(`<br /><br /><h5 class='answer'>${texts.evidencesTitle}</h5><br />`);
  $(".question-container").append(evidenceListElement);
  $("#faqContainer").load("faq.html");
  collectResults();
  hideFormBtns();
}

function start() {
  // Get text
  getTexts().then(() => {
    // Get all questions
    getQuestions().then(() => {
      // Get all evidences
      getEvidences().then(() => {
        // Get all faqs
        getFaq().then(() => {
          // Code inside this block executes only after all data is fetched
          // load  faqs and the first question on page load
          loadFaqs();
          $("#faqContainer").show();
          loadQuestion(true);
        });
      });
    });
  });
}

$("document").ready(function () {
  $("#startBtn").click(function () {
    $("#intro").html("");
    $("#languageBtn").hide();
    $("#questions-btns").show();
  });

  $("#nextQuestion").click(function () {
    if ($(".govgr-radios__input").is(":checked")) {
      let selectedOptionIndex = $('input[name="question-option"]').index($('input[name="question-option"]:checked'));

      if ("skipToEnd" in all_questions[questionIds[currentQuestion]].options[selectedOptionIndex]) {
        skipToEnd(all_questions[questionIds[currentQuestion]].options[selectedOptionIndex].skipToEnd);
      } else {
        //save selectedOptionIndex to the storage
        userAnswers[currentQuestion] = selectedOptionIndex;
        sessionStorage.setItem(questionIds[currentQuestion], selectedOptionIndex); // save answer to session storage

        //if the questions are finished then...
        if (currentQuestion + 1 == totalQuestions) {
          submitForm();
        }
        // otherwise...
        else {
          currentQuestion++;
          loadQuestion(true);

          if (currentQuestion + 1 == totalQuestions) {
            $(this).text(texts.submit);
          }
        }
      }
    } else {
      loadQuestion(false);
    }
  });

  $("#backButton").click(function () {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion(true);

      // Retrieve the answer for the previous question from userAnswers
      let answer = userAnswers[currentQuestion];
      if (answer > -1) {
        $('input[name="question-option"]').eq(answer).prop("checked", true);
      }
    }
  });

  $("#languageBtn").click(function () {
    toggleLanguage();
    loadFaqs();
    // if is false only when the user is skipedToEnd and trying change the language
    if (currentQuestion >= 0 && currentQuestion < totalQuestions - 1) loadQuestion(true);
  });

  $("#questions-btns").hide();

  start();
});
