import express from 'express'

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'
import cors from "cors"
import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'

const app = express()
const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
app.use(cors())

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/api/posts", async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  for (let post of posts) {
    post.imageUrl = await getObjectSignedUrl(post.imageName)
    console.log("url::", post.imageUrl)
  }
  res.send(posts)
})


app.post('/api/posts', upload.single('image'), async (req, res) => {
  const file = req.file
  const caption = req.body.caption
  const imageName = generateFileName()

  

  await uploadFile(file.buffer, imageName, file.mimetype)

  const post = await prisma.posts.create({
    data: {
      imageName,
      caption,
      type: file.mimetype
    }
  })
  
  res.status(201).send(post)
})

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})
  res.send(post)
})

app.listen(3001, () => console.log("listening on port 3001"))