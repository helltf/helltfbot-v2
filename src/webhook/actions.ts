import express from 'express'
import bodyParser from 'body-parser'
export const app = express()
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log(req.body.action)
  res.send('a')
})

app.get('*', () => {
  console.log('get')
})
