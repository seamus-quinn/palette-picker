const colorPalette =[]
const projects = []

$('.palette-generator').on('click', prependColors)
$('.palette-container').on('click', '.container', toggleLock)
$('.project-form').on('submit', createProject)
$('.palette-form').on('submit', savePalette)

function savePalette(event) {
  event.preventDefault();
  const paletteName = $('.palette-input').val();
  const projectName = $('.projects option:selected').text();
  colorPalette.forEach(palette => {
    const color = $(`.${palette}`).css('background-color')
    $(`.project-${projectName}`).append(
      `<div
        style='background-color:${color}; width: 100px; height: 100px'
       ></div>`
    )
  })
}

function createProject(event) {
  event.preventDefault();
  const projectName = $('.project-input').val();
  if (!projects.includes(projectName)){
    if($('.project-error')){
      $('.project-error').remove();
    }
    $('.projects-container').prepend(
      `<div
        class='project-${projectName}'
       >
       <h1 class='project-title'>${projectName}</h1>
       <div class='created-palette-container'>
       </div>
       </div>`
    )
    $('.projects').prepend(
      `<option class='${projectName}'>${projectName}</option>`
    )
    projects.push(projectName)
  } else {
    $('.project-form').append(
      `<p class='project-error'>That project name already exists, please choose another</p>`
    )
  }
  
}

function toggleLock() {
  $(this).toggleClass('locked')
}

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

