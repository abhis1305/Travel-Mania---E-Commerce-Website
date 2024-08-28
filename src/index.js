const dotenv = require("dotenv")
const express = require("express")
const path = require("path")
const app = express()
const bcrypt = require("bcryptjs")
const cookieParser =require("cookie-parser")
const auth = require("../middleware/auth")

// Link the router file
app.use(require("../router/route"))

// CONNECTION OF .ENV FILE
dotenv.config({ path: './.env' })


// Connection Of Schema Files
const LogInCollection = require("../models/signupSchema")
const Contact_Us = require("../models/contactSchema")
const Booking = require("../models/bookingSchema")

// Connection Of MongoDB File
const connectDB = require("../db/conn");

//mongodb connection
connectDB();

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))

app.get('/logout',auth, async(req, res) => {
    try{

        // DELETETING COOKIES FOR ONE DEVICE
         req.user.tokens = req.user.tokens.filter((currElement) => {
             return currElement.token != req.token
             })

        // DELETETING COOKIES FOR ALL DEVICE
        // req.user.tokens = []

         res.clearCookie("jwt")
         console.log("Logout Done");
         await req.user.save()
         res.render("signin")
    }
    catch (error){
        res.status(500).send(error)
    }
})

app.post('/signup', async (req, res) => {
    const {email,password,cpass}=req.body
    if (!email || !password || !cpass ) {
    return res.status (422).json({ error: "Plz filled the field properly" });
    }
    try {
    const userExist = await LogInCollection.findOne({ email: email });
    if (userExist) {
    return res.status(422).json({ error: "Email already Exist" });
    }else if(password != cpass){
        return res.status(422).json({ error: "Pass are Not Matching" });
    }
    else{
        const user = new LogInCollection({email,password, cpass });

        // TOKEN SYSTEM

    const token = await user.generateAuthToken()
    res.cookie("jwt", token)
    await user.save();
    res.status(201).render("signin")
    } 
    } 
    catch (err) {
    console.log(err);
    }
})

app.post('/signin', async (req, res) => {

    try {
        const {email,password}=req.body
        const check = await LogInCollection.findOne({ email:email})
        
        const isMatch = await bcrypt.compare(password, check.password)

        // Middleware
        const token = await check.generateAuthToken()

        res.cookie("jwt", token)

        if (isMatch) {
            res.status(201).render("index", { naming: `${req.body.password}+${req.body.email}` })
        }
        else {
            res.send("incorrect password")
        }
    } 
    catch (e) {
        res.send("incorrect email")
    }
})

app.post('/contact', async (req, res) => {
    
    const data={
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        messgage: req.body.messgage
    }

     await Contact_Us.insertMany([data])

     res.render("index")
 })



 app.post('/booking', async (req, res) => {
    
    const data={
        visitor_name: req.body.visitor_name,
        visitor_email: req.body.visitor_email,
        visitor_phone: req.body.visitor_phone,
        total_adults: req.body.total_adults,
        total_children: req.body.total_children,
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        pacakage_preference: req.body.pacakage_preference,
        visitor_message: req.body.visitor_message
    }

     await Booking.insertMany([data])

      res.render("index")
  })

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})