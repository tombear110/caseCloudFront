/**
 * @Author: tombear
 * @Date:   2018-05-30 14:55:22
 */

//判断对象是否为空,
//为空返回true
export function judgeObject (obj) {
    return Object.keys(obj).length ===0
}

//防抖函数
// export function debounce(fn, delay=1500) {
//     // 维护一个 timer
//     let timer = null;
//     return function() {
//         // 通过 ‘this’ 和 ‘arguments’ 获取函数的作用域和变量
//         let context = this;
//         let args = arguments;
//         clearTimeout(timer);
//         timer = setTimeout(function() {
//             fn.apply(context, args);
//         }, delay);
//     }
// }

export function debounce (fn, delay=1500) {
    let last = 0
    return(...args) => {
        clearTimeout(last)
        last = setTimeout(() => {
            fn.call(this, args)
        }, delay)
    }
}

export function throttle(func, interval = 1500) {

    let timer;
    return function () {
        const that = this,
            args = arguments;

        if (timer) {
            return false;
        }

        timer = setTimeout(function () {
            func.apply(that, args);
            clearTimeout(timer);
            timer = null;
        }, interval);
    }
}


/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
function dataType(obj){
    if (obj===null) return "Null";
    if (obj===undefined) return "Undefined";
    return Object.prototype.toString.call(obj).slice(8,-1);
};

/**
 * 处理对象参数值，去除对象参数值为”“、null、undefined，不改变原对象，并返回一个新对象
 **/
export function dealObjectValue(obj){
    let param = {};
    if ( obj === null || obj === undefined || obj === "" ) return param;
    for ( let key in obj ){
        if ( dataType(obj[key]) === "Object" ){
            param[key] = dealObjectValue(obj[key]);
        }else if(  obj[key] !== null && obj[key] !== undefined && obj[key] !== ""  ){
            param[key] = obj[key];
        }
    }
    return param;
};

/**
 * 渲染表单时进行过滤,将data值传递给form
 * @params: data,form
 * @return: filtered form
 */
export function filterFormData(data,form){
    for (let i in data) {
        for (let j in form){
            if (i === j){
                if (data[i] === null || data[i] === undefined || data[i] === false){
                    form[j] = ''
                }else {
                    form[j] = data[i]
                }
            }
        }
    }
    return form;
};

/**
 * 对比两组数组是否相同
 * @params: data,form
 * @return: 相同-true 不相同-false
 */
export function compareFormData(o1, o2){
    //标识是否相似
    let flag = true;
    let traverse = function(o1,o2){
        //如果至少有一个不是对象
        if(!(o1 instanceof Object) || !(o2 instanceof Object)){
            if(o1 !== o2){
                flag = false;
            }
            return;
        }
        //如果两个对象的属性数量不一致
        //比如：
        //a:{name:"Jack",age:22}
        //b:{name:"Jack"}
        if(Object.keys(o1).length !== Object.keys(o2).length){
            flag = false;
        }
        //若有不同之处，尽早结束递归
        if(flag){
            //深度遍历对象
            for(let i in o1){
                //若都是对象，继续递归
                if(typeof o1[i] === "object" && typeof o2[i] === "object"){
                    traverse(o1[i],o2[i]);
                }//若都不是对象，则比较值
                else if(typeof o1[i] !== "object" && typeof o2[i] !== "object"){
                    if(o1[i] !== o2[i]){
                        flag = false;;
                    }
                }//一个是对象，一个不是对象，肯定不相似
                else{
                    flag = false;
                }
            }
        }
    };
    traverse(o1,o2);
    return flag;
};

