import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET 

// cadastro
router.post('/cadastro', async  (req, res) => {

    try{
        const user = req.body

        const salt = await bcrypt.genSalt(10) // definindo nível de força do hash -> padrão 10
        const hashPassword = await bcrypt.hash(user.password, salt) // passando para a função de encriptação a senha e o nível de encriptação que queremos


        await prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: hashPassword
            }, 
        })

        res.status(201).json({message: 'usuário cadastrado! '})
    }

    catch(err){
        res.status(500).json({message: 'erro no servidor! tente novamente'})
        
    }

})

// login

router.post('/login', async (req, res) =>{
    try{

        // armazena dados de login (e-mail e senha)
        const userInfo = req.body

        // busca usuário no banco de dados utilizando como parâmetro e-mail
        const user = await prisma.user.findUnique({where: {email: userInfo.email},
        })

        // verifica se o e-mail existe. se não existe dá a mensagem
        if(!user){
            return res.status(404).json({message: 'usuário não encontrado! tente novamente'})
        }

        // se email existe, compara a senha digitada e a senha criptografada no banco
        const isMatch = await bcrypt.compare(userInfo.password, user.password)

        // verifica senhas. se as senhas não bate, dá a mensagem de erro
        if(!isMatch){
            return res.status(404).json({message: 'senha inválida! tente novamente'})
        }

        // gerar token jwt
        const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1d'})

        // caso senha ok e e-mail ok -> retorna informações do usuário
        res.status(200).json(token)

    }catch(err){
        // em caso de erro de validação, retorna mensagem de erro de servidor
        res.status(500).json({message: 'erro no servidor! tente novamente'})
    }

})


export default router