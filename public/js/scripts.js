const colorPalette =[]

$('.palette-generator').on('click', prependColors)
// $('.palette-container').on('click', '.lock-button', toggleLock);

// function toggleLock() {
//   colorPalette.forEach(color => {
//     console.log($(this).parent().hasClass(`color${color.id}`))
//     if($(this).parent().hasClass(`color${color.id}`)){
//       color.locked = !color.locked
//       $(this).parent().toggleClass('unlocked')
//     }
//   })
//   console.log(colorPalette)
// }

// function fillPalette() {
//   if (!colorPalette.length) {
//     for (var i = 0; i < 5; i++) {
//       colorPalette.push({
//         color: generatePalette(),
//         locked: false,
//         id: i + 1
//       })
//     }
//   } else {
//     colorPalette.forEach((color, index) => {
//       if (color.locked === false) {
//         colorPalette.splice(index, 1)
//         colorPalette.push({
//           color: generatePalette(),
//           locked: false,
//         })
//       } else {
//         console.log(color)
//       }
//     })
//   }
//   $('.unlocked').remove();
//   prependColors();
// }

function generateColor() {
  const possible = 'abcdef0123456789'
  const hexCode = []
  for (var i = 0; i < 6; i++) {
    hexCode.push(possible.charAt(Math.floor(Math.random() * possible.length)))
  }
  return '#' + hexCode.join('')
}

function prependColors() {
  if (!colorPalette.length) {
    for (var i = 0; i < 5; i++) {
      $('.palette-container').prepend(
        `<div
        class='container color${i + 1}'
        style='background-color:${generateColor()}'
        >
        <button
        class='lock-button'
        >Lock</button>
        </div>`
      )
      colorPalette.push(`color${i + 1}`)
    }
  } else {
    colorPalette.forEach(color => {
      if ($(`.${color}`).hasClass('locked')) {
        return;
      } else {
        $(`.${color}`).css({ 'background-color': generateColor()})
      }
    })
  }
}

prependColors()

console.log(colorPalette)

