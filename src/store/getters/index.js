import * as type from 'store/getters/type'

export default {
    //获取用户信息
    [type.GET_USER_INFO]: state => {
        return state.user_info
    },
    //获取付费信息
    [type.GET_V_INFO]: state => {
        return state.v_info
    },
    //获取编辑数据
    [type.GET_EDIT_DATA]: state => {
        return state.edit_data
    },
    //获取编辑数据
    [type.GET_CASE_DATA]: state => {
        return state.case_data
    },
    //recordNav.vue使用
    [type.GET_TAB_INFO]: state => {
        return state.tab_info
    },
    // 获取消息通知
    [type.GET_NOTIFY_INFO]: state => {
        return state.notify_info
    },
    // 获取subNav的搜索数据
    [type.GET_SEARCH_DATA]: state => {
        return state.search_data
    },
    // 获取theme
    [type.GET_THEME_INFO]: state => {
        return state.theme_info
    },

    [type.GET_CASE_INFO]: state => {
        return state.case_info
    },

    [type.GET_TEAM_HUSERS]: state => {
        return state.team_husers
    },

    [type.GET_CURRENT_NAV]: state => {
        return state.current_nav
    },

}
