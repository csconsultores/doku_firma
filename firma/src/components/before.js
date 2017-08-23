import React from 'react' 
//import { bin2hex } from '../js/btohex.js'
import Firma from './firma.js'

class Before extends React.Component{
    constructor(){
        super();
        this.state={ 
            archivos:[],
            contenidoArchivos:[]
        };
        this.handleFuncion=this.handleFuncion.bind(this);
    }
    handleFuncion(firmados){        
        var result = firmados.map(function(x) {
        alert(x.antes);
        alert(x.despues);
        });
    }
    render() {
		return (
            <div>
            <div>holaContenido</div>
            <button onClick={this.handleFuncion}>Botón</button>
            <Firma archivo="Hola Contenido" funcionLlama={this.handleFuncion}/>
            </div>
        )
    }
}

export default Before