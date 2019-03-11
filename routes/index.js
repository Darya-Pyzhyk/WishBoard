var express = require('express');
var router = express.Router();
const fs = require('fs');
const index = "/";
const index_with_sort = "/?sort=true";


let sort_link = index;

router.get('/', function (req, res, next) {
  fs.readFile("wishes.json", function (err, data) {
    let sorttype = "SORT BY STATUS";
    sort_link = index_with_sort;
    let arr = JSON.parse(data);
    if (req.query.sort) {
      sorttype = "SORT BY CREATION TIME";
      sort_link = index;
      arr.sort(function (a, b) {
        if (a.status > b.status) {
          return -1;
        }
        if (a.status < b.status) {
          return 1;
        }
        return 0;
      });
    }
    res.render("index", { wishes: arr, sorttype: sorttype, sortlink: sort_link });
  })
});

router.get('/statuschange', function (req, res, next) {
  let id = req.query.id;
  fs.readFile("wishes.json", function (err, data) {
    let arr = JSON.parse(data);
    let ind = arr.findIndex(function (element, index, array) {
      return element.id == id;
    });
    arr[ind].status = arr[ind].status == "pending" ? "done" : "pending";
    fs.writeFile("wishes.json", JSON.stringify(arr), "utf8", function (err, data) {
      res.redirect(sort_link == index ? index_with_sort : index);
    });
  });
});

router.get('/delete', function (req, res, next) {
  let id = req.query.id;
  fs.readFile("wishes.json", function (err, data) {
    let arr = JSON.parse(data);
    arr = arr.filter(function (element, index, array) {
      if (element.id == id) {
        if (element.file != "\\images\\defaultimg.png") {
          fs.unlinkSync("public" + element.file, function (err) { });
        }
        return false;
      }
      else return true
    });
    fs.writeFile("wishes.json", JSON.stringify(arr), "utf8", function (err, data) {
      res.redirect(sort_link == index ? index_with_sort : index);
    });
  });
});


module.exports = router
