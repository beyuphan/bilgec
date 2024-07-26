let questions = [];
let usedQuestions = [];
let currentQuestionIndex = -1;
let correctCount = 0;
let incorrectCount = 0;
let deletejoker = 1;
let shieldjoker = 1;
let timeLeft = 90;
let timerInterval;
let scaleFactor = 1;

// JSON dosyasını çağır ve verileri kullan
fetch('bilgec_quiz_formatted_questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        updateProgress(true);
        startTimer();
        loadNextQuestion();
    })
    .catch(error => console.error('Error fetching JSON:', error));

function loadNextQuestion() {   
    
    if (currentQuestionIndex + 1 >= 15) {
        showResults();
        return;
    }

    currentQuestionIndex++;
    let question;

    switch (currentQuestionIndex+1) {
        case 1:
        case 2:
        case 3: 
        case 4:
            do {
                const randomIndex = Math.floor(Math.random() * questions.length);
                question = questions[randomIndex];
            } while (usedQuestions.includes(question) || question.stage !== 1);
            break;
        case 5:
        case 6:
        case 7:
        case 8:
            do {
                const randomIndex = Math.floor(Math.random() * questions.length);
                question = questions[randomIndex];
            } while (usedQuestions.includes(question) || question.stage !== 2);
            break;
        case 9:
        case 10:
        case 11:
        case 12:
            do {
                const randomIndex = Math.floor(Math.random() * questions.length);
                question = questions[randomIndex];
            } while (usedQuestions.includes(question) || question.stage !== 3);
            break;
        case 13:
        case 14:
        case 15:
            do {
                const randomIndex = Math.floor(Math.random() * questions.length);
                question = questions[randomIndex];
            } while (usedQuestions.includes(question) || question.stage !== 4);
            break;
        default:
           
    }
    
    usedQuestions.push(question);// Seçilen soruyu ekle

    console.log(usedQuestions.length);
    // Soru metnini ayarla
    document.querySelector('.soru-yazi').innerText = question.text;
   
 

    // Şıkları ayarla
    const options = document.querySelectorAll('.option');
    question.options.forEach((option, index) => {
        options[index].innerText = option.text;
        options[index].dataset.correct = option.correct;
        options[index].classList.remove('correct', 'incorrect');
        options[index].disabled = false;
        options[index].style.display = 'inline-block';
    });

    document.getElementById('delete-joker').addEventListener('click', function() {
        if (deletejoker>0){
            setTimeout(hideOneIncorrectOptions, 300);
            this.style.color = 'gray';
            deletejoker--;
        }
        else{
            this.style.userSelect = 'none';
        }
    });
    document.getElementById('shield-joker').addEventListener('click', function() {
        if (shieldjoker>0){
            setTimeout(hideTwoIncorrectOptions, 300);
            this.style.color = 'gray';
            shieldjoker--;
        }
        else{
            this.style.userSelect = 'none';
        }
    });
    // Şıklar butonlarına tıklama olayını ekle
    options.forEach(button => {
        button.onclick = function() {
            if (this.dataset.correct === 'true') {
                this.classList.add('correct');
                correctCount++;
                setTimeout(updateProgress, 1000, true);
                setTimeout(loadNextQuestion, 1000); // 1 saniye bekleme süresi
            } else {
                this.classList.add('incorrect');
                showCorrectAnswer(options);
                incorrectCount++;
                updateProgress(false);
                setTimeout(showResults, 1000); 
            }
            options.forEach(btn => btn.disabled = true);
           
        };
    });
}

function showCorrectAnswer(options) {
    options.forEach(btn => {
        if (btn.dataset.correct === 'true') {
            btn.classList.add('correct');
        }
    });
}

