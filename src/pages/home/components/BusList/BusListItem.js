import React from 'react';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons/faChevronDown";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {formatDelayTime} from "../../../../util";

export default class BusListItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = { visible: false };
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

			if (!passed && this.props.estimates) {
				estimate = this.props.estimates[stop.stop_id];
			}

			rtn.push(
				<li key={stop.stop_id} className={passed ? "passed-stop" : ""}>
					{
						stop.stop_name} {!passed && !estimate ?
						<span className="btn-link estimate-button" onClick={() => this.props.estimateFun(this.props.bus.id, stop.stop_id)}>[Odhadnout příjezd]</span> :
						null
					}
					{estimate ? <span className="text-info">(Příjezd za <strong>{estimate}</strong>)</span> : null}
				</li>
			);
		}

		return <ul>{rtn}</ul>;
	}

	toggleVisibility() {
		this.setState({visible: !this.state.visible});
	}

	delayClassName(delay) {
		if (delay < -2) {
			return "text-primary";
		} else if (delay < 3) {
			return "text-success";
		} else if (delay < 11) {
			return "text-warning";
		} else {
			return "text-danger";
		}
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

							<div className="delay ">
								{
									bus.delay < -2 ? "Předjetí: " : "Zpoždění: "
								}
								<strong className={this.delayClassName(bus.delay)}>{formatDelayTime(bus.delay)}</strong>
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

						{
							this.state.visible ?
								<Card.Body>
									<div>Příští zastávka: <strong>{bus.next_stop_name}</strong></div>
									<div>Cíl: <strong>{bus.last_stop_name}</strong></div>
									<div>
										Trasa: {this.renderTrip(bus.stops, bus.next_stop_id)}
									</div>
								</Card.Body> :
								null
						}
					</Card>
				</Col>
			</Row>
		)
	}
}