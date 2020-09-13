import React from 'react';
import { Table, Tag, Space } from 'antd';
import './App.css';

function App() {
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <Table dataSource={dataSource} columns={columns} />
  );
}

export default App;
