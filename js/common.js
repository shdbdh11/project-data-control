// 创建 axios 基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net'

// 封装提示框函数
const showToast = (msg) => {
  const myToast = document.querySelector('.my-toast')
  const toast = new bootstrap.Toast(myToast)
  toast.show()
  document.querySelector('.toast-body').innerHTML = msg
}

// token是否存在验证
const checkToken = () => {
  const data = localStorage.getItem('userMsg') ? JSON.parse(localStorage.getItem('userMsg')) : {}
  const { token } = data
  if (!token) {
    showToast('身份信息过期，请重新登录')
    setTimeout(e => { location.href = './login.html' }, 1500)
  }
}
