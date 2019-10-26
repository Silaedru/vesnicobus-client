import React from 'react';
import BusListItem from "./BusListItem";

export default class BusList extends React.Component {
	busToText(bus) {
		const forbiddenKeys = ["id", "latitude", "longitude", "delay"];

		let rtn = "";

		Object.keys(bus).forEach(key => {

			for (let i=0; i<forbiddenKeys.length; i++) {
				if (key.indexOf(forbiddenKeys[i]) !== -1) {
					return;
				}
			}

			rtn = `${rtn} ${(""+bus[key]).toLowerCase()}`
		});

		return rtn;
	}

	render() {
		const buses = this.props.buses
			.filter(bus => this.busToText(bus).indexOf(this.props.filter) !== -1)
			.sort((a, b) => parseInt(b.line) < parseInt(a.line));

		return buses.map(bus => <BusListItem key={bus.id} bus={bus} client={this.props.client} />);
	}
}