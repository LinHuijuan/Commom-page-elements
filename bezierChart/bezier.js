/**
 * canvas canvas的dom对象
 * origin 坐标原点 {x,y}
 * ?bezierNodesArr 控制点数组，包含x，y坐标 [{x:0, y:0}]
 * ?strokeColor 曲线颜色
 */
class Bezier {
  constructor(canvas, orign, bezierNodesArr = [], strokeColor = 'yellow', fillColor = 'blue') {
    this.canvas = canvas
    this.orign = orign
    this.bezierNodesArr = bezierNodesArr
    this.ctx = this.canvas.getContext('2d')
    this.ctx.strokeStyle = strokeColor
    this.ctx.fillStyle = fillColor
    this.bezierArr = [] // 坐标点
  }

  // 通过贝塞尔公式获取含t的坐标值
  // t -> [0, 1]
  getBezier(t) {
    let x = 0,
      y = 0
    let n = this.bezierNodesArr.length - 1 // 起始点和控制点的总数
    this.bezierNodesArr.forEach((item, index) => {
      x += this.getCombinationNum(n, index) * item.x * Math.pow(1 - t, n - index) * Math.pow(t, index)
      y += this.getCombinationNum(n, index) * item.y* Math.pow(1 - t, n - index) * Math.pow(t, index)
    });

    return {
      x,
      y
    }
  }

  // 获取坐标点，避免浮点渲染好丑
  getBezierArr() {
    for (let t = 0; t <= 1; t += 0.01) {
      let tmp = this.getBezier(t)
      this.bezierArr.push({
        x: tmp.x | 0,
        y: tmp.y
      })
    }
    return this.bezierArr
  }

  // 组合公式
  getCombinationNum(n, i) {
    return this.factorial(n) / this.factorial(n - i) / this.factorial(i)
  }

  // 阶乘公式
  factorial(n) {
    let res = 1
    while (n) {
      res *= n
      n--
    }
    return res
  }

  draw() {
    let start, end
    switch (this.bezierNodesArr.length) {
      case 0:
        console.log('缺少起始点')
        break
      case 1:
        console.log('缺少结束点')
        break
      case 2: // 一阶贝塞尔曲线，原生画
        start = this.bezierNodesArr[0]
        end = this.bezierNodesArr[1]
        this.ctx.moveTo(start.x, start.y)
        this.ctx.lintTo(end.x, end.y)
        this.ctx.stroke()
        break
      case 3: // 二阶
        let ctrl
        start = this.bezierNodesArr[0]
        ctrl = this.bezierNodesArr[1]
        end = this.bezierNodesArr[2]
        this.ctx.beginPath()
        this.ctx.moveTo(start.x, start.y)
        this.ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y)
        this.ctx.stroke()
        break
      case 4: // 三阶
        let ctrl1, ctrl2
        start = this.bezierNodesArr[0]
        ctrl1 = this.bezierNodesArr[1]
        ctrl2 = this.bezierNodesArr[2]
        end = this.bezierNodesArr[3]
        this.ctx.beginPath()
        this.ctx.moveTo(start.x, start.y)
        this.ctx.bezierCurveTo(ctrl1.x, ctrl1.y, ctrl2.x, ctrl2.y, end.x, end.y)
        this.ctx.stroke()
        break
      default: // 高阶
        this.getBezierArr()
        start = this.orign
        this.ctx.beginPath()
        this.ctx.moveTo(start.x, start.y)
        let _this = this
        this.bezierArr.forEach(item => {
          _this.ctx.lineTo(item.x, item.y)
        })
        this.ctx.fill()
        break
    }
  }
}