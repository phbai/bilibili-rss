const express = require('express');
const router = express.Router();
const Bilibili = require('bilibili-api').default;
const bilibili = new Bilibili();
const axios = require('axios');
const converter = require('../lib/converter');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  const username = req.query.username;
  const password = req.query.password;

  bilibili.login(username, password)
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/dynamic', function(req, res, next) {
  const accessKey = req.query.accessKey;
  const uid = req.query.uid;
  const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?access_key=${accessKey}&type=268435455&uid=${uid}`;

  axios.get(url)
    .then(function (response) {
      const { data } = response;
      const str = JSON.stringify(data);
      const result = str.replace(/\\/g, '').replace(/"{/g, '{').replace(/}"/g, '}').replace(/"\[{/g, '[{').replace(/}\]"/, '}]');
      res.json(JSON.parse(result));
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get('/dynamic-rss', function(req, res, next) {
  const accessKey = req.query.accessKey;
  const uid = req.query.uid;
  const url = `https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?access_key=${accessKey}&type=268435455&uid=${uid}`;

  axios.get(url)
    .then(function (response) {
      const { data } = response;
      const str = JSON.stringify(data);
      const result = str.replace(/\\/g, '').replace(/"{/g, '{').replace(/}"/g, '}').replace(/"\[{/g, '[{').replace(/}\]"/, '}]');
      var list = JSON.parse(result).data.cards;
      var rss =
          `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">
      <channel>
      <title>91porn</title>
      <link>https://www.91porn.com/</link>
      <description>自制的91porn rss</description>
      <language>zh-cn</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <ttl>300</ttl>`
      for (var i = 0; i < list.length; i++) {
          rss += converter(list[i]);
      }
      rss += `
      </channel>
      </rss>`;
      res.end(rss);
    })
    .catch(function (error) {
      console.log(error);
    });
});
module.exports = router;
