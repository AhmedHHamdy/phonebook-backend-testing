const express = require("express")
const morgan = require("morgan")

const app = express()

app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phones = [
  { 
    "id": "1",
    "name": "ahmed Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
  response.json("<h1>Hello</h1>")
})

app.get("/api/persons", (request, response) => {
  response.json(phones)
})

app.get("/info", (request, response) => {
  response.send(`
    <p>Phone has info for ${phones.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  const phone = phones.find(p => p.id == id) 

  if (phone) {
    response.send(phone)
  } else {
    response.statusMessage = "resource doesn't exist"
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id
  phones = phones.filter(p => p.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 100) + 1
  const maxListId = Math.max(...phones.map(e => +e.id))
  return randomId + maxListId
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number mustn't be empty"
    })
  }
  
  const existingNumber = phones.find(p => p.number == body.number)

  if (existingNumber) {
    return response.status(400).json({
      error: 'name or number must be unique'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: String(generateId())
  }

  phones = phones.concat(newPerson)

  response.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({
    error: 'unknown endpoint'
  })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server starting at port ${PORT}`)
})