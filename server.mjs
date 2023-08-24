// fichier .mjs => modules ECMAScript (ES modules) => remplacer les const ... = require ... par "import ... from ..."
import "dotenv/config" // on top!
import express from "express"
const app = express()
import ghibliRecipes from "./data.js"
import jwt from "jsonwebtoken"

app.use(express.json()) // => return a piece of middelware use by the app in the request process
app.use(express.static("public")) // => middleware permettant de servir tous les fichiers statiques

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] // Bearer TOKEN
  const token = authHeader && authHeader.split(" ")[1] // "si on a un authHeader, renvoie moi que la partie qui correspond au tolken. Si pas, renvoie undefined"
  if (token == null) {
    return res.sendStatus(401)
  } else {
    jwt.verify(token, process.env.KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403)
      }
      req.user = user
      next()
    })
  }
}

app.get("/", authenticateToken, (req, res) => {
  res.json(ghibliRecipes)
})

app.get("/recipes/:recipeName", (req, res) => {
  //res.send(req.params.recipeName)
  const recipe = ghibliRecipes.find(
    (r) => r.name.toLowerCase() === req.params.recipeName.toLowerCase()
  )
  if (!recipe)
    res.status(404).send("The recipe with the given name was not found")
  //res.json(recipe)
})

app.get("/info", (req, res) => {
  res.sendFile("info.html", { root: "public" }) // ! pas SEND!
})

const port = 2000
app.listen(port, () => console.log(`Listening on port ${port} ...`))

////////////////////////////////////////////////////////////////////////////

// API : https://www.youtube.com/watch?v=pKd0Rpw7O48
// JWT : https://www.youtube.com/watch?v=mbsmsi7l3r4&t=309s

// Générer le token via le terminal (crypt library de nodejs)
// > node
// > require('crypto').randomBytes(64).toString('hex')

// Structure de base
// npm init -y
// npm i express
// npm i --save-dev nodemon

////////////////////////////////////////////////////////////////////////////
//app.post("/login", (req, res) => {
//  // athenticate user
//  //génère un tolken contenant les informations de l'user (payload) grace a la KEY ("secret" qui signe le tolken et garantit que le contenu n'a pas été altéré)
//  const username = req.body.username
//  const user = { name: username }
//  const accesToken = jwt.sign(user, process.env.KEY)
//  res.json({ accesToken: accesToken })
//})
