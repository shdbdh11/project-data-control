/**
 *  登录业务
 */
document.querySelector('#btn-login').addEventListener('click', async e => {
  const data = serialize(document.querySelector('.login-form'), { hash: true, empty: true })
  // 判断格式是否符合
  if (!data.username || !data.password) {
    return showToast('输入不能为空')
  }
  if (data.username.length < 8 || data.username.length > 30) {
    return showToast('账号必须有8-30个字符')
  }
  if (data.password.length < 6 || data.password.length > 30) {
    return showToast('密码必须有6-30个字符')
  }
  // 发送请求
  try {
    const res = await axios.post('/login', data)
    showToast(res.data.message)
    // console.log(res);
    const obj = {
      username: res.data.data.username,
      token: res.data.data.token
    }
    // 登录成功 将用户信息存到本地
    localStorage.setItem('userMsg', JSON.stringify(obj))

    setTimeout(() => {
      location.href = './index.html'
    }, 1500)
  }
  catch (error) {
    showToast(error.response.data.message)
  }
}
)