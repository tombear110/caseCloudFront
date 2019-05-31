/**
 * @file: tools_time.
 * @intro: 通知.
 * @author: chrisechen.
 * @email: penggoodlu521@163.com.
 * @Date: 2019/4/3 10:40.
 * @Copyright(©) 2019 by chrisechen.
 *
 */
import {msgList} from '../../api/home.js'
import { img_url } from '../config/index.js'
import userImg from '../../assets/images/user.png'
export default new class Time {
  constructor() {
  }

  //判断是否开启通知
  checkNotify() {
    const permission = Notification.permission;
    if(permission === 'granted'){
      console.log('已经授权通知，可以进行你的通知啦！');
    }else{
      console.log('用户还未授权，请先授权！');
    }
  }

  //开启通知
  openNotify() {
    Notification.requestPermission(function (permission) {
      if (permission == "granted") {
        var n = new Notification("您有一条新的消息", {  
            dir: "auto",
            lang: "zh-CN",
            icon:'/static/images/new-logo.png'
        })
        n.onshow = function () {
            console.log('通知显示了！');
        }
        n.onclick = function (e) {
            console.log('点击了')
            n.close();
        }
      }
    });
  }

  getNotifyMsg() {
    let notifyData = []
    msgList({ noRead: 0 }).then( ({data}) => {
      notifyData = data.msg.data
      this.notify(notifyData)
    });
  }

  webNotify(notifyData) {
    const NotificationInstance = Notification || window.Notification;
    let headUrl;
    if (notifyData.user_avatar) {
      if (notifyData.user_avatar.indexOf('http') < 0) {
        headUrl = img_url + notifyData.user_avatar
      } else {
        headUrl = notifyData.user_avatar
      }
    } else {
      headUrl = userImg
    }
    if (!!NotificationInstance) {
        const permissionNow = NotificationInstance.permission;
        if (permissionNow === 'granted') {//允许通知
            CreatNotification();
        } else if (permissionNow === 'denied') {
        } else {
            setPermission();
        }
        function setPermission(){
          //请求获取通知权限
          NotificationInstance.requestPermission(function (PERMISSION) {
            if (PERMISSION === 'granted') {
              CreatNotification();
            } else {
            }
          });
        }
        function CreatNotification() {
            const n = new NotificationInstance(notifyData.add_uid_text + notifyData.action, {
                tag: (new Date()).getTime(),
                icon: headUrl,
                data: {
                    url: window.location.origin + '/calendar/my-month'
                }
            });
            n.onshow = function () {
            }
            n.onclick = function (e) {
                //可以直接通过实例的方式获取data内自定义的数据
                //也可以通过访问回调参数e来获取data的数据
                window.open(n.data.url, '_blank');
                n.close();
            }
            n.onclose = function () {
            }
            n.onerror = function (err) {
                throw err;
            }
            // setTimeout(() => {
            //     n.close();
            // }, 5000);
        }
    }
  }
}
