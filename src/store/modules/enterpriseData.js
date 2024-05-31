// 这是首页点击后跳转至crm管理里面页面并打开里面的跟随
const state = {
    dataId:''
}
const mutations ={
    TRANSMIT_Id:(state,tpID)=>{ 

        state.dataId = tpID
        console.log(  state.dataId,'中间参数');
        
    }
}
export default {
 
  state,
  mutations,
 
};
