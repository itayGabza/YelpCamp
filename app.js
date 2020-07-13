var express 				= require("express"),
	 app					= express(),
	 bodyParser 			= require("body-parser"),
	 flash                  = require("connect-flash"),
	 mongoose 				= require("mongoose"),
	 passport 				= require("passport"),
	 LocalStrategy 			= require("passport-local"),
	 methodOverride 		= require("method-override"),
	 Campground 			= require("./models/campground"),
	 Comment 				= require("./models/comment"),
	 User 					= require("./models/user"),
	 seedDB 				= require("./seeds");


//requring routes
var commentRoutes	  = require("./routes/comments"),
	campgroundsRoutes = require("./routes/campgrounds"),
	authRoutes 		  = require("./routes/index");

app.use(flash());

//seedDB();
mongoose.connect("mongodb://localhost/yelp_camp_v11", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
app.use(bodyParser.urlencoded({extended: true}));// parser 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Yula is the best!",
	resave: false,
	saveUninitialized: false,

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();

});


app.use(authRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("The YelpCamp Server Has Started!");
}); 
