import request from 'supertest'
import { app } from '../../app'
import mongoose, { mongo } from 'mongoose'
import { requireAuth } from '@ticketings/common'

it('returns a 404 if the provided id does not exist', async () => {
   const id = new mongoose.Types.ObjectId().toHexString()

   await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
         title: 'jfbna',
         price: 20,
      })
      .expect(404)
})

it('returns a 401 if the user is not authenticated', async () => {
   const id = new mongoose.Types.ObjectId().toHexString()

   await request(app)
      .put(`/api/tickets/${id}`)

      .send({
         title: 'jfbna',
         price: 20,
      })
      .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
   const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'akjdban', price: 20 })

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signin())
      .send({
         title: 'ajkdbajdn',
         price: 100,
      })
      .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
   const cookie = global.signin()

   const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'akjdban', price: 20 })

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
         title: '',
         price: 20,
      })
      .expect(400)

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
         title: 'dabahdbah',
         price: -20,
      })
      .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
   const cookie = global.signin()

   const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'akjdban', price: 20 })

   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({
         title: 'new title',
         price: 100,
      })
      .expect(200)

   const tickerResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send({})

   expect(tickerResponse.body.title).toEqual('new title')
   expect(tickerResponse.body.price).toEqual(100)
})
