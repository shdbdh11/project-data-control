// 验证token
checkToken()
// 渲染用户名
renderUname()
// 退出登录
logout()

// 获取数据渲染页面
async function renderStudentData() {
  const { data } = await axios.get('/students')
  console.log(data);
  document.querySelector('.list').innerHTML = data.map(item => {
    const { age, area, city, gender, group, hope_salary, salary, name, province } = item
    return `
        <tr>
           <td>${name}</td>
           <td>${age}</td>
           <td>${gender ? '女' : '男'}</td>
           <td>第${group}组</td>
           <td>${hope_salary}</td>
           <td>${salary}</td>
           <td>${province}${city}${area}</td>
           <td>
             <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen"></i></a>
             <a href="javascript:;" class="text-danger"><i class="bi bi-trash"></i></a>
           </td>
        </tr>`
  }).join('')
}
renderStudentData()