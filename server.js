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

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} 🤖`);
});


