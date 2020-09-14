import React, { useState, useEffect, useReducer } from 'react';
import { Timeline, Card, DatePicker, Row, Col, Statistic } from 'antd';
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
  // const [total, dispatch] = useReducer((state: any, action: any) => {
  //   switch (action.type) {
  //     case 'earning':
  //       return dataSource.reduce((total, curr) => {
  //         total.amount += (curr.isShow && curr.type) === '0' ? curr.amount : 0
  //         return total
  //       }).amount

  //     case 'expenditure':
  //       return dataSource.reduce((total, curr) => {
  //         total.amount += (curr.isShow && curr.type) === '1' ? curr.amount : 0
  //         return total
  //       }).amount
  //     default:
  //       return state;
  //   }
  // }, [])

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
          categoryStr: categoriesRes.data.filter((se: any) => se.id === e.category)[0].name,
          typeStr: types[e.type],
          isShow: true
        }
      }));
      console.log(billRes.data)
    })()
  }, []);

  function onChange(date: any, dateString: string) {
    setDataSource(dataSource.map(e => (e.isShow = e.timeStr.includes(dateString), e)))
    console.log(dataSource.filter(e => e.isShow && e.type === '0').map(e => parseFloat(e.amount)))
  }

  return (
    <div className="site-card-border-less-wrapper">
      <Card bordered={false} style={{ minHeight: 300 }}>
        <Row gutter={16} style={{ paddingBottom: 20 }}>
          <Col span={8} style={{ textAlign: "center", verticalAlign: "center" }}>
            <DatePicker onChange={onChange} picker="month" locale={locale} />
          </Col>
          {/* <Col span={8} style={{ textAlign: "center" }}><Statistic title="支出" value={dataSource.filter(e => e.isShow && e.type === '0').map(e => parseFloat(e.amount)).reduce((total, curr) => total += curr)} /></Col>
          <Col span={8} style={{ textAlign: "center" }}><Statistic title="收入" value={dataSource.filter(e => e.isShow && e.type === '1').map(e => parseFloat(e.amount)).reduce((total, curr) => total += curr)} /></Col> */}
        </Row>
        <Timeline mode='alternate'>
          {
            dataSource.map((e, i) =>
              e.isShow ? (
                <Timeline.Item
                  key={i}
                  position={e.type === '0' ? 'left' : 'right'}
                  color={e.type === '0' ? 'red' : 'green'}
                  dot={null}
                >
                  <div>{e.timeStr}</div>
                  <div>{`${e.categoryStr}  ${e.amount}元`}</div>
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
