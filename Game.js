//Memory Game
//Yapılacaklar
//--Hangisinin yanlış olduğunun gösterimi
//--Score board 
//----------------------------------------------------------------
let gridSizeSelect = document.getElementById('grid-size');
let myDiv = document.querySelector(".grid-container");
let gridItems = myDiv.querySelectorAll("a");
const addButton = document.querySelector('.addButton');
const delButton = document.querySelector('.delButton');
const resButton = document.querySelector('.resultButton');
const radioInputs = document.querySelectorAll('input[type="radio"]');
const volInput = document.querySelector('#vol');
const levelbutton = document.querySelector(".levelSubmit")
let resDiv = document.querySelector(".results");
let gridItemsCount = gridItems.length;

let setTimeoutInput = 1000
let reactionTimeInput = 1500
let clickCountInput
let clickCount = 0

volInput.addEventListener('input', function () {
    clickCountInput = this.value;
    console.log(clickCountInput);
    //Çubuğun yanına değerini göstermek gerekiyor.
});

//Mavi yanma süresi
levelbutton.addEventListener("click", function (e) {
    radioInputs.forEach(function (radioInput) {
        if (radioInput.checked)
            switch (radioInput.value) {
                case "Ez":
                    reactionTimeInput = 2500
                    break;
                case "Mid":
                    reactionTimeInput = 1500
                    break;
                case "Hard":
                    reactionTimeInput = 500
                    break;
                case "XD":
                    reactionTimeInput = 100
                    break;
                default:
                    reactionTimeInput = 1500
                    break;
            }
    })
    e.preventDefault();
});

//Default olarak 3x3 seçilir.
window.addEventListener("DOMContentLoaded", function () {

    levelbutton.click();
    clickCountInput = 5
    gridSizeSelect.value = "3";
    createGrid(3);
});

//Select (nxn) burada seçilir.
gridSizeSelect.addEventListener('change', function () {
    const gridSize = parseInt(gridSizeSelect.value, 10);
    createGrid(gridSize);
});

function createGrid(size) {
    // grid boyutunu ayarlama
    myDiv.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    myDiv.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    myDiv.innerHTML = "";
    // grid öğelerini oluşturma
    for (let i = 0; i < size * size; i++) {
        const gridItem = document.createElement('a');
        gridItem.textContent = i
        gridItem.setAttribute("href", "#")
        gridItem.classList.add('grid-item');
        myDiv.appendChild(gridItem);

    }
    gridItems = myDiv.querySelectorAll("a");
    gridItemsCount = gridItems.length;



    // Bizim seçtiğimiz kareler için
    gridItems.forEach(function (item) {
        item.addEventListener("click", function () {

            //Çünkü bir eksiği kadar tıklama hakkı veriyor. Inan bilmiyorum
            if (clickCount >= clickCountInput - 1) {
                return
            }
            if (!sessionStorage.getItem("clicked")) {
                let beenClicked = []
                beenClicked.push(item.textContent);
                sessionStorage.setItem('clicked', JSON.stringify(beenClicked));

            } else {
                let clicked = []
                clicked = JSON.parse(sessionStorage.getItem('clicked'))

                clicked.push(item.textContent);
                sessionStorage.setItem('clicked', JSON.stringify(clicked));
            }
            this.classList.add("bg-red");
            clickCount++
        });
    });


}

//Ekleme tuşu
addButton.addEventListener("click", function (e) {
    //Session key yok ise buton çalışır
    if (sessionStorage.getItem("sessionKey")) {
        addButton.disabled = true;
    }
    else {
        markedGridItems(clickCountInput);
        e.preventDefault();
    }
})

//Reset tuşu
delButton.addEventListener("click", function (e) {
    restartFunc(gridItemsCount)
})

