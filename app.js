const tile = document.querySelector('.tile-container');
const keys = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container')
let word
const wordRows = [ 
['', '', '', '', ''],
['', '', '', '', ''],
['', '', '', '', ''],
['', '', '', '', ''],
['', '', '', '', ''],
['', '', '', '', '']
]

let currentRow = 0
let GameOver = false
let currentTile = 0
const getWordle = () => {
    fetch('http://localhost:8000/word')
        .then(response => response.json())
        .then(json => {
            word = json.toUpperCase()
        })
        .catch(err => console.log(err))
}
getWordle()


wordRows.forEach((row, wordRowIndex) => {
    const rowEl = document.createElement('div')
     rowEl.setAttribute('id', 'wordRow-' + wordRowIndex)
     row.forEach((r, rIndex)=> {
         const tileEl = document.createElement('div')
         tileEl.setAttribute('id', 'wordRow-' + wordRowIndex + '-tile-' + rIndex)
         tileEl.classList.add('tile')
         rowEl.append(tileEl)
     })
     tile.append(rowEl)
})


const keysArray = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L','ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M' , 'DELETE'];
const clickKey = (key) => {
    console.log('clicked', key)
    if (!GameOver) {
        if (key === 'DELETE') {
            console.log(currentTile)
            deleteLetter()
            return
        }
        if (key === 'ENTER') {
            whichRow()
            return
        }
        addLetter(key)
    }
    
}
keysArray.forEach(key => {
    const singleButton = document.createElement('button')
    singleButton.textContent = key
    singleButton.setAttribute('id', key)
    singleButton.addEventListener('click', () => clickKey(key))
    keys.append(singleButton)
})

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('wordRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        wordRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const whichRow = () => {
    const guess = wordRows[currentRow].join('')
    if (currentTile > 4) {
        console.log('guess is '+guess, 'wordle is '+word)
        flipTile()
        if(word == guess){
            showMessage('Great!')
            GameOver = true
            return
        }else {
            if(currentRow >= 5){
                GameOver = false
                showMessage('Game over')
                return
            }
            if (currentRow < 5) {
                currentRow++
                currentTile = 0
            }
        }
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 4000)
}

const addLetter = (letter) => {
    if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById('wordRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        tile.style.color = 'white'
        wordRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    if(color =='notIn-overlay'){
        key.classList.add('keyboard-not-in')
    }
    key.classList.add(color)
}



const flipTile = () => {
    const rowLetters = document.querySelector('#wordRow-' + currentRow).childNodes //vse crke iz trenutne vrstice
    let checkWord = word //nasa beseda
    const guess = []

    rowLetters.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'notIn-overlay'}) //za vsak tile trenutne vrste dodaj crko v array
    })

    guess.forEach((guess, index) => { //preveri ce sta besedi isti, ce sta obarva rdece
        if (guess.letter == word[index]) {
            guess.color = 'rightSpot-overlay'
            checkWord = checkWord.replace(guess.letter, '') //zbrisemo isto crko
        }
    })

    guess.forEach(guess => {
        if (checkWord.includes(guess.letter)) {
            guess.color = 'inWord-overlay'
            checkWord = checkWord.replace(guess.letter, '')
        }
    })

    rowLetters.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}