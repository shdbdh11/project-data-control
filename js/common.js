// 创建 axios 基地址
axios.defaults.baseURL = 'https://hmajax.itheima.net'

// 封装提示框函数
const showToast = (msg) => {
  const myToast = document.querySelector('.my-toast')
  const toast = new bootstrap.Toast(myToast)
  toast.show()
  document.querySelector('.toast-body').innerHTML = msg
}
