
import * as type from 'store/mutations/type'
import {cookieStorage} from 'common/storage'
import {localStorage,sessionStorage} from 'common/storage'

export default {
  //设置用户信息和是否登录
  [type.SET_USER_INFO](state, userInfo){
    state.user_info = userInfo || {}
    if (userInfo) {
        cookieStorage.set('user_info', userInfo,{expires:userInfo.expires})
    }else {
        cookieStorage.remove('user_info')
        localStorage.remove('notify_info')
        // localStorage.remove('case_info')
        localStorage.remove('team_husers')
    }
  },
    //用户的v_info续费信息
    [type.SET_V_INFO](state, vInfo){

        state.v_info = vInfo || {}
        if (vInfo) {
            cookieStorage.set('v_info', vInfo,{expires:30})
        }else {
            cookieStorage.remove('v_info')
        }
    },
    //设置编辑数据
    [type.SET_EDIT_DATA](state, setEditData){
        state.edit_data = setEditData || {}
    },
    //设置案件详情数据
    [type.SET_CASE_DATA](state, setCaseData){
        state.case_data = setCaseData || {}
    },
    //
    [type.SET_TAB_INFO](state, setTabInfo){
        state.tab_info = setTabInfo || {}
        localStorage.set('tab_info')
    },
    [type.SET_SEARCH_DATA](state, setSearchData){
        state.search_data = setSearchData || {}
    },
    //登录时获取通知消息，存储在本地，使用session
    [type.SET_NOTIFY_INFO](state, notifyInfo){
        state.notify_info = notifyInfo || {}
        if (notifyInfo === null) {
            localStorage.remove('notify_info')
            // localStorage.remove('user_info')
        } else {
            localStorage.set('notify_info', notifyInfo)
            // localStorage.set('user_info', userInfo)
        }
    },
    //存储主题信息
    [type.SET_THEME_INFO](state, themeInfo){
        state.theme_info = themeInfo || {}
        if (themeInfo === null) {
            localStorage.remove('theme_info')
        } else {
            localStorage.set('theme_info', themeInfo)
        }
    },

    [type.SET_CASE_INFO](state, caseInfo){
        state.case_info = caseInfo || {}
        if (caseInfo === null) {
            localStorage.remove('case_info')
        } else {
            localStorage.set('case_info', caseInfo)
        }
    },

    [type.SET_TEAM_HUSERS](state, teamHusers){
        state.team_husers = teamHusers || {}
        if (teamHusers === null) {
            localStorage.remove('team_husers')
        } else {
            localStorage.set('team_husers', teamHusers)
        }
    },

    [type.SET_CURRENT_NAV](state, currentNav){
        state.current_nav = currentNav || {}
        if (currentNav === null) {
            localStorage.remove('current_nav')
        } else {
            localStorage.set('current_nav', currentNav)
        }
    },

    [type.SET_UPDATE_CHANGE](state, updateChange){
        state.update_change = updateChange || null
    },

    [type.SET_UPDATE_CLICK](state, updateClick){
        state.update_click = updateClick || null
    },
    [type.SET_WXGZ](state, updateWxgz){
        state.bindWxgz = updateWxgz || false
        if (!updateWxgz) {
            localStorage.remove('bind_wxgz')
        } else {
            localStorage.set('bind_wxgz', updateWxgz)
        }
    },
}
