const $content = document.getElementById('content')

let sequence = []
let input = []
let timeout

let size = 2
let difficulty = 2
   
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every(function (val, index) {
            return val === b[index]
        })
}

function flashSequence(index = 0) {
    $content.classList.add('locked')
    let $btn = document.getElementById(sequence[index])
    $btn.classList.add('flash')    

    setTimeout(() => {
        $btn.classList.remove('flash')
        index++
    }, 800)

    setTimeout(() => {
        if (index < sequence.length) flashSequence(index)
        else $content.classList.remove('locked')
    }, 1200)
}

function makeGrid(_size) {
    // reset content
    $content.innerHTML = ''

    // set grid style to match size
    let style = 'grid-template-columns: '
    for (let i = 0; i < _size; i++) style += ' 1fr'
    $content.style = style

    // generate buttons
    for (let i = 0; i < _size * _size; i++) {
        const $div = document.createElement('div')
        $div.classList.add('tile')
        $div.setAttribute('data-num', i)
        $div.setAttribute('id', i);
        $content.appendChild($div)
    }

    // generate sequence
    for (let i = 0; i < difficulty; i++) {
        sequence.push(Math.floor(Math.random()*_size*_size).toString())
    }

    // flash sequence after short delay
    setTimeout(() => {
        flashSequence()
    }, 800)    
}


$content.addEventListener('click', function (e) {
    if ($content.classList.contains('locked')) return
    if (e.target === $content) return

    // flash white on click
    e.target.classList.add('clicked')
    setTimeout(() => {
        e.target.classList.remove('clicked')
    }, 200)
        
    input.push(e.target.getAttribute('data-num'))

    if (arrayEquals(input, sequence)) {
        $content.classList.add('locked')
        input = []
        sequence = []
        $content.classList.add('correct')
        setTimeout(() => {
            $content.classList.remove('correct')
            difficulty++;
            if (difficulty >= size+3) {
                size++
                difficulty = size;
            }
            
            makeGrid(size);
        }, 800)
    } else if (input.length >= sequence.length) {
        $content.classList.add('locked')
        input = []        
        $content.classList.add('incorrect')
        setTimeout(() => {
            $content.classList.remove('incorrect')
            flashSequence()
        }, 800)
    }
})

makeGrid(size)