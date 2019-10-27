import React from 'react';
import './index.css';
import HomePage from "./pages/home";

export default class App extends React.Component {
	render() {
		return (
			<div className="content">
				<HomePage server="http://dixneuf.nevesnican.cz:10501"
				          refreshInterval={40}
				          maxEstimates={10} />
			</div>
		);
	}
};