function updateProgress(correct) {
    const kutular = document.querySelectorAll('.kutu');
    if (correct) {
        if (currentQuestionIndex >= 0) {
            kutular[currentQuestionIndex].classList.add('correct');
        }
        kutular[currentQuestionIndex+1].classList.add('active');
    } else {
        kutular[currentQuestionIndex].classList.add('incorrect');
    }
}
function showResults() {
    document.querySelector('.alt').style.display = 'none';
    document.querySelector('.sayac').style.display = 'none';
    document.querySelector('.sonuc-bolumu').style.display = 'block';
    document.getElementById('correct-count').innerText = correctCount;
    document.getElementById('incorrect-count').innerText = incorrectCount;
    if (correctCount==15){
        document.getElementById('final-text').innerText = "Helal lan sana yarrağım çıkart gölgende ferahlayalım nesin sen böyle kralll";
    }else if (correctCount < 15 && correctCount >=12){
        document.getElementById('final-text').innerText = "valla iyisin keke milyonere katılsana parayı ezelim";
    }else if (correctCount < 12 && correctCount >=8){
        document.getElementById('final-text').innerText = "şanssızlık olmuş kafaya takma bi daha dene";
    }else if(correctCount <8 && correctCount >=4){
        document.getElementById('final-text').innerText = "umarım yanlış basmışsındır zira bu soruyu yanlış yapacak bir cahille arkadaşlık kurmuş olmak son isteyeceğim şey olurdu";

    }else if(correctCount <4 && correctCount >0){
        document.getElementById('final-text').innerText = "ŞGLSKAŞFLASKŞLFKASŞFLASKŞFLAFŞALKS AMINA KOYDUĞUMUN SALAĞI ASLFŞKASLŞFKJASŞLFKASŞLFKASŞFLKASŞFKAS BEYNİNİ Mİ UNUTTUN AMK ADKAŞLDKAŞLDKAŞLDKASŞLD OKUMA YAZMA BİLMESEM BİLE YAPARDIM BUNLARIL LKAFSDLŞASFLŞKASFŞLASKFŞASLK";
    }
    else{
        document.getElementById('final-text').innerText = "Elin mi yok kolun mu oynasana amk malı"
    }
}
document.getElementById('restart-button').addEventListener('click', resetGame);

function resetGame() {
    clearInterval(timerInterval);
    startTimer();

    const kutular = document.querySelectorAll('.kutu');
    kutular.forEach(kutu => {
        kutu.classList.remove('correct', 'active', 'incorrect');
    });
    kutular[0].classList.add('active');
    deletejoker = 1;
    shieldjoker = 1;
    usedQuestions = [];
    currentQuestionIndex = -1;
    setTimeout(loadNextQuestion, 1); // 1 saniye bekleme süresi
    correctCount = 0;
    incorrectCount = 0;
    currentQuestionIndex = -1;
    document.querySelector('.alt').style.display = 'flex';
    document.querySelector('.sayac').style.display = 'flex';
    document.querySelector('.sonuc-bolumu').style.display = 'none';
    document.getElementById('shield-joker').style.color = 'rgb(39, 167, 0)';
    document.getElementById('phone-joker').style.color = 'rgb(39, 167, 0)';
    updateProgress(true);
}

function hideTwoIncorrectOptions() {
    const options = document.querySelectorAll('.option');
    let incorrectOptions = [];
    options.forEach(btn => {
        if (btn.dataset.correct === 'false') {
            incorrectOptions.push(btn);
        }
    });

    // Rastgele iki yanlış seçeneği gizleyelim
    for (let i = 0; i < 2 && incorrectOptions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        incorrectOptions[randomIndex].style.display = 'none';
        incorrectOptions.splice(randomIndex, 1);
    }
}

function hideOneIncorrectOptions() {
    const options = document.querySelectorAll('.option');
    let incorrectOptions = [];
    options.forEach(btn => {
        if (btn.dataset.correct === 'false') {
            incorrectOptions.push(btn);
        }
    });

    // Rastgele bir yanlış seçeneği gizleyelim
    for (let i = 0; i < 1 && incorrectOptions.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        incorrectOptions[randomIndex].style.display = 'none';
        incorrectOptions.splice(randomIndex, 1);
    }
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
    if (timeLeft > 0) {
        timeLeft--;
        if (timeLeft < 10) {
            document.getElementById('timer-bg').style.backgroundColor = 'red';
            document.getElementById('timer').style.color = 'white';
            scaleFactor += 0.03;
            document.getElementById('timer').style.transform = `scale(${scaleFactor})`;
            document.getElementById('timer-bg').style.transform = `scale(${scaleFactor})`;
        }
    } else {
        clearInterval(timerInterval);
        updateProgress(false);
        showResults(false);
        document.getElementById('timer-bg').style.backgroundColor = '#2ecc71';
        document.getElementById('timer').style.color = 'black';
        document.getElementById('timer').style.transform = `scale(1)`;
        document.getElementById('timer-bg').style.transform = `scale(1)`;
        scaleFactor = 1;
    }
}
function startTimer() {
    timeLeft = 90;
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

