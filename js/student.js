// 验证token
checkToken()
// 渲染用户名
renderUname()
// 退出登录
logout()

// 获取数据 =>渲染页面
async function renderStudentData() {
  const { data } = await axios.get('/students')
  // console.log(data);
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

// 点击 按钮+ 打开模态框 
const modal = document.querySelector('#modal')
const addModal = new bootstrap.Modal(modal)
document.querySelector('#openModal').addEventListener('click', e => {
  addModal.show()
})

// 抽取省份联动函数
// 默认获取省份列表
const selectInit = async () => {
  const provinceDom = document.querySelector('[name="province"]')
  const cityDom = document.querySelector('[name="city"]')
  const areaDom = document.querySelector('[name="area"]')

  const { list } = await axios.get('/api/province')
  // 渲染省份
  provinceDom.innerHTML += list.map(item => {
    return `<option value="${item}">${item}</option>`
  })
  // 渲染城市 
  provinceDom.addEventListener('change', async e => {
    // 渲染前先去除之前渲染过的
    cityDom.innerHTML = ' <option value="">--城市--</option>'
    // console.log(e.target.value);
    pname = e.target.value
    const { list } = await axios.get('/api/city', { params: { pname } })
    cityDom.innerHTML += list.map(item => {
      return `<option value="${item}">${item}</option>`
    }).join('')
  })
  // 渲染地区
  cityDom.addEventListener('change', async e => {
    // 渲染前先去除之前渲染过的
    areaDom.innerHTML = ' <option value="">--地区--</option>'
    // console.log(e.target.value);
    const { list } = await axios.get('/api/area', {
      params: {
        pname: provinceDom.value,
        cname: e.target.value
      }
    })
    areaDom.innerHTML += list.map(item => {
      return `<option value="${item}">${item}</option>`
    }).join('')
  })
}
selectInit()

// 点击模态框 确定按钮新增
const formDom = document.querySelector('#form')
document.querySelector('#submit').addEventListener('click', e => {
  addStudents()
})

// 添加学生信息函数
const addStudents = async () => {
  // 获取表单数据
  const data = serialize(formDom, { hash: true, empty: true })
  // console.log(data);
  data.age = +data.age
  data.gender = +data.gender
  data.group = +data.group
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  try {
    const res = await axios.post('/students', data)
    // console.log(res);
    // 添加成功，关闭模态框
    addModal.hide()
    // 提示成功
    showToast(res.message)
    // 清空表单
    formDom.reset()
    // 渲染数据
    renderStudentData()
  }
  catch (err) {
    // 添加失败，关闭模态框
    addModal.hide()
    // 提示失败
    showToast('输入数据错误')
  }
}