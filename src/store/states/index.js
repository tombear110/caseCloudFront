import { cookieStorage, localStorage, sessionStorage } from 'common/storage'

export default {
    //用户信息和是否登录
    user_info: cookieStorage.get('user_info'),

    v_info: cookieStorage.get('v_info'),

    edit_data: {},

    case_data: { isChange: false },

    tab_info: localStorage.get('tab_info'),

    search_data: { search: {}, select: {}, table: {} },

    notify_info: localStorage.get('notify_info'),

    theme_info: localStorage.get('theme_info'),

    //存储area,anyou 两组数据
    case_info: localStorage.get('case_info'),

    //存储 用户在日历（team-week,team-day)中，选中的同事[]
    team_husers: localStorage.get('team_husers'),

    current_nav: localStorage.get('current_nav'),

    update_change: null,
    update_click: null,
    wxInfo: {},
    bindWxgz: localStorage.get('bind_wxgz')
}
