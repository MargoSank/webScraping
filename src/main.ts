import * as request from "request";
import * as cheerio from "cheerio";


const link = 'http://map.martovs.lv';

request(link, function (err, res, body) {
    if (err) throw err;

    const $ = cheerio.load(body);
    console.log($('.form-signin-heading').text());
    console.log(res.statusCode);
});
