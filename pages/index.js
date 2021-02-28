import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import '../styles/index.scss';
import moment from 'moment';

export default function () {

  const [list, updateList] = useState([]);
  const [nextDate, updateNextDate] = useState(0);
  const [loading, updateLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [isEmpty, setEmpty] = useState(false);

  const checkMode = () => {
    if (window.innerWidth < 1024 || window.innerWidth < window.innerHeight) {
      setIsMobile(true);
      return true;
    }
    setIsMobile(false)
    return false;
  }

  const queryList = (nextDate, isMobile) => {
    updateLoading(true);
    axios(`/api/list?date=${nextDate}&count=10`)
      .then(({ data }) => {
        let count = 0;
        const maxCount = isMobile ? 0 : 2;
        data.data.forEach((item, i) => {
          let span = 1;
          (count < maxCount) && maxCount && (span = Math.ceil(Math.random() * 2));
          ((maxCount-count) === (10 - i)) && maxCount && (span = 2);

          console.log(maxCount, span, isMobile);
          span === 2 && (count += 1);
          item.style = {
            gridColumnStart: `span ${span}`,
            gridRowStart: `span ${span}`,
          }
          item.dateStr = moment(item.date, 'YYYYMMDD').format('YY.MM.DD');
          item.span = span;
        })
        const last = data.data.last()
        updateList([ ...list, ...data.data ]);
        !last.prev && setEmpty(true);
        updateNextDate(last.prev);
        updateLoading(false);

      })
  }

  const $page = useRef();

  useEffect((e) => {
    window.onscroll = () => {
      if (loading || isEmpty) {
        return;
      }
      setShowTop(document.documentElement.scrollTop > 700);
      if (document.documentElement.clientHeight + document.documentElement.scrollTop + 50 > $page.current.clientHeight) {
        queryList(nextDate, isMobile);
      }
    }
    setTimeout(() => {
      window.onscroll();
    })
  }, [nextDate, loading]);

  useEffect(() => {
    const isMobile = checkMode();
    Array.prototype.last = function () {
      return this[this.length-1];
    }

    queryList(nextDate, isMobile)
  }, [])

  return (
    <div className={`index-page ${isMobile && 'mobile-page'}`} ref={$page}>
      <div id="head" />
      <div className="img-list"
           style={{
             gridTemplateRows: isMobile ? `repeat(${list.length}, 75vw)` : `repeat(${Math.ceil(list.length/10)*4}, 19vw)`
           }}>
        {
          list.map((img) => (
            <div
              className="img-item"
              style={img.style}
              key={img.date}
            >
              <div className="cover">
                <a className="iconfont icon-eye" href={`/${img.date}`} />
                <span className="text">{img.cp}</span>
              </div>
              <div className={`date-str size-${img.span}`}>{img.dateStr}</div>
              <div className="img-bg" style={{backgroundImage: `url('//cn.bing.com${img.urlbase}_${false ? '768x1280' : '1024x768'}.jpg')`}} />
            </div>
          ))
        }
      </div>
      {isEmpty && <div className="empty-text">—— 到底啦 ——</div>}
      <div className="right-btn">
        <div className={`to-top iconfont icon-arrow-left ${!showTop && 'hide'}`} onClick={() => window.scrollTo(0, 0)} />
        <a className="iconfont icon-touzi" href='/random' />
      </div>
    </div>
  )
}