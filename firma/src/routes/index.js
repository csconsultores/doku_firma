//Routes/index.js
import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Template from '../containers/Template'
import Firma from '../components/firma'
import Archivos from '../components/archivos'
import Before from '../components/before'
const createRoutes =() => {
	return (
		<Route
			path='/'
			component={Template}
		>
		<IndexRoute
			component={Firma} 
		/>
		<Route
			path={'/archivos'}
			component = {Archivos}
		/>		
		<Route
			path={'/FirmaDK17'}
			component = {Firma} 
		
		/>
		<Route
			path={'/FirmaDK17/before'}
			component = {Before} 
		
		/>
		<Route
			path='*'
			component = {Firma} 
		
		/>
		</Route>
		)
}

const Routes = createRoutes()

export default Routes