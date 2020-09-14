import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:5000/'
// 为给定 ID 的 user 创建请求
function getBill() {
  return axios.get('/bill?ID=12345')
}

export default { getBill }
