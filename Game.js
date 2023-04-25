//Memory Game
//Yapılacaklar
//--Hangisinin yanlış olduğunun gösterimi
//--Kaç karenin yanıp döneceğinin ve süresinin kullanıcıya sorulması
//--Grid-item sayısının kullanıcıya bağlı olması (acemi, amatör, pro şeklinde buttonlamak 
//en mantıklısı, teker teker grid-item eklenmesi simetriyi siker atar) 
//----------------------------------------------------------------
let myDiv = document.querySelector(".grid-container");
let gridItems = myDiv.querySelectorAll("a");
const addButton = document.querySelector('.addButton');
const delButton = document.querySelector('.delButton');
const resButton = document.querySelector('.resultButton');
const ezButton = document.querySelector('.ezZorlukButton');
const midButton = document.querySelector('.midZorlukButton');
let resDiv = document.querySelector(".results");
let gridItemsCount = gridItems.length;

let setTimeoutInput = 1000
let reactionTimeInput = 500
let clickCountInput = 6
let clickCount = 0

let gridSizeSelect = document.getElementById('grid-size');

//Default olarak 3x3 seçilir.
window.addEventListener("DOMContentLoaded", function() {
    gridSizeSelect.value = "3";
    createGrid(3);
  });

//Select burada seçilir.
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
        
        if (clickCount >= clickCountInput) {
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
// let newGridItems = myDiv.querySelectorAll("a")

//Ekleme tuşu
addButton.addEventListener("click", function (e) {
    //Session key yok ise buton çalışır
    if (sessionStorage.getItem("sessionKey")) {
        addButton.disabled = true;
    }
    else {
        // 1 eksiği kadar kare yanıyor.
        markedGridItems(clickCountInput + 1);
        console.log(gridItemsCount)
        console.log(newGridItems)
        e.preventDefault();
    }
})

//Reset tuşu
delButton.addEventListener("click", function (e) {
    restartFunc(gridItemsCount)
})

//Result Tuşu
resButton.addEventListener("click", function (e) {
    console.log(gridItems)

    let toFindData = JSON.parse(sessionStorage.getItem("sessionKey"))
    let toChooseData = JSON.parse(sessionStorage.getItem("clicked"))

    if (toFindData === null || toChooseData === null) {
        const notStarted = document.createElement("div")
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
    const diff = toChooseData.filter(x => !toFindData.includes(x));

    if (diff.length !== 0) {
        const wrongAnswer = document.createElement("div")
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
        const correctAnswer = document.createElement("div")
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
    console.log(rndmArray)
    return rndmArray;
}

// // Bizim seçtiğimiz kareler için
// gridItems.forEach(function (item) {
//     item.addEventListener("click", function () {
        
//         if (clickCount >= clickCountInput) {
//             return
//         }
//         if (!sessionStorage.getItem("clicked")) {
//             let beenClicked = []
//             beenClicked.push(item.textContent);
//             sessionStorage.setItem('clicked', JSON.stringify(beenClicked));

//         } else {
//             let clicked = []
//             clicked = JSON.parse(sessionStorage.getItem('clicked'))

//             clicked.push(item.textContent);
//             sessionStorage.setItem('clicked', JSON.stringify(clicked));
//         }
//         this.classList.add("bg-red");
//         clickCount++
//     });
// });

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

//Grid items = x dersek
//x boyutunda random array var
//x boyunda restart func çalışıyor.
//ClickCountInput yaratıldı.
//markedGridItems'clickeCountInput kadar yanıyor
//Yanma sönme süresi setTimeoutInput olarak tanımlandı
//Start ile yanan karaler reactionTimeInput kadar sonra söner, zorluk ayarı için

// //Ez level Zorluk
// ezButton.addEventListener("click", function () {
//     mediumLevel(3)
//     console.log("")
// })

// //Medium Level Zorluk
// midButton.addEventListener("click", function () {
//     mediumLevel(8)
//     console.log("")
// })

// function mediumLevel(e) {
    
//     const gridContainer = document.querySelector('.grid-container');

//     // 4x4 grid oluşturma
//     gridContainer.style.gridTemplateColumns = `repeat(${e}, 1fr)`;
//     gridContainer.style.gridTemplateRows = `repeat(${e}, 1fr)`;

//     // Boyutları ayarlama
//     gridContainer.style.width = '400px';
//     gridContainer.style.height = '400px';

//     gridContainer.innerHTML = '';
//     for (let i = 0; i < size * size; i++) {
//         const gridItem = document.createElement('div');
//         gridItem.classList.add('grid-item');
//         gridContainer.appendChild(gridItem);
//     }
// }

//<a href="#" class="grid-item">0</a>
//<a class="grid-item">0</a>