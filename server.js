const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'Palette Picker';
app.locals.projects = []
app.locals.palettes = []

app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (request, response) => {
  
})

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now().toString();
  const { projectName } = request.body;

  if (!projectName) {
    response.status(422).send({
      error: 'Please provide a name for the project you wish to save'
    });
  } else {
    app.locals.projects.push({ id, projectName })
    response.status(201).json({ id, projectName })
  }
})

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now().toString();
  const { paletteName } = request.body;

  if (!paletteName) {
    response.status(422).send({
      error: 'Please provide a name for the palette you wish to save'
    });
  } else {
    app.locals.palettes.push({ id, paletteName })
    response.status(201).json({ id, paletteName })
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})