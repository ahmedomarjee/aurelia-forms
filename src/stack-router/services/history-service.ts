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
			this.navigate(e.state);
		});
	}
	private navigate(historyState: Interfaces.IHistoryState) {
		const args: Interfaces.INavigateArgs = {
			url: this.getUrl(),
			historyState: historyState
		}

		this.eventAggregator.publish(this.NavigateEventName, args);

		if (!historyState && args.routeInfo) {
			history.replaceState(<Interfaces.IHistoryState>{
				id: args.routeInfo.id,
				url: args.url
			},
			args.routeInfo.route.title)
		}
	}
}