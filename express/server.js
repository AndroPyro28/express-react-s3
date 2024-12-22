import express from 'express'

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'
import cors from "cors"
import { PrismaClient } from '@prisma/client'
import { uploadFile, deleteFile, getObjectSignedUrl } from './s3.js'
import {getPosts, setPosts} from "./controller/index.js"
import { Server } from 'socket.io' ;
import http from "http"
const app = express()
const prisma = new PrismaClient()

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
app.use(cors())


const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

app.get("/api/posts", getPosts)


app.post('/api/posts', upload.single('image'), setPosts)

app.delete("/api/posts/:id", async (req, res) => {
  const id = +req.params.id
  const post = await prisma.posts.findUnique({where: {id}}) 

  await deleteFile(post.imageName)

  await prisma.posts.delete({where: {id: post.id}})
  res.send(post)
})

const server = http.createServer(app);

server.listen(3001, () => console.info(`server listening on port -${3001}`)) 
const io = new Server(server, { // we will use this later
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"]
    }
})

io.on("connection", (socket) => {
  console.log('connection!')
})

export default io