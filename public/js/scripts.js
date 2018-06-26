const colorPalette =[]

const paletteGenerator = document.querySelector('.palette-generator')

paletteGenerator.addEventListener('click', prependColors)

function fillPalette() {
  for (var i = 0; i < 6; i++) {
    colorPalette.push({
      color: generatePalette(),
      locked: false
    })
  }
}

function generatePalette() {
  const possible = 'abcdef0123456789'
  const hexCode = []
  for (var i = 0; i < 6; i++) {
    hexCode.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  }
  return '#' + hexCode.join('')
}

function prependColors() {
  colorPalette.forEach(color => {
    if (color.locked === false) {
      $('.palette-container').prepend(
        `<div
          class='container'
          style='background-color:${color.color}'
         ></div>`
      )
    }
  })
}

fillPalette()
prependColors()

console.log(colorPalette)

