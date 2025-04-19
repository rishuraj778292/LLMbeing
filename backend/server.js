import express from 'express'

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}` );
})
