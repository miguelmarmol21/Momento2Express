const express = require("express");
const router = express.Router(); // El mismo manejo de rutas pero con el método Router de express
const passport = require("passport");
const User = require("../models/user");
const Cars = require("../models/car");
const Rent = require("../models/rent");

router.get("/", (req, res) => {
  // res.redirect('/login')
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const { names, lastnames, user, email, password, confirmPassword } = req.body;
  const findUser = await User.findOne({ userName: user });
  const findEmail = await User.findOne({ email: email });
  if (
    names == "" ||
    lastnames == "" ||
    user == "" ||
    email == "" ||
    password == ""
  ) {
    res.render("register", { errorMessage: "Ingrese todos los campos" });
  } else if (findUser) {
    res.render("register", {
      errorMessage: "El Usuario ya esta asociado a otra cuenta",
    });
  } else if (findEmail) {
    res.render("register", {
      errorMessage: "El Correo Electronico ya esta asociado a otra cuenta",
    });
  } else if (password != confirmPassword) {
    res.render("register", { errorMessage: "Las contraseñas no coinciden" });
  } else {
    const newUsr = new User();
    newUsr.names = names;
    newUsr.lastnames = lastnames;
    newUsr.userName = user;
    newUsr.email = email;
    newUsr.password = password;
    await newUsr.save();
    res.redirect("/login");
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

// router.post('/login', passport.authenticate('local',{
//     successRedirect:'/index',
//     failureRedirect:'/login',
//     failureFlash:true
// }))

router.post("/login", async (req, res) => {
  const { user, password } = req.body;
  const findUser = await User.findOne({ userName: user });
  if (user == "" || password == "") {
    res.render("login", { errorMessage: "Ingrese todos los campos" });
  } else if (!findUser) {
    res.render("login", { errorMessage: "Usuario no Existe" });
  } else if (findUser.password != password) {
    res.render("login", { errorMessage: "Contraseña Incorrecta" });
  } else {
    res.redirect("/index");
  }
});

router.get("/index", async (req, res) => {
  res.render("index");
});

router.get("/car", async (req, res) => {
  const cars = await Cars.find();
  res.render("car", { car: cars });
});

router.post("/car", async (req, res) => {
  const { plateNumber, brand } = req.body;
  const cars = await Cars.find();
  const findPlate = await Cars.findOne({ plateNumber: plateNumber });
  if (plateNumber == "" || brand == "") {
    res.render("car", { errorMessage: "Ingrese todos los campos", car: cars });
  } else if (findPlate) {
    res.render("car", { errorMessage: "Numero de placa ya Existe", car: cars });
  } else {
    const newCar = new Cars();
    newCar.plateNumber = plateNumber;
    newCar.brand = brand;
    newCar.state = true;
    await newCar.save();
    res.redirect("/car");
  }
});

router.get("/rent", async (req, res) => {
  const rents = await Rent.find();
  const cars = await Cars.find();
  res.render("rent", { rent: rents, car: cars });
});

router.post("/rent", async (req, res) => {
  const { numberPlateRent, brandRent, numberRent, dateRent } = req.body;
  const rents = await Rent.find();
  const cars = await Cars.find();
  const findPlateRent = await Rent.findOne({ plateNumber: numberPlateRent });
  if (
    numberPlateRent == "" ||
    brandRent == "" ||
    numberRent == "" ||
    dateRent == ""
  ) {
    res.render("rent", {
      errorMessage: "Ingrese todos los campos",
      rent: rents,
      car: cars,
    });
  } else if (findPlateRent) {
    res.render("rent", {
      errorMessage: "Numero de placa asociada a una renta",
      rent: rents,
      car: cars,
    });
  } else {
    const newRent = new Rent();
    newRent.plateNumber = numberPlateRent;
    newRent.brand = brandRent;
    newRent.numberRent = numberRent;
    newRent.rentDate = dateRent;
    newRent.state = true;
    await newRent.save();
    await Cars.updateOne(
      {plateNumber:numberPlateRent},{state:false}
    );
    res.redirect("rent");
  }
});

router.get("/aboutus", (req, res) => {
  res.render("aboutUs");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

module.exports = router;
