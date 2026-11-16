import express from 'express'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'
import auth from './middlewares/auth.js'
import cors from 'cors'

/*
    Rotas: cadastrar, logar e listar usuários

*/

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

app.use('/', publicRoutes)
app.use('/', auth, privateRoutes)

app.listen(3003, () => console.log('Servidor rodando 🤖'))


