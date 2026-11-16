import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()


router.get('/listar-usuarios', async (req, res) => {
    try {
        // Busca todos os usuários tirando as senhas do banco
        const users = await prisma.user.findMany({ omit: { password: true } })

        // Retorna a lista completa (o front-end já cuida de exibir ou esconder o admin)
        res.status(200).json({ message: 'usuários listados com sucesso', user: users })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'erro no servidor! tente novamente' })
    }
})

router.delete('/usuarios/:id', async (req, res) => {
    try {
        const userId = req.params.id
        await prisma.user.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({ message: 'Usuário deletado com sucesso!' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Erro ao deletar usuário no servidor' })
    }
})

export default router