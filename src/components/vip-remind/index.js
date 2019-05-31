/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2019-04-02 16:52:47
 * @Description: index.js
 */


import component from './VipRemind'
export default {
    install (_Vue, options) {
        const constructor = _Vue.extend(component)
        const instance = new constructor()
        instance.$mount(document.createElement('div'))
        document.body.appendChild(instance.$el)
        _Vue.prototype.$vipRemind = ({textA, textB, bgWx}) => {
            instance.textA = textA;
            instance.textB = textB;
            instance.visible = true;
            instance.bgWx = bgWx;
            // instance.callback = callback //返回方法
        }
    }
}
