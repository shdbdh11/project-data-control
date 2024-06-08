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
  const res = await axios.get('/dashboard')
  console.log(res);
  const { overview, year, salaryData, groupData } = res.data
  // 渲染数据
  // 渲染overview
  renderOverview(overview)
  // 渲染  id="line"
  renderYear(year)
  // 渲染 salary
  renderSalary(salaryData)
  // 渲染 groupData
  renderGroupData(groupData)
  // 渲染 男女薪资分布
  renderFnbu(salaryData)
}
getData()

// 渲染 overview
function renderOverview(overview) {
  // 渲染页面  overview的键 和 需要渲染的地方的类名一致
  Object.keys(overview).forEach(item => {
    document.querySelector(`.${item}`).innerHTML = overview[item]
  });
}

// 渲染 year   id="line"
function renderYear(year) {
  // console.log(year);
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector('#line'));
  // 指定图表的配置项和数据
  const option = {
    title: {
      text: '薪资走势',
      left: 10,
      top: 10
    },
    xAxis: {
      type: 'category',
      axisLine: {
        // 轴线样式
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        },
      },
      data: year.map(item => item.month)
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: year.map(item => item.salary),
        type: 'line',
        smooth: true,
        symbolSize: 10,
        lineStyle: {
          width: 5,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [{
              offset: 0, color: '#65a0f8' // 0% 处的颜色
            }, {
              offset: 1, color: '#6875f6' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        },
        areaStyle: {
          /* 线性渐变，前四个参数分别是 x0, y0, x2, y2, 
            范围从 0 - 1，相当于在图形包围盒中的百分比，
            如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
          */
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#518fef' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(255,255,255,0)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ],
    // 提示框组件
    tooltip: {
      show: true,
      // 根据轴线触发
      trigger: 'axis'
    }
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}

// 渲染 salary
function renderSalary(salaryData) {
  // console.log(salaryData);
  // 生成图标
  // 初始化实例化对象
  const myChart = echarts.init(document.querySelector('#salary'))
  const option = {
    title: {
      text: '班级薪资分布',
      top: 10,
      left: 10,
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 5,
      left: 'center'
    },
    series: [
      {
        name: '班级薪资分布',
        type: 'pie',
        // 圆饼大小 [圆饼内半径，圆饼外半径]
        radius: ['55%', '80%'],
        // 提示线堆叠策略
        avoidLabelOverlap: false,
        // 圆饼图连接处样式
        itemStyle: {
          borderRadius: 20,
          borderColor: '#fff',
          borderWidth: 5
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            // fontSize: 40,
            // fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: salaryData.map(item => ({
          value: item.g_count + item.b_count,
          name: item.label
        }))
      }
    ],
    color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a']

  };
  // 调用配置项
  myChart.setOption(option)
}

// 渲染 班级每组薪资
function renderGroupData(groupData) {
  // console.log(groupData);
  // console.log(groupData[1]);
  // 初始化实例对象
  const myChart = echarts.init(document.querySelector('#lines'))
  // 配置项
  const option = {
    tooltip: {},
    xAxis: {
      type: 'category',
      axisLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#999'
      },
      data: groupData[1].map(item => item.name)
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#ccc'
        }
      }
    },
    series: [
      {
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: groupData[1].map(item => item.hope_salary),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#34D39A' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(52,211,154,.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      },
      {
        data: groupData[1].map(item => item.salary),
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: '#499fee' // 0% 处的颜色
            }, {
              offset: 1, color: 'rgba(73,159,238,.2)' // 100% 处的颜色
            }],
            global: false // 缺省为 false
          }
        }
      }
    ]
  };
  // 调用配置项
  myChart.setOption(option)

  // 切换数据  id="id="btns""
  document.querySelector('#btns').addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      document.querySelector('#btns').querySelector('.btn-blue').classList.remove('btn-blue')
      e.target.classList.add('btn-blue')
      const i = e.target.innerHTML
      option.xAxis.data = groupData[i].map(item => item.name)
      option.series[0].data = groupData[i].map(item => item.hope_salary)
      option.series[1].data = groupData[i].map(item => item.salary)
      // 重新渲染
      myChart.setOption(option)
    }
  })
}

// 渲染 男女薪资分布
function renderFnbu(fnbu) {
  const myChart = echarts.init(document.querySelector('#gender'))
  const option = {
    title: [{
      text: '男女薪资分布',
      textStyle: { fontSize: 16 },
      top: 10,
      left: 7
    },
    {
      text: '男生',
      textStyle: { fontSize: 14 },
      top: '45%',
      left: '45%'
    },
    {
      text: '女生',
      textStyle: { fontSize: 14 },
      top: '85%',
      left: '45%'
    }],
    tooltip: {},
    series: [
      {
        name: '男生',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '30%'],
        // roseType: 'area',//根据数据显示饼图大小
        // itemStyle: {
        //   borderRadius: 8
        // },//边框圆角
        // data: [
        //   { value: 40, name: 'rose 1' },
        //   { value: 33, name: 'rose 2' },
        //   { value: 28, name: 'rose 3' },
        //   { value: 22, name: 'rose 4' },
        // ]
        data: fnbu.map(item => ({ value: item.b_count, name: item.label }))
      },
      {
        name: '女生',
        type: 'pie',
        radius: ['20%', '30%'],
        center: ['50%', '70%'],
        data: fnbu.map(item => ({ value: item.g_count, name: item.label }))
      }
    ],
    color: ['#fda224', '#5097ff', '#3abcfa', '#34d39a']
  };
  myChart.setOption(option)
}