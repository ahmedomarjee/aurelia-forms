import {
	autoinject,
	TaskQueue
} from "aurelia-framework";
import {
	EventAggregator
} from "aurelia-event-aggregator";
import {
	RouterService
} from "./router-service";
import * as Interfaces from "../interfaces";

@autoinject
export class HistoryService {
	private isActive = false;

	constructor(
		private eventAggregator: EventAggregator,
		private taskQueue: TaskQueue,
		private router: RouterService
	) {
		this.register();
	}

	getUrl(): string {
		let hash = location.hash;

		if (!hash) {
			return "";
		}

		return hash.substr(1);
	}
	navigateCurrent() {
		this.guardedNavigate(() => {
			this.navigate({
				url: this.getUrl()
			});
		});
	}
	navigateByCode(url: string, clearStack: boolean) {
		this.guardedNavigate(() => {
			window.location.assign(url);

			this.navigate({
				url: url,
				clearStack: clearStack
			});
		});
	}

	private guardedNavigate(action: {(): void}) {
		if (this.isActive) {
			return;
		}

		this.isActive = true;
		action();
		this.isActive = false;
	}
	private register() {
		window.addEventListener("popstate", (e) => {
			this.guardedNavigate(() => {
				this.navigate({
					historyState: e.state,
					url: this.getUrl()
				});
			});
		});
	}
	private navigate(navigationArgs: Interfaces.INavigationArgs) {
		this.router.navigate(navigationArgs);

		if (!navigationArgs.historyState && navigationArgs.routeInfo) {
			history.replaceState(<Interfaces.IHistoryState>{
				id: navigationArgs.routeInfo.id,
				url: navigationArgs.url
			},
			navigationArgs.routeInfo.route.title)
		}
	}
}