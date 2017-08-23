// Components/firma
import React from 'react'
import { bin2hex } from '../js/btohex.js'
import Archivos from './archivos.js'
import Script from 'react-load-script'
import {setCERT, setRFC, setKEY, setCERTCONTENIDO, setKEYCONTENIDO, setCONTRASENIA, setVERIFICADO, archivos, archivosCONTENIDO, archivosFIRMADOS} from '../actions'
var Loader = require('react-loader');

class Firma extends React.Component {	
	init(){		
	   var bHaveFileAPI = (window.File && window.FileReader);
		if (!bHaveFileAPI) {
			alert("Este browser no soporta la carga de archivos");
			return;
		}   
		

	} 

	constructor() {	
		super();
		this.state = {
			cert:'',
			rfc:'',
			clave:'',
			certContenido:'',
			claveContenido:'',
			contrasenia:'',
			verificado: 0,
			mostrarFirma:0,
			//loader
			loaded:true,
			profile:null,
			error:'',
			archivos:[]
		};

		//CERTIFICADO
		this.handleChangeCert=this.handleChangeCert.bind(this);
		this.messageCert={value:''};
		this.loaded=true;
		//CLAVE
		this.handleChangeClave=this.handleChangeClave.bind(this);
		this.messageClave={value:''};
		this.verifica={value:''};
		this.handleChangePass=this.handleChangePass.bind(this);
		this.handleClickVerifica=this.handleClickVerifica.bind(this); 
		this.handlerFirma=this.handlerFirma.bind(this);  
		this.handlerConArchivo=this.handlerConArchivo.bind(this);  
		this.valida=this.valida.bind(this);
	}

	handleChangeCert(event){  
		//Leo el certificado
		this.messageCert.value="";
		var thefile = event.target.files[0];
		var contenido="";
		var rfc;
		// Como solo muestro los archivos cer tal vez no aplica pero se queda.
		if (thefile.type !=='application/x-x509-ca-cert'){
			this.messageCert.value="El archivo debe ser un certificado, por favor revise.";
			 return{}
		}     
		//quito botones de "Agregar" y "Firmar"
		// Se obtiene el nombre del archivo.
		this.setState({
			verificado: false, 
			mostrarFirma: false,
			cert: thefile.name
		});
		store.dispatch(
			setCERT(thefile.name)
		)
  		let reader = new FileReader();
    	let file = thefile;
    	// Cargo certificado
      	reader.onloadend = () => {
      		var text = reader.result;
			//contenido = binStringToHex1(text);
			contenido = bin2hex(text);
			//Obtengo RFC
			rfc= window.JSDEDGECERTUTIL(contenido);

            this.setState({  
            	rfc: rfc,  			
                certContenido: contenido
			});
			store.dispatch(
				setRFC(rfc)
			)
			store.dispatch(
				setCERTCONTENIDO(contenido)
			)
        } 
        reader.readAsBinaryString(file);	
	}

	handleChangeClave(event){
		//Leo clave
		//quito botones de "Agregar" y "Firmar"		
		this.messageClave.value="";
		var thefile = event.target.files[0];
		var contenido;
		var name=thefile.name;

		if (thefile.name.substring(thefile.name.length-3)!=='key'){
			this.messageClave.value="El archivo debe ser la clave privada, por favor revise.";
			 return{}
		}		//quito botones de "Agregar" y "Firmar"
		// Se obtiene el nombre del archivo.
		this.setState({
			verificado: false, 
			mostrarFirma: false,
			clave: name
		});		
		store.dispatch(
			setKEY(name)
		)
  		let reader = new FileReader();
    	let file = thefile;
    	//Cargo Clave
      	reader.onloadend = () => {
      		var text = reader.result;
			contenido = bin2hex(text);
            this.setState({  
                claveContenido: contenido
			});
			store.dispatch(
				setKEYCONTENIDO(contenido)
			)
        } 
        reader.readAsBinaryString(file);	
	}
	handleChangePass(event){ 
		//quito botones de "Agregar" y "Firmar"
		// Se obtiene la captura de la contraseña.
		this.setState({
			verificado: false, 
			mostrarFirma: false,
			contrasenia:event.target.value
		});
		store.dispatch(
			setCONTRASENIA(event.target.value)
		)		
	}

	handleClickVerifica(event){
		//Verifico los datos ingresados por el usuario
		try{
			var verifica=window.verificaParidad(this.state.certContenido, this.state.claveContenido, this.state.contrasenia);
			if (verifica==1){
				//Si los datos son correctos muestro los botones de Agregar y Firmar
				this.setState({verificado: true});
				this.setState({mostrarFirma: 1});
				this.setState({error: ''});
			} 
			else {
				this.setState({error: "Existió un error en los datos, verifíque"});
			}
		} 
		catch(error){ 
			this.setState({error: "Existió un error en los datos, verifíque"});
		};
	}

