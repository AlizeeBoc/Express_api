// fichier .mjs => modules ECMAScript (ES modules) => remplacer les const ... = require ... par "import ... from ..."
import "dotenv/config" // on top!
import express from "express"
const app = express()
import jwt from "jsonwebtoken"

app.use(express.json()) 

app.post("/login", (req, res) => {
  // athenticate user
  //génère un token contenant les informations de l'user (payload) grace a la KEY ("secret" qui signe le tolken et garantit que le contenu n'a pas été altéré)
  const username = req.body.username
  const user = { name: username }

  const accesToken = generateAccessToken(user) /*jwt.sign(user, process.env.KEY)*/
  const refreshToken = jwt.sign(user, process.env.REFRESH_KEY)
  res.json({ accesToken: accesToken, refreshToken: refreshToken })
})

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.KEY, { expiresIn: "45s" })
}

const port = 8000
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
