/**
 * 应收款记录
 * @params: mod
 * @return: 返回值/返回值说明
 */



import fetch from 'common/fetch'
//列表
export function list(params) {
    return fetch({
        url:`receivables`,
        method: 'get',
        params
    })
}
//创建表单
export function create() {
    return fetch({
        url:`receivables/create`,
        method:'get',
    })
}


//修改表单
export function save(data,id) {
    if (id){
        return fetch({
            url:`receivables/${id}`,
            method:'put',
            data
        })
    }else {
        return fetch({
            url:`receivables`,
            method:'post',
            data
        })
    }

}


//查看
export function detail(id) {
    return fetch({
        url:`receivables/${id}`,
        method:'get',

    })
}

//编辑表单
export function edit(id) {
    return fetch({
        url:`receivables/${id}/edit`,
        method:'get',
    })
}



//删除案件表单
export function deleted(id) {
    return fetch({
        url:`receivables/${id}`,
        method:'delete',
    })
}





