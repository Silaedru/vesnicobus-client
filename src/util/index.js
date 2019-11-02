export function formatDelayTime(delay) {
	let d = Math.round(delay);

	switch (d) {
		case -1:
		case 0:
			return "žádné";
		case 1:
			return "1 minuta";
		case 2:
		case 3:
		case 4:
		case -2:
		case -3:
		case -4:
			return `${Math.abs(d)} minuty`;
		default:
	}

	return `${Math.abs(d)} minut`;
}

export function formatArrivalTime(time) {
	let d = Math.max(Math.round(time), 0);

	if (isNaN(d)) {
		return "okamžik";
	}

	switch (d) {
		case 0:
			return "okamžik";
		case 1:
			return "1 minutu";
		case 2:
		case 3:
		case 4:
			return `${d} minuty`;
		default:
	}

	return `${d} minut`;
}

export function formatTime(time) {
	let h = time.getHours();
	if (h < 10) {
		h = "0" + h;
	}

	let m = time.getMinutes();
	if (m < 10) {
		m = "0" + m;
	}

	let s = time.getSeconds();
	if (s < 10) {
		s = "0" + s;
	}

	return `${h}:${m}:${s}`;
}

export function queueIndex(busID, stopID) {
	return `${busID}-${stopID}`;
}

export function queueData(index) {
	return index.split("-");
}