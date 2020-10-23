import {useRouter} from "next/router";
import '../styles/about.scss';


export async function getServerSideProps(context) {
  const {imgArr} = global;
  return {
    props: {
      img: imgArr[Math.floor(Math.random() * imgArr.length)],
    }
  }
}

export default function about({img = {}}) {
  const router = useRouter();

  return (
    <div className="about-page">
      <div className="about-content" style={{backgroundImage: `url(//cn.bing.com${img.url})`}}>
      </div>
      <div className="text-content">
        <h2>
          关于 <a href="/">必应壁纸</a><a target="_blank" href=" "><a href="https://github.com/jsososo/Bing" target="_blank" className="icon-github iconfont"/></a>
        </h2>
        <p> Bing 壁纸很好看不是嘛，如果有一个能回顾之前每一天的必应壁纸就更好啦，所以就诞生了这个网站～ </p>
        <p> 后端目前还没开源，因为比较简单，是一个 nodejs 项目，每天定时从
          <a target="_blank" href="http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&nc=1553500237029&pid=hp">
            必应接口
          </a>
          获取数据然后保存。（很丢人，目前存储方式为每天保存一份 json 文件，都没用数据库）
        </p>
        <p> 有问题、建议欢迎 issue，pr
          走起 <a target="_blank" href="https://github.com/jsososo/Bing">https://github.com/jsososo/Bing</a></p>
        <p> 如果喜欢的话，给个 star 吧，如果很喜欢的话，给点服务器香油钱吧 <div>< img className="img-pay" src="/pay-1.png" alt=""/> < img
          className="img-pay" src="/pay-2.jpeg" alt=""/></div></p>
      </div>
    </div>
  )
}