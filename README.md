# 运行项目步骤

### python 端

##### 请先安装 python、pip

##### 安装依赖

```
pip install flask
pip install CORS
pip install csv
```

##### 打开服务

```
cd python
python api.py
```

### React 端

##### 进入 React 项目目录

`cd demo-react`

##### 安装依赖

`yarn install`

##### 运行

`yarn start`

# 思路

题目是 做一个简单记账本的展示和新增功能，数据源在 csv 文件中

开始就来一个困难，就是发现 js 很难读写本地 csv 文件，所以就考虑用后端语言来操作 csv 文件。而 python 有完整的操作 csv 的依赖库，也比较简单易用，所以就用了。

前端采用了 React + antd Design 的结构

展示页没有用表格，而是采用了时间轴的形式，这纯粹就是因为我看着舒服多了

新增弹窗简单的做了数据校验和动态数据展示
