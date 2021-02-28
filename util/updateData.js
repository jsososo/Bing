const axios = require('axios');
const moment = require('moment');
const jsonfile = require('jsonfile');

const getData = async () => {
  let { imgArr } = global;
  if (!imgArr) {
    const { imgs } = await jsonfile.readFile('bing_data/allData.json')
      .catch(() => ({ imgs: [] }))

    imgArr = new Proxy(imgs.sort((a, b) => a.date - b.date), {
      get: (target, key) => (target[key] || target.find(({date}) => `${date}` === key) || undefined),
      set: (target, key, val) => {
        target[key] = val;
        if (!isNaN(key / 1)) {
          const nowStr = moment().format('YYYY-MM-DD HH:mm:ss');
          jsonfile.writeFile('bing_data/' + moment().format('YYYYMMDD') + '.json', {imgs: target, nowStr}, {
            spaces: 2,
            EOL: '\r\n'
          });
          jsonfile.writeFile('bing_data/allData.json', {imgs: target, date: nowStr}, {spaces: 2, EOL: '\r\n'});
        }
        return true;
      }
    });

    imgArr.forEach((o, i) => {
      if (i !== 0) {
        imgArr[i-1].next = o.date;
        imgArr[i].prev = imgArr[i-1].date;
      }
    });
    global.imgArr = imgArr;
  }

  return imgArr
}

const updateData = async (init) => {
  const imgArr = await getData();
  const { data } = await axios('http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=1553500237029&pid=hp');
  const now = moment();
  const nowYMD = now.format('YYYY-MM-DD 00:00:00');
  const tomorrow = moment(nowYMD).add(1, 'd');
  const nowStr = now.format('YYYY-MM-DD HH:mm:ss');
  global.tomorrow = tomorrow;
  // console.log(data);


  let timeout = init ? (tomorrow - now + 1000) : 5000;
  data.images.sort((a, b) => a.enddate - b.enddate)
    .forEach((img) => {
    if (!imgArr[img.enddate]) {
      let i = imgArr.length;
      const prev = imgArr[i-1];
      const newImg = {
        date: Number(img.enddate),
        url: img.url,
        urlbase: img.urlbase,
        cp: img.copyright,
        cpl: img.copyrightlink,
        createdAt: nowStr,
        updatedAt: nowStr,
      };
      if (prev) {
        newImg.prev = prev.date;
        prev.next = newImg.date;
      }

      imgArr.push(newImg);
      timeout = tomorrow - now + 1000;
    }
  });

  setTimeout(() => {
    updateData()
  }, timeout)
}

module.exports = updateData;