import axios from "axios";


// 创建axios实例并进行必要的配置
const api = axios.create({
  timeout: 1000,
})




export default api