const state = {
    dataType:{
        searchDeptId: undefined,
        searchDateType: 1,
        searchDate: "2023",
        searchEndDate:undefined,
        searchStartDate:undefined
    }
}
const mutations ={
    ADD_TIME_STATUS:(state,queryParams)=>{ 
        state.dataType = JSON.parse(JSON.stringify(queryParams))
        console.log( 'vuex', state.dataType,queryParams );
       
    }
}
export default {
 
  state,
  mutations,
 
};
