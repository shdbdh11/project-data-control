/**
 *  token验证
 */
checkToken()

/**
 *  渲染用户名
 */
renderUname()

/**
 *  退出登录
 */
logout()

/**
 *  封装函数 => 获取数据
 */
const getData = async () => {
  // const { token } = JSON.parse(localStorage.getItem('userMsg'))
  try {
    const res = await axios({
      url: '/dashboard',
      method: 'GET',
      // headers: {
      //   Authorization: token
      // }
    })
    // console.log(res);
    // 渲染数据
    // 渲染overview
    renderOverview(res.data.data.overview)
  } catch (err) {
    console.dir(err);
    // 判断token是否过期，过期就提示用户并退出登录
    if (err.response.status === 401) {
      showToast('您的登录信息已过期，请重新登录')
      localStorage.removeItem('userMsg')
      setTimeout(() => {
        location.href = './login.html'
      }, 1500);
    }
  }
}
getData()
// 渲染overview
function renderOverview(overview) {
  // console.log(overview);
  // 渲染页面  overview的键 和 需要渲染的地方的类名一致
  Object.keys(overview).forEach(item => {
    document.querySelector(`.${item}`).innerHTML = overview[item]
  });
} 
