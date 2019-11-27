const Router = require('express').Router;
const router = Router();


// db
const { client, ObjectId } = require('../../db.js')

// auth
const { protect } = require('../../auth')

// controller
const controller = require('./product.controller')

// /product
router.route('/')
  .get(async (req, res) => {
    const productCollection = client.db('mangaten').collection('product') //define a coleção

    const mangas = await productCollection.find({}).toArray() //traz todos os itens da coleção

    res.status(200).json({ product: mangas }) //retorna os itens
  })
  .post(async (req, res) => { //cadastro manga
    // const user = req.user //pegar dados do usuario verificado no protect

    const manga = req.body //pega os dados na requisição
    // manga.createdBy = user._id // associa no item a ser inserido no banco o id do usuario que esta fazendo o cadastro

    const productCollection = client.db('mangaten').collection('product') //define a coleção do banco
    await productCollection.insertOne(manga) //insere os dados na coleção
    res.status(201).json({ message: 'Manga Cadastrado' })
  })

// /product/:id
router.route('/:id')
  .get(controller.getOne)
  .delete(async (req, res) => {
    const id = req.params.id// recebe o id
    // const user = req.user// recebe os dados do usuario

    const productCollection = client.db('mangaten').collection('product')//referencia a coleção de manga
    const deletedProduct = await productCollection.findOneAndDelete({ // fazer alterações para verificar se o usuario é adm
      _id: ObjectId(id)
      // createdBy: ObjectId(user._id)
    })
    console.log('deletedProduct', deletedProduct.value)

    const manga = deletedProduct.value

    res.status(200).json(manga) //retorna mensagem
  })

module.exports = router