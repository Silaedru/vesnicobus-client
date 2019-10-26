import React from 'react';
import VesnicobusClient from "../../client";
import BusList from "./components/BusList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export default class HomePage extends React.Component {
	/**
	 *
	 * @type {VesnicobusClient}
	 */
	client = null;

	constructor(props) {
		super(props);

		this.state = { buses: [], filter: "" };
	}

	refreshBuses() {
		this.client.fetchCurrentStatus().then(result => {
			this.setState({buses: result});
		});
	}

	componentDidMount() {
		this.client = new VesnicobusClient(this.props.server);

		this.refreshBuses();
		setInterval(() => this.refreshBuses(), 60*1000);
	}

	render() {
		return (
			<div>
				<h1 className="title">
					Vesnicobus
				</h1>

				<Form.Group as={Row} controlId="search">
					<Col sm="2" />
					<Form.Label column={true} sm="1">Hledat:</Form.Label>
					<Col sm="7">
						<Form.Control type="text" onChange={e => this.setState({filter: e.target.value.trim().toLowerCase()})} />
					</Col>
					<Col sm="2" />
				</Form.Group>

				<BusList buses={this.state.buses} filter={this.state.filter} client={this.client} />
			</div>
		);
	}
}