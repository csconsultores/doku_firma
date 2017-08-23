import React from 'react' 
import { bin2hex } from '../js/btohex.js'
import Dropzone from 'react-dropzone'
var Loader = require('react-loader');

class Archivos extends React.Component{
    constructor(){
        super();
        this.state={ 
            archivos:[],
            contenidoArchivos:[],
 			//loader
			loaded:false,
            profile:null,
            error:''         
        };
        this.cargaArchivos=this.cargaArchivos.bind(this);
        this.remove=this.remove.bind(this);
        this.onDrop=this.onDrop.bind(this);
        this.handleBoton=this.handleBoton.bind(this);
    }


    reorder(archivos1, contenido1){
        // En archivos obtengo el ID
        //var archivos1 = this.state.archivos;
        //indexo de nuevo
        var _uniqueId=0;
        // Obtengo el id de cada elemento del arreglo
        archivos1.forEach(function(element) {
            
            element.id=_uniqueId;
            element.name=element.name;
            //Al final para que empiece de cero
            _uniqueId++;
        });

        this.setState({archivos:archivos1, contenidoArchivos:contenido1});
    }

    remove(id){
        //alert("hola Remove");
        
        //borro el nombre y el id del seleccionado
        var archivos1 = this.state.archivos;
        archivos1.splice(id, 1);
        //borro el contenido 
        var contenido1=this.state.contenidoArchivos;       
        contenido1.splice(id, 1);
        // obtengo el id de cada elemento
        this.reorder(archivos1, contenido1);      
    }

    cargaArchivos(files){
        //Carga contenido de los archivos
        this.setState({error:''});
        var contenido;
        for (var i = 0; i < files.length; i++) {
            //var fileInfo = "<p>File name: " + files[i].name + "; size: " + files[i].size + "; type: " + files[i].type + "</p>";
            this.add(files[i].name); 
            let file = files[i];
                
            let reader = new FileReader();  
            reader.onloadend = () => {  
                // get file content  
                var text = reader.result; 
                //contenido = bin2hex(text);
                contenido=text;
                this.setState({
                    contenidoArchivos: this.state.contenidoArchivos.concat(contenido)
                });               
            }
            reader.readAsBinaryString(file);         
        }
    }

    onFileChanged(theEvt)  {
        //Boton para carga masiva de archivos
        var files = theEvt.target.files;
        this.cargaArchivos(files);
    }
    onDrop(files){
        //Librería con widget de carga de archivos
        this.cargaArchivos(files);
    }
    add(nombreArchivo){  
        var largo=this.state.archivos.length; 
        var archivo2=new Array;

        archivo2=this.state.archivos;
        archivo2.push({id:largo, name:nombreArchivo});  
        this.setState({archivos:archivo2});
    }
    handleBoton(){
        //Envío datos al papá		
        if (this.state.contenidoArchivos.length == 0){
			this.setState({error:"Es necesario seleccionar archivos"});			
			return false;
		}

        this.props.action(this.state.contenidoArchivos);
        this.setState({archivos:[],
        contenidoArchivos:[]});
        $('#myModal').modal('hide');
    }
    render(){
        return(
            <div>
                {this.state.error.length > 0 ? <div className="alert alert-danger"> {this.state.error}</div> : null  }	
                <section>
                    <div>
                        <Dropzone className="dropzone" onDrop={this.onDrop.bind(this)}>
                            <h4 className="archivos_header">Arrastra los archivos</h4>
                            <h4 className="archivos_header"> o </h4>
                            <h4 className="archivos_header">Da un click en este cuadro</h4>
                        </Dropzone>
                    </div>
 
                </section>
                {this.state.archivos.map(archivo => {
                    return <div className="archivo_muestro" id="archivo_muestro"><div className="row"><div className="col-sm-1"><img src="archivo.png" /> </div><div className="archivo_id" id={archivo.id} style={{display:'none'}}>{archivo.id}</div><div className="col-sm-8">{archivo.name} </div><div className="col-sm-3"><button className="thumb_up" type="button" onClick={() => this.remove(archivo.id)}></button></div></div></div>;        
                    }
                )}   
                <div className="botonesArchivos">     
                    <button type="button" className="btn btn-primary" onClick={this.handleBoton} >Firmar</button> &nbsp;
                    <button type="button" className="btn btn-primary" data-dismiss="modal" id="cerrarModal">Cerrar</button> 
                </div>
         
            </div>
        );
    }
}

export default Archivos