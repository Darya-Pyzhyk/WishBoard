var express = require('express');
var router = express.Router();
const fs = require('fs');
var crypto = require('crypto');
var multer = require('multer')
var upload = multer({ dest: 'public/images/uploads/' })


router.post('/', upload.single('file'), function (req, res, next) {
    fs.readFile("wishes.json", function (err, data) {
        let arr = JSON.parse(data);
        let wishData = req.body;
        var hash = crypto.createHash('md5').update(wishData.title + Date.now().toString()).digest('hex');
        let filepath = "\\images\\defaultimg.png";
        if (req.file) { filepath = req.file.path.replace("public", ""); }
        let wish = { id: hash, title: wishData.title, link: wishData.link, info: wishData.info, status: "pending", file: filepath }
        arr.push(wish);
        fs.writeFile("wishes.json", JSON.stringify(arr), "utf8", function (err, data) {
            res.redirect("/");
        });
    });
});

router.get('/', function (req, res, next) {
    res.render("newwish");
});


module.exports = router;