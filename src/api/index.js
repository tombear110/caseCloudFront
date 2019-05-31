/**
 * api请求索引
 * @Author: tm
 * @Date:   2017-07-28 16:51:05
 * @Email:  tianming2015@foxmail.com
 * @Last modified by:   tm
 * @Last modified time: 2017-08-02 13:57:57
 */



//导入模块
import * as api_file from './file'
import * as api_user from './user'
import * as api_team from './team'
import * as api_case from './case'
import * as api_project from './project'
import * as api_record from './record'
import * as api_help from './help'
import * as api_home from './home'
import * as api_client from './client'
import * as api_linkman from './linkman'
import * as api_contract from './contract'
import * as api_invoice from './invoice'
import * as api_batch from './batch'
import * as api_court from './court'
import * as api_expand from './expand'
import * as api_firm from './firm'
import * as api_invitation from './invitation'
import * as api_auditor from './auditor'
import * as api_lawcase from './law-case'
import * as api_apprval from './law-apprval'
import * as api_lawdoc from './law-doc'
import * as api_lawprivyc from './law-privyc'
import * as api_receivables from './receivables'
import * as api_trial from './trial'
import * as api_execution from './execution'
import * as api_property from './property'
import * as api_judge from './judge'
import * as api_privyc from './privyc'
import * as api_stage from './stage'
import * as api_analysis from './analysis'
import * as api_order from './order'
import * as api_strategy from './strategy'
import * as api_safe from './safe'
import * as api_report from './report'
const apiObj = {
    api_file,
    api_user,
    api_team,
    api_case,
    api_project,
    api_record,
    api_help,
    api_home,
    api_client,
    api_linkman,
    api_contract,
    api_invoice,
    api_batch,
    api_court,
    api_expand,
    api_firm,
    api_invitation,
    api_auditor,
    api_lawcase,
    api_apprval,
    api_lawdoc,
    api_lawprivyc,
    api_receivables,
    api_trial,
    api_execution,
    api_property,
    api_judge,
    api_privyc,
    api_stage,
    api_analysis,
    api_order,
    api_strategy,
    api_safe,
    api_report
}

const install = function(Vue) {
    if (install.installed) return
    install.installed = true

    //定义属性到Vue原型中
    Object.defineProperties(Vue.prototype, {
        $fetch: {
            get() {
                return apiObj
            }
        }
    })
}

export default {
    install
}
