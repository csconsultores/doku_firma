//store/index.js  storeFactory

import C from '../constants'
import appReducer from '../reducers'
import { createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'

const consoleMessage=store => next => action => {
    let result

    console.groupCollapsed(`dipatching action => ${action.type}`)
    console.log('cert', store.getState().cert.length)
    result = next(action)
    let { cert, rfc, certContenido, key, keyContenido, contrasenia, verificado, contenidos} = store.getState()

    console.log(`
        cert: ${cert}
        rfc: ${rfc}
        certContenido: ${certContenido}
        key: ${key}
        keyContenido: ${keyContenido}
        contrasenia: ${contrasenia}
        verificado: ${verificado}
        contenidos: ${contenidos}
        `)
    
    console.groupEnd()
    return result
}
//Inicializa los reducers, al estar suscrito muestra los mensajes del consoleMessage y crea el Store
export default (initialState={}) =>{
    return applyMiddleware(consoleMessage)(createStore)(appReducer, initialState)
}