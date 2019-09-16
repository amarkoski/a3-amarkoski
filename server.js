// init project
const express = require('express'),
  favicon = require('serve-favicon'),
  app = express(),
  bodyparser = require( 'body-parser' ),
  session   = require( 'express-session' ),
  passport  = require( 'passport' ),
  Local     = require( 'passport-local' ).Strategy
  cookieParser = require('cookie-parser')

  low = require('lowdb'),
  FileSync = require('lowdb/adapters/FileSync'),
  adapter = new FileSync('db.json'),
  db = low(adapter)

db.defaults({ users:[] }).write()
db.defaults({ posts:[] }).write()

app.use(favicon(__dirname + '/favicon.ico'))
app.use(express.static('./'));
app.use(cookieParser())
app.use( session({ secret:'cats', resave:false, saveUninitialized:false }) )
app.use(passport.initialize())
app.use(passport.session())
app.use( bodyparser.json() )

// GET call for loading note
app.get('/load', function(request,response) {
  response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
  loadNote(request,response, request.user.username)
  response.end()
})

// searches database for note
function loadNote(req, res, username){

  // sends error message in response if not in database
  if(db.get('posts').find({username: username}).value() === undefined){
    res.write(JSON.stringify({message: "This account does not have a saved note!"}))
  }
  else{
    const note = {
      noteTitle: db.get('posts').find({username: username}).get('title').value(),
      noteBody: db.get('posts').find({username: username}).get('body').value()
    }

    res.write(JSON.stringify(note))
  }
}

// GET call for getting all results
app.get(
  '/results',
  function( req, res){
    res.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    getResults(req, res)
    res.end()
  }
)

// Retrieves all notes in db
function getResults(req, res){
  let posts = db.get('posts').value()
  res.write(JSON.stringify(posts))
}

// GET call for notes.html
app.get('/notes', function(request, response) {
  // using cookie-parser to output current SID in console
  console.log("Cookies: ", request.cookies)
  response.sendFile(__dirname + '/notes.html');
});

// GET call for index.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

// POST call for saving note
app.post( '/save', 
  function( request, response ) {
    response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    saveNote(request.body, request.user.username)
    response.end()
})

// creates new note or modifies existing one
function saveNote(req, username){

  if(db.get('posts').find({username: username}).value() !== undefined){
    // modifies existing note
    db.get('posts').find({username: username})
      .assign({title: req.noteTitle, body: req.noteBody}).value()
    db.write()
  }
  else{
    // creates new note
    db.get( 'posts' ).push({username: username,title:req.noteTitle, body: req.noteBody}).write()
  }
}

// POST call for deleting a note
app.post( '/delete', 
  function( request, response ) {
    response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    deleteNote(request.user.username)
    response.end()
})

// Deletes note if it exists
function deleteNote(username){
  if(db.get('posts').find({username: username}).value() !== undefined){
    // delete note
    db.get('posts').remove({username, username}).write()
  }
  else{
    // note does not exist
  }
}

// local strategy for passport
const myLocalStrategy = function( username, password, done ) {
  // use db to find username 
  const user = db.get('users').find({username:username}).value()

  if(user === undefined){
    return done( null, false, { message:'user not found' })
  }
  else if(user.password === password ){
    return done( null, { username, password })
  }
  else{
    return done( null, false, { message: 'incorrect password' })
  }

}

passport.use( new Local( myLocalStrategy ) )

// POST call for logging in
app.post( 
  '/login',
  passport.authenticate( 'local' ,
  {
    failureRedirect: '/' // redirect to same page if login fails
  }),
  function( req, res ) {
    res.redirect('/notes') // redirect to notes page if login succeeds
    
  }
)

// POST call for signing up
app.post( 
  '/newAcc',
  function( req, res ) {
    db.get( 'users' ).push({ username:req.body.username, password:req.body.password }).write()
    res.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    res.end()

  }
)


passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = db.get('users').find({username:username}).value()
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})



app.listen(process.env.PORT || 3000)
