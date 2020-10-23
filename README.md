## 必应壁纸

### 一些可有可无的说明

该项目基于 next.js 开发，服务端渲染 react 项目。

项目的默认端口为 3001，可以在 `app.js` 里修改，项目启动后的爬虫接口在
`util/updateData.js` 文件中，每天12点定时爬取，数据会存储在
`bing_data/` 文件夹下。目前并没有将图片另外保存至其他地方，
只保存了图片路径。

### 开发

```shell script
git clone https://github.com/jsososo/Bing.git

yarn

yarn dev
```

### 部署

```shell script
yarn build

yarn start
```
