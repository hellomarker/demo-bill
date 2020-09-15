import React, { useState, useEffect, } from 'react';
import { Timeline, Card, DatePicker, Row, Col, Statistic, Modal, Form, Select, Button, InputNumber, Switch } from 'antd';
import axios from 'axios'
import { PlusCircleOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import './App.css';

interface CategoriesModel {
  id: string;
  type: string;
  name: string;
}

function App() {
  let categoriesModel: Array<CategoriesModel> = [{ id: '', type: '', name: '' }];
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
  const [categories, setCategories] = useState(categoriesModel)
  const [dataSource, setDataSource] = useState(billModel)
  const [total, setTotal] = useState({ earning: 0, expenditure: 0 })
  const [showFormModel, setShowFormModel] = useState(false)
  const [filterParams, setFilterParams] = useState({ time: '', categorie: '' })

  // 初始化
  useEffect(() => {
    (async () => {
      categoriesModel = (await axios('http://127.0.0.1:5000/categories',)).data
      setCategories(categoriesModel)
      billModel = (await axios('http://127.0.0.1:5000/bill',)).data
      setDataSource(billModel.sort((a, b) => parseFloat(b.time) - parseFloat(a.time)).map((e, i) => {
        return {
          ...e,
          key: i.toString(),
          timeStr: moment(parseInt(e.time)).format('YYYY-MM-DD HH:mm:ss').replace('00:00:00', ''),
          categoryStr: categoriesModel.filter(se => se.id === e.category)[0].name,
          typeStr: types[parseInt(e.type)],
          isShow: true
        }
      }));
      setTotal({
        expenditure: [...billModel.filter(e => e.type === '0').map(e => parseFloat(e.amount)), 0].reduce((t, c) => t += c),
        earning: [...billModel.filter(e => e.type === '1').map(e => parseFloat(e.amount)), 0].reduce((t, c) => t += c),
      })
    })()
  }, []);

  // 筛选 回调
  useEffect(() => {
    setDataSource(dataSource.map(e => (e.isShow = true, e)).map(e => {
      if (filterParams.time)
        e.isShow = e.timeStr.includes(filterParams.time)
      if (filterParams.categorie)
        e.isShow = e.isShow && e.category === filterParams.categorie
      return e
    }))
    setTotal({
      expenditure: [...dataSource.filter(e => e.isShow && e.type === '0').map(e => parseFloat(e.amount)), 0].reduce((t, c) => t += c),
      earning: [...dataSource.filter(e => e.isShow && e.type === '1').map(e => parseFloat(e.amount)), 0].reduce((t, c) => t += c),
    })
  }, [filterParams])
  return (
    <div className="site-card-border-less-wrapper">
      <Card bordered={false} >
        <Row gutter={16} style={{ paddingBottom: 20, marginBottom: 8, position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
          <Col span={8} style={{ textAlign: "center", alignSelf: 'center' }}>
            <DatePicker onChange={(date: any, dateString: string) => setFilterParams({ ...filterParams, time: dateString })} picker="month" locale={locale} style={{ marginRight: 10 }} allowClear />
            <Select placeholder='请选择账单分类' style={{ width: 150 }} onChange={(e: any) => setFilterParams({ ...filterParams, categorie: e })} allowClear>
              {categories.map(e => (
                <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={8} style={{ textAlign: "center" }}><Statistic title="总支出金额" value={total.expenditure} /></Col>
          <Col span={8} style={{ textAlign: "center" }}><Statistic title="总收入金额" value={total.earning} /></Col>
        </Row>
        <Timeline mode='alternate'>
          <Timeline.Item
            position={'left'}
            dot={<PlusCircleOutlined style={{ fontSize: '24px' }} onClick={() => setShowFormModel(true)} />}
            style={{ marginBottom: 20 }}
          >
          </Timeline.Item>
          {
            dataSource.map((e, i) =>
              e.isShow ? (
                <Timeline.Item
                  key={i}
                  position={e.type === '0' ? 'left' : 'right'}
                  color={e.type === '0' ? 'red' : 'green'}
                >
                  <div>{e.timeStr}</div>
                  <div>{`${e.categoryStr}  ${e.amount}元`}</div>
                </Timeline.Item>
              ) : undefined
            )
          }
        </Timeline>
      </Card>
      <FormModel isShow={showFormModel} setShow={setShowFormModel} categories={categories}></FormModel>
    </div >
  );
}

function FormModel({ isShow, setShow, categories }: { isShow: boolean, setShow: Function, categories: Array<CategoriesModel> }) {
  let dataSource = { time: '', type: '0', category: '', amount: '' }
  // 提交新增账单
  const onFinish = async (values: any) => {
    console.log(values)
    await axios.post('http://127.0.0.1:5000/updateBill', { ...values, firstName: 'fred' })
    // axios.post('/user', {
    //   firstName: 'Fred',
    //   lastName: 'Flintstone'
    // })
  };
  return (
    <Modal
      title="新增账单"
      visible={isShow}
      onCancel={() => setShow(false)}
      footer={null}
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="时间"
          name="time"
          rules={[{ required: true, message: '请选择时间!' }]}
        >
          <DatePicker showTime placeholder='请选择时间' onChange={(e) => { if (e) dataSource.time = e.format('YYYY-MM-DD HH:mm:ss') }} />
        </Form.Item>
        <Form.Item
          label="账单类型"
          name="type"
          rules={[{ required: false, message: '请选择账单类型!' }]}
          valuePropName='type'
        >
          <Switch checkedChildren="支出" unCheckedChildren="收入" defaultChecked onChange={(e) => { if (e) dataSource.type = e ? "1" : "0" }} />
        </Form.Item>
        <Form.Item
          label="账单分类"
          name="category"
          rules={[{ message: '请选择账单分类!' }]}
        >
          <Select placeholder='请选择账单分类' style={{ width: 150 }} onChange={(e) => { if (e) dataSource.category = e.toString() }}>
            {categories.map(e => (
              <Select.Option key={e.id} value={e.id}>{e.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="金额"
          name="amount"
          rules={[{ required: true, message: '请输入金额!' }]}
        >
          <InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value = '') => value.replace(/\$\s?|(,*)/g, '')}
            onChange={(e) => { if (e) dataSource.amount = e.toString() }}
            precision={2}
          />
        </Form.Item>
        <Form.Item {...{ wrapperCol: { offset: 8, span: 16 }, }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </Modal >
  )
}


export default App;
