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
  // 渲染数据
  // 渲染overview
  renderOverview(res.data.overview)
  // 渲染  id="line"
  renderLine(res.data.year)
}
getData()

// 渲染 overview
function renderOverview(overview) {
  // 渲染页面  overview的键 和 需要渲染的地方的类名一致
  Object.keys(overview).forEach(item => {
    document.querySelector(`.${item}`).innerHTML = overview[item]
  });
}

// 渲染 line   id="line"
function renderLine(year) {
  // console.log(year);
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.querySelector('#line'));
  // 指定图表的配置项和数据
  option = {
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