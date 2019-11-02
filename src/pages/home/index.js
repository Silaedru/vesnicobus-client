import React from 'react';
import VesnicobusClient from "../../client";
import BusList from "./components/BusList";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {formatArrivalTime, formatTime, queueData, queueIndex} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBus} from "@fortawesome/free-solid-svg-icons/faBus";

export default class HomePage extends React.Component {
	/**
	 *
	 * @type {VesnicobusClient}
	 */
	client = null;
	filterTimeout = null;

	constructor(props) {
		super(props);

		this.state = {
			buses: [],
			refreshTime: "Probíhá synchronizace ...",
			filter: "",
			estimates: {},
			queuedEstimates: []
		};
	}

	refreshBuses() {
		this.client.fetchCurrentStatus().then(result => {
			const syncTime = new Date(result.timestamp*1000);
			this.setState({ buses: result["bus_info"],
				refreshTime: `Čas synchronizace: ${formatTime(syncTime)}` });
		});
	}

	componentDidMount() {
		this.client = new VesnicobusClient(this.props.server);

		this.refreshBuses();
		setInterval(() => {
			this.refreshBuses();
			this.refreshEstimatedArrivals();
		}, this.props.refreshInterval*1000);
	}

	refreshEstimatedArrivals() {
		const originalEstimates = this.state.estimates;
		const originalQueue = this.state.queue;
		const promises = [];

		if (originalEstimates) {
			Object.keys(originalEstimates).forEach(busID => {
				Object.keys(originalEstimates[busID]).forEach(stopID => {
					if (originalEstimates[busID][stopID]) {
						promises.push(this.client.estimateArrival(busID, stopID));
					}
				});
			});
		}

		Promise.all(promises).then(estimates => {
			const updatedEstimates = {};
			estimates.forEach(estimate => {
				if (!estimate)
					return;

				if (!updatedEstimates[estimate["bus_id"]]) {
					updatedEstimates[estimate["bus_id"]] = {};
				}

				updatedEstimates[estimate["bus_id"]][estimate["stop_id"]] = formatArrivalTime(estimate["estimate"]);
			});

			estimates = this.state.estimates;
			const newEstimates = {};
			const updatedQueuedEstimates = [];
			const currentQueue = this.state.queuedEstimates;

			Object.keys(updatedEstimates).forEach(busID => {
				if (estimates[busID]) {
					if (!newEstimates[busID])
						newEstimates[busID] = {};

					Object.keys(updatedEstimates[busID]).forEach(stopID => {
						if (estimates[busID][stopID]) {
							newEstimates[busID][stopID] = updatedEstimates[busID][stopID];
							updatedQueuedEstimates.push(queueIndex(busID, stopID));
						}
					});
				}
			});

			const newQueuedEstimates = [];

			for (let i=0; i<currentQueue.length; i++) {
				const item = currentQueue[i];
				if (updatedQueuedEstimates.indexOf(item) !== -1) {
					newQueuedEstimates.push(item);
				}
			}

			this.setState({estimates: newEstimates, queuedEstimates: newQueuedEstimates});
		}).catch(() => {
		});
	}

	estimateArrival(busID, stopID) {
		let queuedEstimates = this.state.queuedEstimates;
		if (queuedEstimates.indexOf(queueIndex(busID, stopID)) === -1) {
			let estimates = this.state.estimates;

			if (queuedEstimates.length >= this.props.maxEstimates) {
				const rm = queueData(queuedEstimates.shift());
				estimates[rm[0]][rm[1]] = undefined;
			}

			queuedEstimates.push(queueIndex(busID, stopID));
			this.setState({estimates: estimates, queuedEstimates: queuedEstimates});

			this.client.estimateArrival(busID, stopID).then(estimate => {
				estimates = this.state.estimates;
				queuedEstimates = this.state.queuedEstimates;

				if (queuedEstimates.indexOf(queueIndex(busID, stopID)) === -1)
					return;

				if (!estimates[busID]) {
					estimates[busID] = {};
				}

				estimates[busID][stopID] = formatArrivalTime(estimate.estimate);

				this.setState({estimates: estimates});
			});
		}
	}

	updateFilter(filter) {
		if (this.filterTimeout != null) {
			clearTimeout(this.filterTimeout);
		}

		this.filterTimeout = setTimeout(() => {
			this.filterTimeout = null;
			this.setState({filter: filter});
		}, 300);
	}

	render() {
		return (
			<div>
				<h1 className="title">
					Vesnico <FontAwesomeIcon icon={faBus} size={"lg"} /> Bus
				</h1>

				<Form.Group as={Row} controlId="search">
					<Col sm="2" />
					<Form.Label column={true} sm="1">Hledat:</Form.Label>
					<Col sm="7">
						<Form.Control type="text" onChange={e => this.updateFilter(e.target.value.trim().toLowerCase())} />
					</Col>
					<Col sm="2" />
				</Form.Group>

				<Row className="text-center sync-time">
					<Col>
						<small>{this.state.refreshTime}</small>
					</Col>
				</Row>

				<BusList buses={this.state.buses}
				         filter={this.state.filter}
				         estimates={this.state.estimates}
				         estimateFun={(busID, stopID) => this.estimateArrival(busID, stopID)} />
			</div>
		);
	}
}