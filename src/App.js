import React from 'react';
import './index.css';
import HomePage from "./pages/home";

export default class App extends React.Component {
	render() {
		return (
			<div className="content">
				<HomePage server="http://localhost:10501" />
			</div>
		);
	}
};
