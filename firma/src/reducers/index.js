//reducers/index.js
//Genera el store a partir de lo que se le envíe
import C from '../constants'
import {combineReducers} from 'redux'
export const cert = (state="", action) => 
    (action.type === C.SET_CERT) ?
        action.payload :
        state

export const rfc = (state="", action) => 
    (action.type === C.SET_RFC) ?
        action.payload :   
        state
export const certContenido = (state="", action) => 
    (action.type === C.SET_CERT_CONTENIDO) ?
        action.payload :
        state

export const key = (state="", action) => 
    (action.type === C.SET_KEY) ?
        action.payload :
        state

export const keyContenido = (state="", action) => 
    (action.type === C.SET_KEY_CONTENIDO) ?
        action.payload :
        state

export const contrasenia = (state="", action) => 
    (action.type === C.SET_CONTRASENIA) ?
        action.payload :
        state

export const verificado = (state=false, action) => 
    (action.type === C.SET_VERIFICADO) ?
        action.payload :
        state

export const contenidos = (state=[], action) => 
    (action.type === C.ARCHIVOS_CONTENIDO) ?
        action.payload :
        state


export default combineReducers({
    cert,
    rfc,
    key,
    certContenido,
    keyContenido,
    contrasenia,
    verificado,
    contenidos
})

