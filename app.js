const rules = document.querySelector(".rules")
let idTimeout, idInterval, score, idTimeout2;

localStorage.setItem("last-id", "0")

let playAudio = (url) => {
    return new Audio(url).play();
}

const getScore = () => {
    if(!localStorage.getItem("score"))
        localStorage.setItem("score", "0")
    return Number(localStorage.getItem("score"));
}

const setArena = (score) => {
    const toDisplay = document.querySelector(".score");
    toDisplay.innerText = score;
}

score = getScore();
setArena(score);

rules.addEventListener("click", () => {
    const background = document.createElement("div");
    background.classList.add("background-for-rules");

    const rulesContainer = document.createElement("div")
    rulesContainer.classList.add("rules-container");

    background.appendChild(rulesContainer)

    const theRules = document.createElement("img")
    theRules.classList.add("the-rules");
    theRules.setAttribute("src", "images/image-rules.svg");

    const goBack = document.createElement("img");
    goBack.classList.add("go-back");
    goBack.setAttribute("src", "images/icon-close.svg");

    goBack.addEventListener("click", () => {
        background.remove();
    })

    rulesContainer.append(theRules, goBack);

    const body = document.querySelector("body");
    body.appendChild(background);
})

const drawShadow = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.fillStyle = "rgb(0 0 0 / 10%)"
    ctx.beginPath();
    ctx.arc(0, 0, canvas.width/2, 0, 2*Math.PI, false)
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

const drawSuperShadow = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.fillStyle = "rgb(0 0 0 / 5%)"
    for(let i = 0; i < 4; i++){
        ctx.beginPath();
        ctx.arc(0, 0, (canvas.width/(2))*(1-i/8), 0, 2*Math.PI, false)
        console.log(canvas.width/(2-i/2))
        ctx.fill();
        ctx.closePath();
    }
    ctx.restore();
}

const createSide = (message, choice) => {
    let id = Number(localStorage.getItem("last-id"));
    id++;
    localStorage.setItem("last-id", id.toString());

    const shadowContainer = document.createElement("div")
    shadowContainer.classList.add("shadow-container")

    const side = document.createElement("div");
    side.classList.add("side");
    side.setAttribute("id", id);

    const title = document.createElement("h1");
    title.classList.add("side-title")
    title.innerText = message;

    const shadow = document.createElement("canvas");
    shadow.classList.add("shadow");
    
    shadowContainer.appendChild(shadow);
    side.append(title, shadowContainer);

    if(choice == null) return side;

    const tokenContainer = document.createElement("div");
    tokenContainer.classList.add("the-icon-container", choice);

    const token = document.createElement("div");
    token.classList.add("the-icon");

    tokenContainer.appendChild(token);
    shadowContainer.appendChild(tokenContainer)

    return side;
}

const checkOutcome = (playerChoice, computerChoice) => {
    switch(playerChoice){
        case "rock": 
            switch(computerChoice){
                case "rock": 
                    return 0;
                case "paper": 
                    return false;
                case "scissors": 
                    return true;
            }
        case "scissors": 
            switch(computerChoice){
                case "rock": 
                    return false;
                case "paper": 
                    return true;
                case "scissors": 
                    return 0;
            }
            break; 
        case "paper":
            switch(computerChoice){
                case "rock": 
                    return true;
                case "paper": 
                    return 0;
                case "scissors": 
                    return false;
            }
    }
}

const setGame = (playerChoice) => {

    const main = document.querySelector(".container")
    const container = document.querySelector(".weapon-container")
    container.innerHTML = "";
    container.classList.remove("weapon-container");
    container.classList.add("step-2-container");
    
    let computerSide = {
        element: createSide("THE HOUSE PICKED", null), 
        title: "", 
        shadow: "", 
        ctx: "",
    }

    computerSide.title = computerSide.element.querySelector(".side-title");
    computerSide.shadow = computerSide.element.querySelector(".shadow");
    computerSide.shadow.width = 224;
    computerSide.shadow.height = 224;
    computerSide.ctx = computerSide.shadow.getContext("2d");
    drawShadow(computerSide.shadow, computerSide.ctx)
    
    let choices = ["rock","paper", "scissors"]
    let computerChoice = choices[Math.floor(Math.random()*3)];
    let outcome = checkOutcome(playerChoice, computerChoice);

    const presentation = document.createElement("div");
    presentation.classList.add("presentation");

    const presentationTitle = document.createElement("h1");
    presentationTitle.classList.add("presentation-title");

    const replay = document.createElement("div")
    replay.classList.add("replay");
    replay.innerText = "PLAY AGAIN";
    replay.addEventListener("click", () => {
        location.reload();
    })

    presentation.append(presentationTitle, replay);
    
    let playerSide = {
        element: createSide("YOU PICKED", playerChoice), 
        title: "", 
        shadow: "", 
        ctx: "",
    }

    playerSide.title = playerSide.element.querySelector(".side-title");
    playerSide.shadow = playerSide.element.querySelector(".shadow");
    playerSide.shadow.width = 224;
    playerSide.shadow.height = 224;
    playerSide.ctx = playerSide.shadow.getContext("2d");
    drawShadow(playerSide.shadow, playerSide.ctx)
    
    container.append(playerSide.element, computerSide.element);
    
    playAudio("drum-roll.mp3");
    computerSide.title.innerText = "THE HOUSE PICKED";
    
    let i = 0;
    idInterval = setInterval(() => {
        if(i == 3){
            i = 0;
            computerSide.title.innerText = "THE HOUSE PICKED";
        }
        computerSide.title.innerText += ".";
        i++;
    }, 333)


    idTimeout = setTimeout(()=> {
        clearInterval(idInterval);
        computerSide.element.remove();
        computerSide.element = createSide("THE HOUSE PICKED", computerChoice);
        computerSide.title = computerSide.element.querySelector(".side-title");
        computerSide.shadow = computerSide.element.querySelector(".shadow");
        computerSide.shadow.width = 224;
        computerSide.shadow.height = 224;
        computerSide.ctx = computerSide.shadow.getContext("2d");
        drawShadow(computerSide.shadow, computerSide.ctx)
        container.appendChild(computerSide.element);

        switch(outcome){
            case true:
                playAudio("success.wav");
                presentationTitle.innerText = "YOU WIN";
                playerSide.shadow.classList.add("super-shadow");
                drawSuperShadow(playerSide.shadow, playerSide.ctx);
                score++;
                break;
            case false:
                playAudio("fail.wav");
                presentationTitle.innerText = "YOU LOSE";
                computerSide.shadow.classList.add("super-shadow");
                drawSuperShadow(computerSide.shadow, computerSide.ctx);
                score--;
                break;
            case 0:
                presentationTitle.innerText = "DRAW!";
                playAudio("draw.mp3");
                break;
        } 
        setArena(score);
        localStorage.setItem("score", score.toString());
        clearTimeout(idTimeout);
    }, 5000)

    idTimeout2 = setTimeout(() => {
        playerSide.title.remove();
        computerSide.title.remove();

        const bottom = document.querySelector(".bottom-items");
        bottom.appendChild(presentation);
    }, 8000)


}

const icons = document.querySelectorAll(".the-icon-container");

icons.forEach((icon) => {
    icon.addEventListener("click", () => {
        setGame(icon.getAttribute("id"));
    })
})