	valida(contenido){
		if (contenido.length == 0){
			this.setState({error:"Es necesario seleccionar archivos"});
			
			return false;
		}

		//Reviso que no hayan modificado el documento
		if (this.state.verificado === false){
			this.setState({error:"Los datos deben ser verificados"});
			
			return false;
		}
		
		return(true)
	}

	firma(contenidos, cert_content, pkey_content, pwd_key, callback){
		
		var firmados = new Array();	
		var documento, firmado;
		var bSTH;
		contenidos.forEach(function(info, index){
			bSTH = bin2hex(info);
				try{
					firmado=window.generaCMS(cert_content, pkey_content, pwd_key, bSTH);
					documento = {
						"id" : index + 1,
						"antes" : info,
						"despues" : firmado
					};  
					firmados.push(documento);  
					
					}catch(error){
					alert(error)
				}  
				
				console.log(index + ". " + info); 
			
		});
		callback (firmados);
		
	}
	
	handlerFirma(contenido){

		if (!this.valida(contenido)){
			return false
		}
		
		this.setState({loaded:false});
		var firmados1 = new Array();
		var cert_content=this.state.certContenido;
		var pkey_content=this.state.claveContenido;
		var pwd_key=this.state.contrasenia;

		//Obtengo los datos
        setTimeout(function() {
        	this.firma(contenido, cert_content, pkey_content, pwd_key, function(firmados) {
				firmados1=firmados
			});
	
			this.setState({archivos:firmados1});
			store.dispatch(
				archivosCONTENIDO(firmados1)
			)
			//apago el timer
			this.setState({loaded:true});	
			//Envío info de que los documentos ya fueron firmados
			this.props.funcionLlama ? this.props.funcionLlama(firmados1) : null;
			window.doc.length > 0 ? window.regresa(firmados1): null
		}.bind(this), 1);

	
		return (firmados1);
	}


	handlerConArchivo(){
		//Firmo el archivo previamente cargado
		var contenido;
		var firmados;
		var contentArray= new Array;

		// Lo mando a hexadecimal
		if (this.props.archivo){
			contenido = this.props.archivo;
		}
		else{
			contenido = window.doc;
		}
		
		//Como la función firmar espera un array lo envío al array
		contentArray.push(contenido);
		// Firmo el archivo
		firmados=this.handlerFirma(contentArray);
	}

	//Script load library
	handleScriptCreate() {
	  this.setState({ scriptLoaded: true })
	}
	 
	handleScriptError() {
	  this.setState({ scriptError: true })
	}
	 
