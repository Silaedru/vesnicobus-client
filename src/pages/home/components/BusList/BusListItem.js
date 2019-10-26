import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons/faChevronDown";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class BusListItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {visible: false, estimates:{}};
	}

	formatTime(delay, zeroTimeString) {
		let d = Math.max(parseInt(delay), 0);

		switch (d) {
			case 0:
				return zeroTimeString;
			case 1:
				return "1 minuta";
			case 2:
			case 3:
			case 4:
				return `${d} minuty`;
			default:
		}

		return `${d} minut`;
	}

	estimateArrival(stopId) {
		this.props.client.estimateArrival(this.props.bus.id, stopId).then(estimate => {
			const estimates = this.state.estimates;
			estimates[stopId] = this.formatTime(estimate.estimate, "okamžik");
			this.setState({estimates: estimates});
		});
	}

	renderTrip(stops, nextStop) {
		const rtn = [];
		let passed = true;

		for (let i=0; i<stops.length; i++) {
			const stop = stops[i];

			if (passed && stop.stop_id === nextStop) {
				passed = false;
			}

			let estimate;

			if (!passed) {
				estimate = this.state.estimates[stop.stop_id];
			}

			rtn.push(
				<li key={stop.stop_id} className={passed ? "passed-stop" : ""}>
					{stop.stop_name} {!passed && !estimate ? <span onClick={() => this.estimateArrival(stop.stop_id)}>(Odhadnout dojezd)</span> : ""}
					{estimate ? `Příjezd za ${estimate}` : ""}
				</li>
			);
		}

		return <ul>{rtn}</ul>;
	}

	toggleVisibility() {
		this.setState({visible: !this.state.visible});
	}

	render() {
		const bus = this.props.bus;

		return (
			<Row className="bus-list-item">
				<Col>
					<Card>
						<Card.Header onClick={() => this.toggleVisibility()} className="bus-header no-select">
							<h4 className="float-left">
								<Badge variant="dark"><strong>{bus.line}</strong></Badge>
							</h4>

							<div className="delay">
								Zpoždění: <strong>{this.formatTime(bus.delay, "žádné")}</strong>
							</div>

							<div className="float-right">
								<Button variant="light">
									{
										this.state.visible ?
											<FontAwesomeIcon icon={faChevronDown}/> :
											<FontAwesomeIcon icon={faChevronRight}/>
									}
								</Button>
							</div>
						</Card.Header>

						<Card.Body className={this.state.visible ? "" : "d-none"}>
							<div>Cíl: <strong>{bus.last_stop_name}</strong></div>
							<div>Příští zastávka: <strong>{bus.next_stop_name}</strong></div>
							<div>
								Trasa: {this.renderTrip(bus.stops, bus.next_stop_id)}
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		)
	}
}