// 创建 axios 基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net'

// 封装提示框函数
const showToast = (msg) => {
  const myToast = document.querySelector('.my-toast')
  const toast = new bootstrap.Toast(myToast)
  toast.show()
  document.querySelector('.toast-body').innerHTML = msg
}



const data = localStorage.getItem('userMsg') ? JSON.parse(localStorage.getItem('userMsg')) : {}
// token是否存在验证
const checkToken = () => {
  const { token } = data
  if (!token) {
    showToast('身份信息过期，请重新登录')
    setTimeout(e => { location.href = './login.html' }, 1500)
  }
}

// 根据本地存储回显用户名
const renderUname = () => {
  const { username } = data
  if (username) {
    document.querySelector('.username').innerHTML = username
  }
}

// 退出登录
const logout = () => {
  document.querySelector('#logout').addEventListener('click', e => {
    // 清空本地存储
    localStorage.removeItem('userMsg')
    showToast('退出登录成功')
    setTimeout(() => {
      location.href = './login.html'
    }, 1500);
  })
}

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config);
  // 根据本地的 token 来发送请求  (但是没登录前是没有token的)
  const { token } = data
  if (token) config.headers['Authorization'] = token

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // console.log(response);
  // 进行数据剥离
  return response.data
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 判断token是否过期，过期就提示用户并退出登录
  if (error.response.status === 401) {
    showToast('您的登录信息已过期，请重新登录')
    localStorage.removeItem('userMsg')
    setTimeout(() => {
      location.href = './login.html'
    }, 1500);
  }
  return Promise.reject(error);
});