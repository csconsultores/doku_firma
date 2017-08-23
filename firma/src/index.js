//SRC index

import C from './constants'
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, hashHistory} from 'react-router'
import Routes from './routes'
import './index.css'
//import {setCERT} from './actions'

import initial from './initialState'
import storeFactory from './store'
import { Provider } from 'react-redux'

import Firma from './components/firma'
import Archivos from './components/archivos'
import Before from './components/before'

const initialState=(localStorage["redux-store"]) ?
	JSON.parse(localStorage["redux-store"]):
	initial

const saveState=() =>
	localStorage["redux-store"] = JSON.stringify(store.getState())

const store = storeFactory(initialState)
store.subscribe(saveState)

/*store.dispatch(
	setCERT('con acciones')
)*/

window.React = React
// for development purpose, add the sotre to the global window object
// This allows interact with the store from the javascript console
window.store = store

ReactDOM.render ((
	<Provider store={store}>

<Router history={hashHistory}>
    <Route path="/" component={Firma}/>
    {/* add the routes here */}
    <Route path="/archivos" component={Archivos}/>
    <Route path="/before" component={Before}/>
  </Router>


</Provider>),
	document.getElementById('root')
)