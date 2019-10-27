
export default class VesnicobusClient {
	serverBase = "";

	constructor(serverBase) {
		this.serverBase = serverBase;
	}

	static ajaxRequest(method, target, payload) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();

			request.addEventListener("load", response => {
				if (request.status >= 400)
					resolve("false");

				resolve(response.target.responseText);
			});

			request.addEventListener("error", error => {
				reject(error.target);
			});

			request.addEventListener("abort", () => {
				reject();
			});

			request.timeout = 60000;

			request.open(method, target);
			request.send(payload);
		});
	}

	async fetchCurrentStatus() {
		const response = await VesnicobusClient.ajaxRequest("GET", `${this.serverBase}/buses`);
		return JSON.parse(response);
	}

	async estimateArrival(busID, stopID) {
		const response = await VesnicobusClient.ajaxRequest("GET", `${this.serverBase}/buses/${busID}/estimate/${stopID}`);
		return JSON.parse(response);
	}
}