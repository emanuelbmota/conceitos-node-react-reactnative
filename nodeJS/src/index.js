const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [];

function logRequests (req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.time(logLabel)

  next();

  console.timeEnd(logLabel)
}

function validadeProjectId (req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(401).json({ error: 'Invalid project ID.'})
  }

  return next();
}

app.use(logRequests)

app.get('/projects', (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return res.status(200).json(results);
})

app.post('/projects', (req, res) => {
  const {title, owner} = req.body;
  
  const project = { id: uuid(), title, owner };

  projects.push(project);

  return res.status(200).json(project);
})

app.put('/projects/:id', validadeProjectId, (req, res) => {
  const { id } = req.params;

  const { title, owner } = req.body;

  const findIdInIndex = projects.findIndex( project => project.id === id);

  if (findIdInIndex < 0) {
    return res.status(400).json({ error: 'This id doenst exist'});
  }


  const project = { title, owner, id }

  projects[findIdInIndex] = project

  return res.status(200).json(project);

})

app.delete('/projects/:id', validadeProjectId, (req, res) => {
    const { id } = req.params;

    const findIdInIndex = projects.findIndex( project => project.id === id);

    if (findIdInIndex < 0) {
      return res.status(400).json({ error: 'This id doenst exist'});
    }

    projects.splice(findIdInIndex, 1);

    return res.status(204).send();
  })

app.listen(3333);

