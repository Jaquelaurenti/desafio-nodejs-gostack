const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
  ? repositories.filter(repo => repo.title.includes(title))
  : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = {
    id: uuid(),
    url,
    title,  
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
 
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repository = repositories.find(repo => repo.id === id);
  if(!repository) return response.status(400).json({
    message: 'Id not found!'
  });

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  if(repositoryIndex < 0) return response.status(400).json({
    message: "Repository not found!"
  });

  repositories.splice(repositoryIndex);

  return response.status(204).send()
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repo => repo.id === id);
  if(!repository) return response.status(400).json({
    message: 'Id not found!'
  });

  repository.likes += 1 ;

  return response.json(repository);
});

module.exports = app;
