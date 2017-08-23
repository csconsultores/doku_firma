import React, {Component} from 'react'

class Template extends Component{
	render(){
		return(
			<div>
				<header>
					
				</header>
				<main>
                
				{this.props.children}

				</main>
			</div>

			)
	}
}

export default Template