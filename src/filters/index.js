/**
 * @User: tombear
 * @Email: tangte1@foxmail.com
 * @Date: 2018-11-01 14:15:38
 * @Description: 自定义全局过滤器
 *
 */

const vfilters = {

    /**
     * 将类型由数字转换成文字
     * @params: type 类型
     * @params: text1 text2 对应的文字
     * @return: type 对应的 text
     */
    formaterType (type, text1, text2) {
        return type === 1 ? text1 : text2
    }
}
export default vfilters
