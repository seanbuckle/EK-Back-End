import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import routes from './routes/route'
import cors from 'cors'


const app = express();
app.use(cors());

const mongoString: string = process.env.DATABASE_URL!
mongoose.connect(mongoString)
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


app.use(express.json());

app.use(`/api`, routes)

app.listen(3000, () => {
    console.log(`server started app on 3000`)
})