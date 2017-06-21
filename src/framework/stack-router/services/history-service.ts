import {
	autoinject,
	TaskQueue
} from "aurelia-framework";
import {
	EventAggregator
} from "aurelia-event-aggregator";
import {
	LocationService
} from "../../base/services/export";
import {
	ILocationGoToEventArgs
} from "../../base/event-args/export"
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
		private router: RouterService,
		private location: LocationService
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
			this.assignUrl(url, false);

			this.navigate({
				url: this.getUrl(url),
				clearStack: clearStack
			});
		});
	}
	navigateByLocation(locationGoTo: ILocationGoToEventArgs) {
		let replace = false;

		if (this.router.viewStack.length > 1
			&& this.router.viewStack[this.router.viewStack.length - 2].controller["currentViewModel"] === locationGoTo.currentViewModel) {
			replace = true;
		}

		const args: Interfaces.INavigationArgs = {
			url: this.getUrl(locationGoTo.url),
			replace: replace
		};

		if (!(args.routeInfo && args.routeInfo.isFallback)) {
			this.assignUrl(args.url, args.replace);
		}

		this.navigate(args);

		locationGoTo.isHandled = true;
	}
	setUrlWithoutNavigation(url: string, replace: boolean = false) {
		this.guardedNavigate(() => {
			this.assignUrl(url, replace);
		});
	}

	private guardedNavigate(action: { (): void }) {
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

		this.location.onLocationGoTo.register(a => {
			this.guardedNavigate(() => {
				this.navigateByLocation(a);
			});

			return Promise.resolve();
		});
	}
	private navigate(navigationArgs: Interfaces.INavigationArgs) {
		this.lastRequestUrl = navigationArgs.url;
		this.router.navigate(navigationArgs);

		if (navigationArgs.routeInfo && navigationArgs.routeInfo.isFallback) {
			this.assignUrl(navigationArgs.routeInfo.route.route[0], navigationArgs.replace);
		}

		if (!navigationArgs.historyState && navigationArgs.routeInfo) {
			history.replaceState(<Interfaces.IHistoryState>{
				id: navigationArgs.routeInfo.id,
				url: navigationArgs.url
			}, navigationArgs.routeInfo.route.caption);
		}
	}
	private assignUrl(url: string, replace: boolean) {
		if (!url) {
			throw new Error("No Url defined");
		}

		if (url.substr(0, 1) !== "#") {
			url = `#${url}`;
		}

		if (replace) {
			location.replace(url);
		} else {
			location.assign(url);
		}
	}
}