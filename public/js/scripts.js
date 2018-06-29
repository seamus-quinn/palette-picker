//STATE

const colorPalette = []
const projects = []

//EVENT LISTENERS

$('.palette-generator').on('click', prependColors)
$('.palette-container').on('click', '.container', toggleLock)
$('.project-form').on('submit', createProject)
$('.palette-form').on('submit', submitPaletteHandler)
$('.projects-container').on('click', '.delete-button', removePaletteFromPage)

//PROJECT FUNCTIONALITY

function getProjects() {
  const url = 'http://localhost:3000/api/v1/projects'
  fetch(url, {
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'GET'
  }).then(response => response.json())
    .then(data => prependProjects(data))
}

function postProject(projectName) {
  const url = 'http://localhost:3000/api/v1/projects'
  fetch(url, {
    'body': JSON.stringify({ name: projectName }),
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'POST'
  }).then(response => {
    return response.json()
  }).then(project => {
    $('.projects').prepend(
      `<option value='${project.id}'>${projectName}</option>`
    )
  })
}

function createProject(event) {
  event.preventDefault();
  const projectName = $('.project-input').val();
  if (!projects.includes(projectName)) {
    if ($('.project-error')) {
      $('.project-error').remove();
    }
    $('.projects-container').append(
      `<div
        class='project-${projectName} project'
       >
       <h1 class='project-title'>${projectName}</h1>
       <div class='created-palette-container'>
       </div>
       </div>`
    )
    postProject(projectName);
    projects.push(projectName)
  } else {
    $('.project-form').append(
      `<p class='project-error'>That project name already exists, please choose another</p>`
    )
  }
}

function prependProjects(projects) {
  console.log('projects', projects)
  projects.forEach(project => {
    const { name, id } = project
    $('.projects-container').append(
      `<div
        class='project-${name} ${id} project'
       >
       <h1 class='project-title'>${name}</h1>
       <div class='created-palette-container'>
       </div>
       </div>`
    )
    $('.projects').prepend(
      `<option value='${id}'>${name}</option>`
    )
    projects.push(name)
  })
}

//PALETTE FUNCTIONALITY

function getPalettes() {
  const url = 'http://localhost:3000/api/v1/palettes'
  fetch(url, {
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'GET'
  }).then(response => response.json())
    .then(data => appendPalettes(data))
}

function postPalette({ name, color1, color2, color3, color4, color5, project_id }) {
  const url = 'http://localhost:3000/api/v1/palettes'
  return fetch(url, {
    'body': JSON.stringify({ name, color1, color2, color3, color4, color5, project_id }),
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'POST'
  }).then(response => response.json())
}

function deletePalette(id) {
  const url = `http://localhost:3000/api/v1/palettes/${id}`
  console.log(url)
  fetch(url, {
    'headers': {
      'content-type': 'application/json'
    },
    'method': 'DELETE'
  }).then(response => console.log(response.json()))
    .catch(error => console.log(error))
}

function removePaletteFromPage() {
  $(this).parent().remove();
  deletePalette($(this).parent().attr('class'))
}

function appendPalette(palette) {
  const { id, name, color1, color2, color3, color4, color5, project_id } = palette
  $(`.${project_id}`).append(
    `<div class='${id}'>
        <h1>${name}</h1>
        ${[color1, color2, color3, color4, color5].map(color => `
         <div
          style='background-color:${color}; width: 20px; height: 20px'
        ></div>
        `).join('')}
        <button class='delete-button'>x</button>
    </div>`
  )
}

function appendPalettes(palettes) {
  palettes.forEach(palette => appendPalette(palette))
}

function handleError(paletteName, projectName) {
  if (projectName === 'Please select a project') {
    $('.error').remove();
    $('.palette-form').append(
      `<p class='project-name-error error'>Please select or create a project to save a color palette</p>`
    )
    return true;
  } else if (projectName && !paletteName) {
    $('.error').remove();
    $('.palette-form').append(
      `<p class='palette-name-error error'>Please input a name for this color palette to save it</p>`
    )
    return true;
  } else if (!projectName && paletteName) {
    $('.error').remove();
    $('.palette-form').append(
      `<p class='project-name-error error'>Please select or create a project to save a color palette</p>`
    )
    return true;
  } else {
    return false
  }
}

function submitPaletteHandler(event) {
  event.preventDefault();
  const paletteName = $('.palette-input').val();
  const projectName = $('.projects option:selected').text();
  const project_id = $('.projects option:selected').attr('value')
  
  if (!handleError(paletteName, projectName)) {
    const colors = colorPalette.map(palette => $(`.${palette}`).css('background-color'))
    const palette = Object.assign({}, {
      id: 'waiting',
      name: paletteName,
      color1: colors[0],
      color2: colors[1],
      color3: colors[2],
      color4: colors[3],
      color5: colors[4],
      project_id
    })
    appendPalette(pallete)
    postPalette(palette)
      .then(response => {
        $('.waiting').addClass(response.id.toString()).removeClass('waiting')
      })
  }
}

//COLOR FUNCTIONALITY

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
        $(`.${color}`).css({ 'background-color': generateColor() })
      }
    })
  }
}

prependColors()
getProjects()
getPalettes()



