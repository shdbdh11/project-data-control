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
    const { age, area, city, gender, group, hope_salary, salary, name, province, id } = item
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
             <a href="javascript:;" class="text-success mr-3"><i class="bi bi-pen" data-id="${id}"></i></a>
             <a href="javascript:;" class="text-danger"><i class="bi bi-trash" data-id="${id}"></i></a>
           </td>
        </tr>`
  }).join('')
}
renderStudentData()

// 点击 按钮+ 打开模态框 
const modal = document.querySelector('#modal')
const myModal = new bootstrap.Modal(modal)
document.querySelector('#openModal').addEventListener('click', e => {
  myModal.show()
  document.querySelector('.modal-title').innerHTML = '添加学员'
})

// 抽取省份联动函数
// 默认获取省份列表
const provinceDom = document.querySelector('[name="province"]')
const cityDom = document.querySelector('[name="city"]')
const areaDom = document.querySelector('[name="area"]')
const selectInit = async () => {

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

// 点击模态框 确定按钮  新增或编辑
const formDom = document.querySelector('#form')
document.querySelector('#submit').addEventListener('click', e => {
  const txt = document.querySelector('.modal-title').innerHTML
  if (txt.includes('添加')) addStudents()
  if (txt.includes('编辑')) edit_submit()

})


// 删除和编辑学生信息
document.querySelector('.list').addEventListener('click', e => {
  const { target: { classList, dataset: { id } } } = e
  // 如果点击的是删除
  if (classList.contains('bi-trash')) {
    del_stuData(id)
  }
  // 如果点击的是编辑
  if (classList.contains('bi-pen')) {
    // 打开模态框
    myModal.show()
    document.querySelector('.modal-title').innerHTML = '编辑学员'
    edit_stuData(id)
    // 存一个自定义属性 id ,方便点击提交时获取到该名学生的id
    document.querySelector('.modal-title').dataset.id = id
  }
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
    myModal.hide()
    // 提示成功
    showToast(res.message)
    // 清空表单
    formDom.reset()
    // 渲染数据
    renderStudentData()
  }
  catch (err) {
    // 添加失败，关闭模态框
    myModal.hide()
    // 提示失败
    showToast('输入数据错误')
  }
}

// 删除学生信息函数
const del_stuData = (id) => {
  try {
    axios.delete(`/students/${id}`)
    showToast('删除成功')
    renderStudentData()
  }
  catch (err) {
    showToast('删除失败，请检查网络')
  }
}

// 编辑学生信息函数
const edit_stuData = async (id) => {
  const res = await axios.get(`/students/${id}`)
  // console.log(res);
  // 根据该名学生信息回显到模态框
  // 先把能  直接回显的 抽取出来
  const arrKeys = ['age', 'group', 'name', 'hope_salary', 'salary']
  arrKeys.forEach(item => {
    document.querySelector(`[name=${item}]`).value = res.data[item]
  })

  // 性别回显
  const genders = document.querySelectorAll('[name="gender"]')
  genders[res.data.gender].checked = true

  // 省市区 回显
  const { province, city, area } = res.data
  // 省
  provinceDom.value = province
  // 市
  const { list: clist } = await axios.get('/api/city',
    { params: { pname: province } })
  cityDom.innerHTML = clist.map(item =>
    `<option value="${item}">${item}</option>`).join('')
  cityDom.value = city
  // 区
  const { list: alist } = await axios.get('/api/area',
    { params: { pname: province, cname: city } })
  areaDom.innerHTML = alist.map(item =>
    `<option value="${item}">${item}</option>`).join('')
  areaDom.value = area
}

// 编辑学生信息提交函数
const edit_submit = async () => {
  const id = document.querySelector('.modal-title').dataset.id
  // console.log(id)
  const data = serialize(formDom, { hash: true, empty: true })
  data.age = +data.age
  data.gender = +data.gender
  data.group = +data.group
  data.hope_salary = +data.hope_salary
  data.salary = +data.salary
  try {
    const res = await axios.put(`/students/${id}`, data)
    // 隐藏模态框
    myModal.hide()
    // 渲染
    renderStudentData()
    // 提示
    showToast(res.message)
    // 清空表单
    formDom.reset()
    // 清除模态框的自定义属性
    document.querySelector('.modal-title').dataset.id = ''
  } catch (err) {
    showToast('编辑失败，信息填写有误或检查网络')
  }

}