/* 
    本模块实现将对象在localStorage中存储，取出，删除
    安装store库 yarn add store
    引入 store库
*/
import store from 'store'

export function saveUser(user){
    // localStorage.setItem('USER-KEY',JSON.stringify(user))
    store.set('USER-KEY',user)
}

export function getUser(){
    // return JSON.parse(localStorage.getItem('USER-KEY') || '{}')
    return store.get('USER-KEY') || {}
}

export function removeUser(){
    store.remove('USER-KEY')
}