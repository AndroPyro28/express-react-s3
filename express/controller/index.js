import io from '../server.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import express from 'express'
import { uploadFile, getObjectSignedUrl } from '../s3.js'

import multer from 'multer'
import sharp from 'sharp'
import crypto from 'crypto'
import cors from "cors"
import { Server } from 'socket.io' ;
import http from "http"
export const getPosts = async (req, res) => {
  const posts = await prisma.posts.findMany({orderBy: [{ created: 'desc'}]})
  io.emit("hey", 1)
  for (let post of posts) {
    post.imageUrl = await getObjectSignedUrl(post.imageName)
    // console.log("url::", post.imageUrl)
  }
  res.send(posts)
}

  export const setPosts = async (req, res) => {
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
  }
