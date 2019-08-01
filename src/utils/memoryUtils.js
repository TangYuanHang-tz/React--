/* 
    在内存中保存某些数据
*/

export default {
    user:{}   //直接暴露一个对象，对下中的属性user，值为对象，坏处：外部能够看见user的细节
}


/* let myUser
export default {
    //同样是暴露一个对象，但是是通过对象方法来操作user，外部无法看见user的具体细节，更为安全
    saveUser(user){
        myUser = user
    },

    getUser(){
        return myUser
    }
} */