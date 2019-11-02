import React from 'react';
import BusListItem from "./BusListItem";

export default class BusList extends React.Component {
	busToText(bus) {
		let rtn = `${bus.line} ${bus.next_stop_name} ${bus.last_stop_name} `;

		bus.stops.forEach(stop => {
			rtn += `${stop.stop_name} `;
		});

		rtn = rtn.split(",").join(" ");

		return rtn.toLowerCase();
	}

	render() {
		const buses = this.props.buses
			.filter(bus => {
				return (
					this.props.filter.length < 1 ||
					this.busToText(bus).indexOf(this.props.filter) !== -1
				);
			})
			.sort((a, b) => parseInt(a.line) - parseInt(b.line));

		return buses.map(bus => <BusListItem key={bus.id}
		                                     bus={bus}
		                                     estimates={this.props.estimates[bus.id]}
		                                     client={this.props.client}
		                                     estimateFun={this.props.estimateFun} />);
	}
}