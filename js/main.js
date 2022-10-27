//select element

let countSPan = document.querySelector(".quiz-info .count span");
let mainBullets = document.querySelector(".quiz-app .bullets");
let bulletsContainer = document.querySelector(".quiz-app .bullets .bullet");
let quesTitle = document.querySelector(".quiz-area");
let answers = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".quiz-app .submit-btn");
let resultsContainer = document.querySelector(".result");

let timerTime = 60;
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myReq = new XMLHttpRequest();

  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;

      // create bullets + set question count
      createBullets(questionsCount);

      // add questions data
      addQuestionData(questionsObject[currentIndex], questionsCount);

      //start count down 
      timer(timerTime,questionsCount);

      submitBtn.onclick = function () {
        //get right answer
        let theRightAns = questionsObject[currentIndex].right_answer;

        //increase index to go to another question
        currentIndex++;

        // check the answer
        checkAnswer(theRightAns, questionsCount);

        //remove old question
        quesTitle.innerHTML = "";
        answers.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);

        //handle bullets action
        handleBullets();

        //start count down
        clearInterval(countDownInterval);
        timer(timerTime,questionsCount);
        // show results
        showResults(questionsCount);
      };
    }
  };
  myReq.open("GET", "htmlQ.json", true);
  myReq.send();
}

getQuestions();

function createBullets(num) {
  countSPan.innerHTML = num;

  // create bullets
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");

    if (i === 0) {
      theBullet.className = "on";
    }

    bulletsContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //create the Question
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);

    questionTitle.appendChild(questionText);
    quesTitle.appendChild(questionTitle);

    //create the answers

    for (let i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "ques";
      radioInput.type = "radio";
      radioInput.id = `ans_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      //make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      let label = document.createElement("label");
      label.htmlFor = `ans_${i}`;
      let labelText = document.createTextNode(obj[`answer_${i}`]);

      label.appendChild(labelText);

      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(label);
      answers.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rA, count) {
  let answers = document.getElementsByName("ques");
  let theChoosenAns;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAns = answers[i].dataset.answer;
    }
  }
  if (rA == theChoosenAns) {
    rightAnswers++;
    console.log("Good");
  } else {
    console.log(false);
  }
}

function handleBullets() {
  let arrayOfSpans = Array.from(
    document.querySelectorAll(".bullets .bullet span")
  );
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quesTitle.remove();
    answers.remove();
    submitBtn.remove();
    mainBullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} from ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, You got All Of Them Right`;
    } else {
      theResults = `<span class="bad">bad</span>, ${rightAnswers} from ${count}`;
    }

    resultsContainer.innerHTML = theResults;
  }
}

function timer(duration, count) {
  if(currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes= minutes < 10 ? `0${minutes}` : minutes;
      seconds= seconds < 10 ? `0${seconds}` : seconds;

      document.querySelector(".bullets .countdown .minutes").innerHTML=`${minutes}`;
      document.querySelector(".bullets .countdown .seconds").innerHTML=`${seconds}`;

      if(--duration < 0) {
        clearInterval(countDownInterval);
        submitBtn.click();
      }

      
    }, 1000);

  }
}





















