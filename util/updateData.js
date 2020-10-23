const axios = require('axios');
const moment = require('moment');
const jsonfile = require('jsonfile');

const getData = async () => {
  let { imgArr, imgMap } = global;
  if (!imgArr) {
    const { imgs } = await jsonfile.readFile('bing_data/allData.json')
      .catch(() => ({ imgs: [] }))

    imgArr = imgs;
    imgMap = {};

    imgArr.forEach((o, i) => {
      if (i !== 0) {
        imgArr[i-1].next = o.date;
        imgArr[i].prev = imgArr[i-1].date;
      }
      imgMap[o.date] = o;
    });
    global.imgArr = imgArr;
    global.imgMap = imgMap;
  }

  return {
    imgArr,
    imgMap,
  }
}

const updateData = async (init) => {
  const { imgArr, imgMap } = await getData();
  const { data } = await axios('http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=1553500237029&pid=hp');
  const now = moment();
  const nowYMD = now.format('YYYY-MM-DD 00:00:00');
  const tomorrow = moment(nowYMD).add(1, 'd');
  const nowStr = now.format('YYYY-MM-DD HH:mm:ss');
  global.tomorrow = tomorrow;
  // console.log(data);


  let timeout = init ? (tomorrow - now + 1000) : 5000;
  let hasNew = false;
  data.images.sort((a, b) => a.enddate - b.enddate)
    .forEach((img) => {
    if (!imgMap[img.enddate]) {
      timeout = true;
      hasNew = true;

      let i = imgArr.length;
      const newImg = {
        date: Number(img.enddate),
        url: img.url,
        urlbase: img.urlbase,
        cp: img.copyright,
        cpl: img.copyrightlink,
        createdAt: nowStr,
        updatedAt: nowStr,
        prev: imgArr[i-1].date,
      };
      imgArr[i-1].next = newImg.date;

      imgArr.push(newImg);
      imgMap[img.enddate] = newImg;
      timeout = tomorrow - now + 1000;
    }
  });

  if (hasNew) {
    jsonfile.writeFile('bing_data/' + moment().format('YYYYMMDD') + '.json', { imgs: imgArr, nowStr });
    jsonfile.writeFile('bing_data/allData.json', { imgs: imgArr, date: nowStr });
  }

  setTimeout(() => {
    updateData()
  }, timeout)
}

module.exports = updateData;