document.addEventListener("DOMContentLoaded",()=>{

const tutorial=document.getElementById("tutorial");
const levels=document.getElementById("levels");
const startBtn=document.getElementById("startBtn");
const lvl3=document.getElementById("lvl3");
const cards=document.getElementById("cards");
const qna=document.getElementById("qna");
const questionText=document.getElementById("questionText");
const answerButtons=document.getElementById("answerButtons");

// START
startBtn.addEventListener("click",()=>{
    tutorial.classList.add("hidden");
    levels.classList.remove("hidden");
});

// LEVEL 3
lvl3.addEventListener("click",()=>{
    levels.classList.add("hidden");
    cards.classList.remove("hidden");
    openLevel(3);
});

// ORQAGA tugmasi
function addBackBtn(showHideTarget1,showHideTarget2){
    const btn=document.createElement("button");
    btn.innerText="Orqaga";
    btn.className="backBtn";
    btn.onclick=()=>{
        showHideTarget2.classList.add("hidden");
        showHideTarget1.classList.remove("hidden");
        cards.innerHTML='';
        qna.classList.add("hidden");
    };
    return btn;
}

// CARD SYSTEM
function openLevel(level){
    cards.innerHTML='';
    qna.classList.add("hidden");
    cards.appendChild(addBackBtn(levels,cards));

    const shuffled = [...questions[level]].sort(()=>0.5-Math.random());

    shuffled.forEach((q,i)=>{
        const card=document.createElement("div");
        card.className="card";
        card.id="card-"+(i+1);

        const inner=document.createElement("div"); inner.className="inner";

        const front=document.createElement("div"); front.className="front"; front.innerText=i+1;

        const back=document.createElement("div"); back.className="back";
        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        cards.appendChild(card);

        card.onclick=()=>{
            card.classList.toggle("flipped");

            // Tasodifiy javoblar
            const answers=[q.correct,...q.options.filter(opt=>opt!==q.correct)];
            for(let i=answers.length-1;i>0;i--){
                const j=Math.floor(Math.random()*(i+1));
                [answers[i],answers[j]]=[answers[j],answers[i]];
            }

            // Savol va javoblar
            questionText.innerText=q.q;
            answerButtons.innerHTML='';
            answers.forEach(opt=>{
                const btn=document.createElement("button");
                btn.innerText=opt;
                btn.onclick=()=>{
                    alert(`Tanlading: ${opt}\nTo'g'ri: ${q.correct}`);
                    card.remove();
                    questionText.innerText='';
                    answerButtons.innerHTML='';
                    qna.classList.add("hidden");
                };
                answerButtons.appendChild(btn);
            });
            qna.classList.remove("hidden");
        };
    });
}

});