import * as request from "request";
import * as cheerio from "cheerio";
import * as fs from "fs";

const linkHumidifier = 'https://www.salidzini.lv/cena?q=Beurer+LB50';
const linkProcessor = 'https://www.salidzini.lv/cena?q=Amd+Ryzen+5+3600Xt';
const linkSonyPlaystation4Slim = 'https://www.salidzini.lv/cena?q=Sony+Playstation+4+PS4+Slim+500GB+';
const linkSonyXboxS = 'https://www.salidzini.lv/cena?q=Microsoft+Xbox+Series+S+500GB';
const linkSony = 'https://www.salidzini.lv/cena?q=rtx+2060+';
const Urls = [linkHumidifier, linkProcessor, linkSonyPlaystation4Slim, linkSonyXboxS, linkSony];
Urls.forEach(url => {
    getOfferForSalidzini(url, "1a.lv").then(price => {
        fs.appendFileSync("1aLV.csv", `${url};${new Date()};${price || ""}\n`)
    });
})

function getOfferForSalidzini(url: string, shopName: string): Promise<string | undefined> {
    return new Promise(resolve => {
        request(url, function (err, res, body) {
            if (err) throw err;
            const $ = cheerio.load(body);
            const allShops = $('.item_box_main');

            const shops = allShops.toArray().filter((el) => getShopName($(el)) === shopName);
            if (shops.length > 1) {
                throw new Error("To many shops with product");
            }
            const theShop = shops[0];
            const price = getPrice($(theShop));
            resolve(price);
        });
    })

    function getShopName(el: cheerio.Cheerio): string | undefined {
        return el.find(`[itemtype="http://schema.org/Organization"] > [itemprop="name"]`).attr('content');
    }

    function getPrice(el: cheerio.Cheerio): string | undefined {
        return el.find('span[itemprop="price"]').attr('content');
    }
}


