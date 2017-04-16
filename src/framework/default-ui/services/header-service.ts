import {
  autoinject,
  observable
} from "aurelia-framework";
import {
  CustomEvent,
} from "../../base/export";
import {
  CommandService,
  ICommandData
} from "../../forms/export";
import {
  ISearchEventArgs
} from "../event-args/export"

@autoinject
export class HeaderService {
  constructor(
    private command: CommandService,
    public onSearch: CustomEvent<ISearchEventArgs>
  ) {
    this.avatarUrlChanged();
  }

  logoUrl: string = "http://2014.erp-future.com/sites/2014.erp-future.com/files/1_business/Logo_U_TIP.png";
  @observable avatarUrl: string;
  text: string = "TIP Technik und Informatik Partner GmbH";
  logoStyle: any;
  avatarStyle: any;

  commands: ICommandData[] = [];
  avatarCommands: ICommandData[] = [];

  avatarUrlChanged() {
    const image = this.avatarUrl
      || "https://www.colourbox.de/preview/2753241-kleine-graue-katze-im-grunen-gras.jpg";

    this.avatarStyle = {
      "background-image": `url(${image})`
    }
  }
}