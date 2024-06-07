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
  const res = await axios({
    url: '/dashboard',
    method: 'GET',

  })
  // 渲染数据
  // 渲染overview
  renderOverview(res.data.overview)
}
getData()
// 渲染overview
function renderOverview(overview) {
  // 渲染页面  overview的键 和 需要渲染的地方的类名一致
  Object.keys(overview).forEach(item => {
    document.querySelector(`.${item}`).innerHTML = overview[item]
  });
} 
