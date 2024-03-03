const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const recentPostModel = require("../models/recentPostModel");
const commentModel = require("../models/commentModel");

module.exports = {
  currentUser(req, res, next) {
    UserModel.findById(req.user.id)
      .then((data) => {
        res.status(200).json({
          data: {
            _id: data._id,
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            imageUrl: data.imageUrl,
            address: data.address,
            phone: data.phone,
            role: data.role,
            gender: data.gender,
          },
        });
      })
      .catch((err) => res.sendStatus(500));
  },

  register(req, res, next) {
    const handlePassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ACCESS_TOKEN
    ).toString();

    req.body.password = handlePassword;
    const account = new UserModel(req.body);
    account
      .save()
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },

  login(req, res, next) {
    UserModel.findOne({ username: req.body.username })
      .then((data) => {
        if (!data) res.status(404).json({ error: "Invalid username" });
        else {
          const hashedPassword = CryptoJS.AES.decrypt(
            data.password,
            process.env.ACCESS_TOKEN
          ).toString(CryptoJS.enc.Utf8);

          if (hashedPassword !== req.body.password) {
            return res.status(401).json({ error: "Invalid password" });
          }

          const accessToken = jwt.sign(
            {
              id: data._id,
              role: data.role,
            },
            process.env.ACCESS_TOKEN,
            {
              expiresIn: "7d",
            }
          );

          const { ...other } = data._doc;

          res.status(200).json({ ...other, token: accessToken });
        }
      })
      .catch((err) => res.sendStatus(500));
  },

  addDoctor(req, res, next) {
    const handlePassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ACCESS_TOKEN
    ).toString();

    req.body.role = 1;
    req.body.password = handlePassword;
    const account = new UserModel(req.body);
    account
      .save()
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },

  getDoctor(req, res, next) {
    const { page, per_page, specialist, fullName } = req.query;
    const objWhere = { role: 1 };

    if (specialist) objWhere.specialist = new RegExp(specialist, "i");
    if (fullName) objWhere.fullName = new RegExp(fullName, "i");

    UserModel.find(objWhere)
      .sort({ _id: -1 })
      .then((data) => {
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(per_page) || data.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const items = data.slice(startIndex, endIndex);

        res.json({
          data: items,
          currentPage,
          totalPages,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },

  getDoctorBySickName(req, res, next) {
    const regex = new RegExp(req.params.sick, "i");

    UserModel.find({
      sicks: { $regex: regex },
    }).then((data) => res.json({ data: data }));
  },

  getUser(req, res, next) {
    const { page, per_page, fullName } = req.query;
    const objWhere = { role: 2 };

    if (fullName) objWhere.fullName = new RegExp(fullName, "i");

    UserModel.find(objWhere)
      .sort({ _id: -1 })
      .then((data) => {
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(per_page) || data.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const items = data.slice(startIndex, endIndex);

        res.json({
          data: items,
          currentPage,
          totalPages,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },

  deleteUser(req, res, next) {
    const deleteMany = async () => {
      await appointmentModel.deleteMany({ doctorId: req.params.id });
      await appointmentModel.deleteMany({ currentUserId: req.params.id });
      await recentPostModel.find().then((data) => {
        data.map((statusId) => {
          commentModel
            .deleteMany({ recentPostId: statusId._id })
            .then((data) => console.log(data));
        });
      });
      await recentPostModel.deleteMany({ doctorId: req.params.id });
    };

    UserModel.findByIdAndDelete(req.params.id)
      .then((data) => {
        res.status(200).json({ data });
        deleteMany();
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },

  editUser(req, res, next) {
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const base64Data = fileBuffer.toString("base64");
      req.body.imageUrl = `data:image/jpeg;base64,${base64Data}`;
    }

    req.body.sicks = req.body.sicks === "" ? [] : req.body.sicks.split(",");

    const handlePassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.ACCESS_TOKEN
    ).toString();
    req.body.password = handlePassword;

    UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => {
        res.status(500).json({ error: error });
      });
  },
};
