

import * as actions from 'store/actions/type'
import * as mutations from 'store/mutations/type'

export default {
    //设置用户信息和登录
    [actions.SET_USER_INFO]({commit}, userInfo) {
        commit(mutations.SET_USER_INFO, userInfo)
    },
    //设置付费信息
    [actions.SET_V_INFO]({commit}, vInfo) {
        commit(mutations.SET_V_INFO, vInfo)
    },
    [actions.SET_EDIT_DATA]({commit}, setEditData) {
        commit(mutations.SET_EDIT_DATA, setEditData)
    },
    [actions.SET_CASE_DATA]({commit}, setCaseData) {
        commit(mutations.SET_CASE_DATA, setCaseData)
    },
    [actions.SET_TAB_INFO]({commit}, setTabInfo) {
        commit(mutations.SET_TAB_INFO, setTabInfo)
    },
    //设置通知消息
    [actions.SET_NOTIFY_INFO]({commit}, notifyInfo) {
        commit(mutations.SET_NOTIFY_INFO, notifyInfo)
    },
    //设置通知消息
    [actions.SET_SEARCH_DATA]({commit}, setSearchData) {
        commit(mutations.SET_SEARCH_DATA, setSearchData)
    },

    [actions.SET_THEME_INFO]({commit}, setThemeInfo) {
        commit(mutations.SET_THEME_INFO, setThemeInfo)
    },

    [actions.SET_CASE_INFO]({commit}, setCaseInfo) {
        commit(mutations.SET_CASE_INFO, setCaseInfo)
    },

    [actions.SET_TEAM_HUSERS]({commit}, setTeamHusers) {
        commit(mutations.SET_TEAM_HUSERS, setTeamHusers)
    },

    [actions.SET_CURRENT_NAV]({commit}, setCurrentNav) {
        commit(mutations.SET_CURRENT_NAV, setCurrentNav)
    },

}
