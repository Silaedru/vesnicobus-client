import React from 'react';
import './index.css';
import HomePage from "./pages/home";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBus} from "@fortawesome/free-solid-svg-icons/faBus";

export default class App extends React.Component {
	render() {
		return (
			<div className="content">
				<h1 className="title">
					Vesnico <FontAwesomeIcon icon={faBus} size={"lg"} /> Bus
				</h1>

				<HomePage server="http://dixneuf.nevesnican.cz:10501"
				          refreshInterval={30}
				          maxEstimates={10} />
			</div>
		);
	}
};
