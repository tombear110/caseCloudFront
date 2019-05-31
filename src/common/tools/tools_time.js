/**
 * @file: tools_time.
 * @intro: 时间处理.
 * @author: chrisechen.
 * @email: penggoodlu521@163.com.
 * @Date: 2019/4/3 10:36.
 * @Copyright(©) 2019 by chrisechen.
 *
 */

export default new class Time {
  constructor() {
  }

  //获取今天的年月日  YYYY-mm-dd
  getToday() {
    let dd = new Date();
    let y = dd.getFullYear();
    let m = dd.getMonth()+1;//获取当前月份的日期
    let d = dd.getDate();
    let date =  y+"-"+m+"-"+d;
    return date;
  }

  //获取明天的年月日  YYYY-mm-dd
  getTomorrow() {
    let dd = new Date();
    dd.setDate(dd.getDate() + 1);//明天
    let y = dd.getFullYear();
    let m = dd.getMonth()+1;//获取当前月份的日期
    let d = dd.getDate();
    let date =  y+"-"+m+"-"+d;
    return date;
  }

  //获取现在的时间戳
  getNowTime() {
    let time = new Date().getTime();
    return time;
  }

  //获取制定日期的时间戳
  getDateTime(val) {
    let time = new Date(val);
    return time;
  }
}
