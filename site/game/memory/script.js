const available = ['🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🫘', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮','🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🫙']
const grid = document.getElementById('grid')
var game
var timerId
const audio = new Audio('bell.mp3')

class Game {
    constructor() {
        this.cards = []
        this.selected = []
        this.canClick = true
        this.moves = 0
        this.completed = false
        this.time = 0
    }

    init() {
        let emojis = this.chooseEmojis()

        this.cards.length = 0
        grid.innerHTML = ''

        for (let i = 0; i < 16; i++) {
            let index = Math.floor(Math.random() * emojis.length)
            let emoji = emojis[index]
            emojis.splice(index, 1)

            let span = document.createElement('span')
            span.innerHTML = emoji

            let card = document.createElement('div')
            card.classList.add('card')
            card.dataset.open = false
            card.dataset.matched = false
            card.onclick = (e) => this.click(e, i)
            
            card.appendChild(span)
            grid.appendChild(card)

            let data = {
                id: i,
                emoji: emoji,
                matched: false,
                open: false,
                card: card
            }
            this.cards.push(data)
        }

        this.update()
        startTimer()
    }

    chooseEmojis() {
        let choose = [...available]
        let array = []

        for (let i = 0; i < 8; i++) {
            let index = Math.floor(Math.random() * choose.length)
            let emoji = choose[index]
            choose.pop(index)
            array.push(emoji)
            array.push(emoji)
        }

        return array
    }

    click(e, id) {
        if (this.completed) {
            return
        }
        if (!this.canClick) {
            return
        }

        let card = e.target
        let data = this.cards[id]

        if (data.matched) {
            return
        }

        if (data.open) {
            return
        }

        data.open = true
        card.dataset.open = true
        this.selected.push(data)

        if (this.selected.length >= 2) {
            this.moves++
            this.test()
        }
    }

    test() {
        if (!this.canClick) {
            return
        }
        if (this.selected.length < 2) {
            return
        }
        let first = this.selected[0]
        let second = this.selected[1]

        this.selected = []

        this.canClick = false
        this.update()

        if (first.emoji === second.emoji) {
            audio.play()
            setTimeout(() => {
                first.matched = true
                first.card.dataset.matched = true
                second.matched = true
                second.card.dataset.matched = true
                this.closeAll()
                this.canClick = true
                this.checkState()
            }, 1000)
        } else {
            setTimeout(() => {
                this.closeAll()
                this.canClick = true
            }, 1000)
        }
    }

    checkState() {
        let done = true
        this.cards.forEach((data) => {
            if (!data.matched) {
                done = false
            }
        })

        if (done) {
            this.winGame()
        }
    }

    winGame() {
        this.completed = true
        this.canClick = false

        document.getElementById('startbtn').innerHTML = 'New Game'
    }

    update() {
        document.getElementById('moves').innerHTML = (this.moves == 1 ? '1 move' : this.moves + ' moves')
        document.getElementById('time').innerHTML = 'Time: ' + this.time + 's'
    }

    closeAll() {
        this.selected = []
        
        this.cards.forEach((data) => {
            let card = data.card
            if (data.matched) {
                return
            }

            card.dataset.open = false
            data.open = false
        })
    }
}

function startGame() {
    document.getElementById('startbtn').innerHTML = 'Restart'
    
    game = new Game()
    game.init()
    return game
}

function startTimer() {
    if (timerId) {
        clearInterval(timerId)
    }

    timerId = setInterval(() => {
        if (game) {
            if (!game.completed) {
                game.time++
                game.update()
            }
        }
    }, 1000)
}