	handleScriptLoad() {
	  this.setState({ scriptLoaded: true })
	}
	render() {
		return (
			<div>				
				<div>
					<Script url="js/js_functions.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/yahoo-min.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/jsrsasign-4.7.0/ext/jsbn.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/jsrsasign-4.7.0/ext/jsbn2.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	  
					<Script url="js/jsrsasign-4.7.0/ext/rsa.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/jsrsasign-4.7.0/ext/rsa2.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/jsrsasign-4.7.0/ext/base64.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	         
	 
					<Script url="js/CryptoJSv3.1.2/components/core.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/CryptoJSv3.1.2/components/md5.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/CryptoJSv3.1.2/components/sha1.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/CryptoJSv3.1.2/components/sha256.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	  
					<Script url="js/CryptoJSv3.1.2/components/ripemd160.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/CryptoJSv3.1.2/components/x64-core.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/CryptoJSv3.1.2/components/sha512.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	         
					<Script url="js/CryptoJSv3.1.2/components/pbkdf2.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/CryptoJSv3.1.2/components/hmac.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	  
					<Script url="js/CryptoJSv3.1.2/components/hmac-min.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/CryptoJSv3.1.2/components/tripledes.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/CryptoJSv3.1.2/components/aes.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	         


					<Script url="js/jsrsasign-4.7.0/asn1cms-1.0.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/jsrsasign-4.7.0/rsapem-1.1.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/jsrsasign-4.7.0/rsasign-1.2.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/jsrsasign-4.7.0/asn1hex-1.1.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	  
					<Script url="js/jsrsasign-4.7.0/x509-1.1.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/jsrsasign-4.7.0/crypto-1.1.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/jsrsasign-4.7.0/keyutil-1.0.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	         
					<Script url="js/jsrsasign-4.7.0/jsrsasign-latest-all-min.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					

					<Script url="js/btohex.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/crypto-converter.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/JsDedgeCrypto/jsCriptoAsimetrica.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					<Script url="js/JsDedgeCrypto/jsllavero.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	  
					<Script url="js/JsDedgeCrypto/JsDedgeUtil.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>	      		
					<Script url="js/JsDedgeCrypto/JsDedgeCMSProc.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
				   
					<Script url="js/JsDedgeCrypto/jsDedgeCertUtil.js" onCreate={this.handleScriptCreate.bind(this)} onError={this.handleScriptError.bind(this)} onLoad={this.handleScriptLoad.bind(this)}/>
					
				</div>

				<div className="container">
					<form className="form-horizontal">
						<img src='data:image/png;base64,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' />
						<div className="row text-center"><h2 className="prueba">Firma Electrónica Avanzada</h2></div>	  		
						<div className="row text-center"><h4>Firmado FIEL</h4></div>
						
						<div className="row">
						<div className="col-sm-4 col-sm-offset-4">
							{this.state.verificado ? <div className="alert alert-success"> Información Verificada</div> : null  }							
							{this.state.archivos.length > 0 ? <div className="alert alert-success"> Archivos Firmados</div> : null  }													
							{this.state.error.length > 0 ? <div className="alert alert-danger"> Existio un error, verifique sus datos</div> : null  }		
						</div>
						<div className="col-sm-4">
						</div>
						</div>
						<div className="row">
						<div className="form-group">
							<div className="col-sm-4"><label className="control-label col-sm-11" htmlFor="certificado">Certificado:</label></div>
							<div className="col-sm-6"><input type="text" className="form-control" id="cert" placeholder="Certificado" name="certificado" value={this.state.cert} />							
							
								{this.messageCert.value!== "" ? <div className="alert"><span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>{this.messageCert.value}</div> : null  }
								
							<div id="cert_content" style={{display:'none'}}></div>
							</div>
							<div className="col-sm-2">				
								<label className="btn btn-primary" htmlFor="certbutton">			
								<input id="certbutton" type="file" onChange={this.handleChangeCert} style={{display:'none'}} accept=".cer"/>
								Buscar
								</label>
							</div>
						</div>
						</div>

						<div className="row">
							<div className="form-group">
								<div className="col-sm-4"><label className="control-label col-sm-11" htmlFor="rfc">RFC</label></div>
								<div className="col-sm-6"><input type="text" className="form-control" id="rfc" placeholder="RFC" name="rfc" id="rfc" value={this.state.rfc}/></div>
								<div className="col-sm-2"></div>
							</div>
						</div>

						<div className="row">
						<div className="form-group">
							<div className="col-sm-4"><label className="control-label col-sm-11" htmlFor="clavePrivada">Clave Privada:</label></div>
							<div className="col-sm-6"><input type="text" className="form-control" id="clave" placeholder="Clave Privada" name="clave" value={this.state.clave}/>
						
  								{this.messageClave.value!== "" ? <div className="alert alert-success"> this.messageClave.value </div> : null  }							
							<div id="pkey_content" style={{display:'none'}}></div>
							</div>
							<div className="col-sm-2">
								<label className="btn btn-primary" htmlFor="clavebutton">			
								<input id="clavebutton" type="file" onChange={this.handleChangeClave} style={{display:'none'}} accept=".key"/>
								Buscar
								</label>
							</div>

						</div>
						</div>
						<div className="row">
						<div className="form-group">
							<div className="col-sm-4"><label className="control-label col-sm-11" htmlFor="pwd">Contraseña:</label></div>
							<div className="col-sm-6"><input type="password" className="form-control" id="pwd_pkey" placeholder="Enter password" name="pwd" onChange={this.handleChangePass}/></div>
							<div className="col-sm-2"></div>   		
						</div>
						</div>
						<div className="row">
							<div className="col-sm-4"></div>
							<div className="col-sm-6">
							<button type="button" onClick={this.handleClickVerifica} className="btn btn-primary">Verificar</button>  &nbsp;
							{(this.state.verificado && this.props.funcionLlama) || (window.doc && this.state.verificado) ? <button type="button" className="btn btn-primary" onClick={this.handlerConArchivo} >Firmar</button>: null}	
							{(this.state.verificado && !this.props.funcionLlama && !window.doc) ? <button type="button" id="agregar_archivos" className="btn btn-primary" data-toggle="modal" data-target="#myModal">Agregar Archivos</button>:null }
							</div> 
							<div className="col-sm-2"></div>   		
						</div>  		
					</form>

						<Loader loaded={this.state.loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" >    
            			</Loader>

					<div className="modal fade" id="myModal" role="dialog">
						<div className="modal-dialog">
						  <div className="modal-content">
							<div className="modal-header">
							  <button type="button" className="close" data-dismiss="modal">&times;</button>							 
							</div>
							<div className="modal-body" id="modal-body"> 
							<h3 className="content_header">Archivos de tu computadora</h3>

								<Archivos action={this.handlerFirma}/>

							</div>
						  </div>
						</div>

					</div>	

				</div>
			</div>
		)
	}
}


export default Firma