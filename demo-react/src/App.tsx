import React, { useState, useEffect } from 'react';
import { Timeline, Card, DatePicker } from 'antd';
import axios from 'axios'
import 'antd/dist/antd.css';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './App.css';

function getdate(timestamp: number): string {
  var now = new Date(timestamp),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}

function App() {
  let categoriesModel = [
    { id: '', type: '', name: '' }
  ];
  let billModel = [
    {
      key: '',
      amount: '',
      category: '',
      categoryStr: '',
      time: '',
      timeStr: '',
      type: '',
      typeStr: '',
      isShow: true,
    },
  ];
  const types = ['支出', '收入']
  let [categories, setCategories] = useState(categoriesModel)
  let [dataSource, setDataSource] = useState(billModel)

  useEffect(() => {
    (async () => {
      let categoriesRes = await axios(
        'http://127.0.0.1:5000/categories',
      )
      setCategories(categoriesRes.data)
      let billRes = await axios(
        'http://127.0.0.1:5000/bill',
      )
      setDataSource(billRes.data.sort((a: any, b: any) => a.time - b.time).map((e: any, i: number) => {
        return {
          ...e,
          key: i.toString(),
          timeStr: getdate(Number(e.time)).replace('00:00:00', ''),
          categoryStr: categoriesRes.data.filter((se: any) => se.id == e.category)[0].name,
          typeStr: types[e.type],
          isShow: true
        }
      }));
      console.log(billRes.data)
    })()
  }, []);

  function onChange(date: any, dateString: string) {
    setDataSource(dataSource.map(e => (e.isShow = e.timeStr.includes(dateString), e)))
  }

  return (
    <div className="site-card-border-less-wrapper">
      <Card bordered={false}>
        <DatePicker onChange={onChange} picker="month" locale={locale} />
        <Timeline mode='alternate'>
          {
            dataSource.map((e, i) =>
              e.isShow ? (
                <Timeline.Item
                  key={i}
                  position={e.type == '0' ? 'left' : 'right'}
                  color={e.type == '0' ? 'red' : 'green'}
                  dot={null}
                >
                  <p>{e.timeStr}</p>
                  <p>{`${e.categoryStr}  ${e.amount}元`}</p>
                </Timeline.Item>
              ) : undefined
            )
          }
        </Timeline>
      </Card>
    </div >
  );
}

export default App;