//Result Tuşu
resButton.addEventListener("click", function (e) {

    let toFindData = JSON.parse(sessionStorage.getItem("sessionKey"))
    let toChooseData = JSON.parse(sessionStorage.getItem("clicked"))

    if (toFindData === null || toChooseData === null) {
        const notStarted = document.createElement("h3")
        notStarted.textContent = "BAŞLATILMADI VEYA SEÇİM YAPILMADI...!"
        resDiv.appendChild(notStarted)
        setTimeout(() => {
            document.querySelector(".results").removeChild(notStarted);
            restartFunc(gridItemsCount); return
        }, setTimeoutInput);

        redColor()
        console.log("Başlatılmadı veya Seçim yapılmadı..")
        return;
    }
    // toChoose ile toFind arraylerinin birbirlerinden farklı değerleri= diff
    const diff1 = toChooseData.filter(x => !toFindData.includes(x));
    const diff2 = toFindData.filter(x => !toChooseData.includes(x));
    //Diff1 Yanmayıp da tıklananların arrayleri 
    //Diff2 Yanıp da tıklanmayanları arrayleri 

    if (diff1.length !== 0 || diff2.length !== 0) {
        const wrongAnswer = document.createElement("h3")
        wrongAnswer.textContent = "BİLEMEDİN..!"
        resDiv.appendChild(wrongAnswer)
        setTimeout(() => {
            document.querySelector(".results").removeChild(wrongAnswer);
            restartFunc(gridItemsCount); return
        }, setTimeoutInput);

        redColor()
        console.log("Bilemedin!");

    }
    else {
        const correctAnswer = document.createElement("h3")
        correctAnswer.textContent = "BİLDİN..!"
        resDiv.appendChild(correctAnswer)

        gridItems.forEach(gridItem => {
            gridItem.classList.add('bg-same');
            setTimeout(() => {
                gridItem.classList.remove('bg-same');
                restartFunc(gridItemsCount); return

            }, setTimeoutInput);
        });

        setTimeout(() => {
            document.querySelector(".results").removeChild(correctAnswer);
        }, setTimeoutInput);

    }
    //Burada diff1 için hata rengi
    //Diff2 içinse mavi renk    
    e.preventDefault()
}
)

//gridItems boyutunda random array'im
function getRandomArray(y) {
    y = gridItems.length;
    let rndmArray = [];
    for (let i = 0; i < y; i++) {
        rndmArray.push(i);
    }
    rndmArray.sort(() => Math.random() - 0.5);
    return rndmArray;
}

//addButton'a tıklanması fonksiyonu
function markedGridItems(x) {
    let randomArray = getRandomArray()
    sessionStorage.removeItem('sessionKey');

    //Session boşsa
    for (let i = 0; i < x; i++) {

        if (!sessionStorage.getItem("sessionKey")) {
            let sessionKey = [];
            sessionStorage.setItem('sessionKey', JSON.stringify(sessionKey));

            //Session key varsa
        } else {

            //İlk index if'in içine gittiğinden ötürü ; [i-1]
            let selected = gridItems[randomArray[i - 1]];
            let selectedText = selected.textContent
            let sessionKey = JSON.parse(sessionStorage.getItem('sessionKey')) || [];
            sessionKey.push(selectedText);
            sessionStorage.setItem('sessionKey', JSON.stringify(sessionKey));

            selected.classList = "grid-item bg-blue"

            setTimeout(function () {
                selected.classList.remove("bg-blue");
            }, reactionTimeInput);
        }
    }

}

//Restart func yarattık ki result'un içindeki
//set timeout'a yerleştirebilelim.
function restartFunc(x) {

    for (var i = 0; i < x; i++) {

        let coloredGrid = document.querySelectorAll(".grid-item")[i];
        coloredGrid.classList = "grid-item"
    }
    clickCount = 0;
    sessionStorage.clear()
    // location.reload() //f5  
}

//Seçilmemesi ya da başlatılmaması senaryosu için full kırmızı boya
function redColor() {
    gridItems.forEach(gridItem => {
        gridItem.classList.add('bg-red');
        setTimeout(() => {
            gridItem.classList.remove('bg-red');
        }, setTimeoutInput);
    });
}
