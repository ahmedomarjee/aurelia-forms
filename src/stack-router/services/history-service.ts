import {
	autoinject,
	TaskQueue
} from "aurelia-framework";
import {
	EventAggregator
} from "aurelia-event-aggregator";
import * as Interfaces from "../interfaces";

@autoinject
export class HistoryService {
	constructor(
		private eventAggregator: EventAggregator,
		private taskQueue: TaskQueue
	) {
		this.register();
	}

	readonly NavigateEventName = "HistoryService:Navigate";
	readonly GoBackEventName = "HistoryService:GoBack";

	getUrl(): string {
		let hash = location.hash;

		if (!hash) {
			return "";
		}

		return hash.substr(1);
	}
	navigateCurrent() {
		this.navigate(null);
	}

	private register() {
		window.addEventListener("popstate", (e) => {
			const routeInfo = e.state && e.state.routeInfo 
				? e.state.routeInfo 
				: null;

			this.navigate(routeInfo);
		});
	}
	private navigate(routeInfo: Interfaces.IRouteInfo) {
		const args: Interfaces.INavigateArgs = {
			url: this.getUrl(),
			routeInfo: routeInfo
		}

		this.eventAggregator.publish(this.NavigateEventName, args);

		if (!routeInfo && args.routeInfo) {
			history.replaceState({
				routeInfo: args.routeInfo,
			},
			args.routeInfo.route.title)
		}
	}
}