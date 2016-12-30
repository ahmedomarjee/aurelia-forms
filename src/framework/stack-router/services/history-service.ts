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
import * as Interfaces from "../interfaces/export";

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

	pipelineUrl: string;
	lastRequestUrl: string;

	getUrl(url?: string): string {
		let hash = url || location.hash;

		if (!hash) {
			return "";
		}

		if (hash.substr(0, 1) === "#") {
			return hash.substr(1);
		} else {
			return hash;
		}
	}
	navigateCurrentOrInPipeline() {
		if (this.pipelineUrl) {
			this.navigateByCode(this.pipelineUrl, true);
			this.pipelineUrl = null;
		} else {
			this.guardedNavigate(() => {
				this.navigate({
					url: this.getUrl()
				});
			});
		}
	}
	navigateByCode(url: string, clearStack: boolean) {
		this.guardedNavigate(() => {
			this.assignUrl(url);

			this.navigate({
				url: this.getUrl(url),
				clearStack: clearStack
			});
		});
	}
	setUrlWithoutNavigation(url: string) {
		this.guardedNavigate(() => {
			this.assignUrl(url);
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
		this.lastRequestUrl = navigationArgs.url;
		this.router.navigate(navigationArgs);

		if (navigationArgs.routeInfo && navigationArgs.routeInfo.isFallback) {
			this.assignUrl(navigationArgs.routeInfo.route.route[0]);
		}

		if (!navigationArgs.historyState && navigationArgs.routeInfo) {
			history.replaceState(<Interfaces.IHistoryState>{
				id: navigationArgs.routeInfo.id,
				url: navigationArgs.url
			},
			navigationArgs.routeInfo.route.title)
		}
	}
	private assignUrl(url: string) {
		if (!url) {
			throw new Error("No Url defined");
		}

		if (url.substr(0, 1) !== "#") {
			url = `#${url}`;
		}

		location.assign(url);
	}
}