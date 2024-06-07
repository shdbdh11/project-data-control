/**
 *  注册业务
 */
document.querySelector('#btn-register').addEventListener('click', async e => {
  const data = serialize(document.querySelector('.register-form'), { hash: true, empty: true })
  // 判断格式是否符合
  if (!data.username || !data.password) {
    return showToast('输入不能为空')
  }
  if (data.username.length < 8 || data.username.length > 30) {
    return showToast('账号格式不符合')
  }
  if (data.password.length < 6 || data.password.length > 30) {
    return showToast('密码格式不符合')
  }
  // 发送请求
  try {
    const res = await axios.post('/register', data)
    showToast(res.message)

    setTimeout(() => {
      location.href = './login.html'
    }, 1500);
  }
  catch (error) {
    showToast(error.response.message)
  }

})