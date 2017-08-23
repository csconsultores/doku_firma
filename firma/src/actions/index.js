//actions/index.js
import C from '../constants'

export function setCERT(cert){
    // Add app logic here...
    return{
        type:C.SET_CERT,
        payload: cert
    }
}

export function setRFC(rfc){
    // Add app logic here...
    return{
        type:C.SET_RFC,
        payload: rfc
    }
}
export function setCERTCONTENIDO(certContenido){
    // Add app logic here...
    return{
        type:C.SET_CERT_CONTENIDO,
        payload: certContenido
    }
}
export function setKEY(key){
    // Add app logic here...
    return{
        type:C.SET_KEY,
        payload: key
    }
}


export function setKEYCONTENIDO(key){
    // Add app logic here...
    return{
        type:C.SET_KEY_CONTENIDO,
        payload: key
    }
}
export function setCONTRASENIA(contrasenia){
    // Add app logic here...
    return{
        type:C.SET_CONTRASENIA,
        payload: contrasenia
    }
}
export function setVERIFICADO(verificado){
    // Add app logic here...
    return{
        type:C.SET_VERIFICADO,
        payload: verificado
    }
}

export function archivosCONTENIDO(archivosContenido){
    // Add app logic here...
    return{
        type:C.ARCHIVOS_CONTENIDO,
        payload: archivosContenido
    }
}


