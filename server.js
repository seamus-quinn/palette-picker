const express = require('express'); //Imports express so we have access to it
const app = express();  //Invokes express and assigns it to the variable app so we can access methods off of it
const bodyParser = require('body-parser') //Imports body parser so our app can read the body of our responses

const environment = process.env.NODE_ENV || 'development';  //Determines the environment for our app, defaulted to development
const configuration = require('./knexfile')[environment]; //Based on our environment we grab the database configuration 
const database = require('knex')(configuration); //Sets up our database so we have access to it

app.set('port', process.env.PORT || 3000) //Sets the port we will be using, defaulted to 3000
app.locals.title = 'Palette Picker';  //Sets the title of our app

app.use(bodyParser.json()) //Tells our app to use the invocation of the json method on our bodyParser
app.use(express.static('public')) //Tells our app to look in the public directory to serve up data that may be requestd
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}); //Enables CORS

app.get('/api/v1/projects', (request, response) => { //When a request is made that has the method of get, and this specific endpoint...
  database('projects').select() //go to our database and select the projects table
    .then(projects => {
      response.status(200).json(projects) //return a response that has a status of 200 and a json object with all the projects
    })
    .catch(error => {
      response.status(500).json({ error }) //if there is an error, return a response that has a status of 500 and the error message
    })
})

app.get('/api/v1/palettes', (request, response) => {  //When a request is made that has a method of get, and this specific endpoint...
  database('palettes').select() //go to our database and select the palettes table
    .then(palettes => {
      response.status(200).json(palettes) //return a response that has a status of 200 and a json object with all of the palettes
    })
    .catch(error => {
      response.status(500).json({ error }) //if there is an error, return a response that has a status of 500 and the error message
    })
})

app.post('/api/v1/projects', (request, response) => {  //When a request is made that has a post method, and this endpoint...
  const project = request.body; //grab the project off the body request body object

  for (let requiredParameter of ['name']) { // assigning the var required parameter to name
    if(!project[requiredParameter]) { //if the project is missing this parameter
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`})
    } //return a response with status of 422 and an error message saying what was missing
  }

  database('projects').insert(project, 'id') //go to projects table in our database and insert the project and return the id
    .then(project => {
      response.status(201).json({ 
        id: project[0] 
      }) //send a response with a status of 201 and an object that contains the created id
    })
    .catch(error => {
      response.status(500).json({ error }) //if there is an error, send a response of 500 with the error message
    })
})

app.post('/api/v1/palettes', (request, response) => { //When a request is made with post method and this endpoint...
  const palette = request.body //grab the palette off the body object

  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']) { //iterate over this array of required parameters
    if(!palette[requiredParameter]) { //for each of the required parameters if it does not exist...
      return response
        .status(422)
        .send({ error: `Expected format: {
          name: <String>,
          color1: <String>,
          color2: <String>,
          color3: <String>,
          color4: <String>,
          color5: <String>,
          project_id: <Number>
        } 
        You're missing a "${requiredParameter}" property.`})
    } //return a response with status 422 and the respecitve error message for the specific missing parameter
  }

  database('palettes').insert(palette, 'id') //insert the palette into the palettes table and return its id
    .then(palette => {
      response.status(201).json({ id: palette[0] }) //send a response of 201 with the newly created palette id
    })
    .catch(error => {
      response.status(500).json({ error }) //if there is an error send a response of 500 with the error message
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => { //when a request is made with the delete method and this endpoint...
  const { id } = request.params //grab the id off of the request parameters

  database('palettes').where('id', id).del() //go to the specific row in the palettes table where the request id matches the id for that row and delete that row
    .then(rowsDeleted => {
      if(!rowsDeleted) { //if there are now rows deleted
        response.status(404).json({"error": "Error no matching ID found, please provide a valid ID."}) //return a response with a 404 status and an error message stating there were no matches found
      } else {
        response.sendStatus(204) //otherwise send a response with 204 status
      }
    })
    .catch(error => {
      response.status(500).json({ error }) //if there is an error send a response with a 500 status and the error message
    })
})

app.listen(app.get('port'), () => { //boots up our server to listen for the specified port
  console.log(`${app.locals.title} is running on ${app.get('port')}.`) //logs in the console the app title and whic port its running on
})