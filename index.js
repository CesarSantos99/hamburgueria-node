const { request, response } = require("express");
const express = require("express");
const uuid = require('uuid')
const cors = require ('cors')

const app = express()
const porta = 3001
app.use(express.json())
app.use(cors())


const comandas = []

const primeiroMiddleware = (request, response, next) => {

    const { id } = request.params

    const posicao = comandas.findIndex(comanda => comanda.id === id)

    if (posicao < 0) {
        return response.status(404).json({ menssage: "Comanda não existe" })
    }

    request.userPosicao = posicao
    request.userId = id

    next()
}


app.get('/comandas', (request, response) => {
    return response.json(comandas)
})

app.post('/comandas', (request, response) => {
    const { pedido, cliente } = request.body

    const pedidos = { id: uuid.v4(), pedido, cliente }

    comandas.push(pedidos)

    return response.status(201).json(pedidos)
})

app.put('/comandas/:id', primeiroMiddleware, (request, response) => {

    const { pedido, cliente, valor } = request.body
    const posicao = request.userPosicao
    const id = request.userId

    const atualizandoComandas = { id, pedido, cliente, valor }

    comandas[posicao] = atualizandoComandas

    return response.json(atualizandoComandas)
})

app.delete('/comandas/:id', primeiroMiddleware, (request, response) => {
    const posicao = request.userPosicao

    comandas.splice(posicao, 1)

    return response.status(204).json()
})

app.get('/comandas/:id', (request, response) => {
    const { id } = request.params

    const posicao = comandas.findIndex(comanda => comanda.id === id)

    if (posicao < 0) {
        return response.status(404).json({ menssage: "Comanda não existe" })
    }

    comandas.push(posicao)

    return response.json(comandas)
})




app.listen(porta)

// get = buscar informação no back-end
// post = criar informação no back-end
// put/patch = alterar/ atualizar informaçoes
// delete = deletar informaçoes
