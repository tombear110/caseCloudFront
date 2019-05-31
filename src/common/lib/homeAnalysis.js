/**
 *  首页-统计分析-折线图-根据年份筛选对应的数据
 * @Email:  tianming2015@foxmail.com
 * @Last modified by:   tm
 * @Last modified time: 2017-08-02 11:08:41
 */


export function xAxisExchange (arr) {
    //将案件委托量的yAxis进行处理，输出到年份选择的options
    let yearArray = []
    for (let i = 0; i < arr.length; i++) {
        yearArray.push(parseInt(arr[i].split('-')[0]))
    }
    //数组去重，翻转排序
    //[2016,2016,2017,2017,2018] => [2018,2017,2016]
    let noDuplicateArray = [...new Set(yearArray)].sort().reverse()
    //将数组value作为key，vulue作为值转换成数组，对象
    //[2016,2017] => [{value:2016,label:2016},{value:2017,label:2017}]
    let objArray = []
    for (let i = 0; i < noDuplicateArray.length; i++) {
        objArray.push({ value: noDuplicateArray[i], label: noDuplicateArray[i] })
    }
    return objArray
}

export function prTimeExchange (obj, yearVal) {
    //年份折线图数据分析,传入当前使用的usePrtimeData（个人团队切换）， 当前选择的年份yearChange-val
    let [oldX, oldY] = [obj.xAxis_arr, obj.yAxis_arr]
    let newX = [], newY = [], xIndex = []
    for (let i = 0; i < oldX.length; i++) {
        if (oldX[i].indexOf(yearVal) !== -1) {
            newX.push(oldX[i])
            xIndex.push(i)
        }
    }
    for (let i = 0; i < xIndex.length; i++) {
        newY.push(oldY[xIndex[i]])
    }
    return { xAxis_arr: newX, yAxis_arr: newY }
}
