import {
  autoinject,
  bindable,
  observable,
  BindingEngine,
  Disposable,
  Expression,
  OverrideContext,
  TaskQueue
} from "aurelia-framework";
import {
  IFileUploaderWithViewerOptions
} from "../../widget-options/export";
import {
  BindingService,
  FileService,
  LocalizationService
} from "../../../base/export";
import * as $ from "jquery";

@autoinject
export class TipFileUploaderWithViewer{
  private _isClickActive: boolean;

  constructor(
    private file: FileService,
    private localization: LocalizationService,
    private binding: BindingService,
    private bindingEngine: BindingEngine,
    private taskQueue: TaskQueue
  ) {}

  @bindable options: IFileUploaderWithViewerOptions;
  @observable currentValue: any;
  
  input: HTMLInputElement;
  downloadUrl: string;

  bindingContext: any;
  overrideContext: OverrideContext

  observables: Disposable[] = [];

  placeholderIcon?: string;
  placeholderImage?: string;
  placeholderImageText?: string;
  @observable iconDownload?: string;
  imageStyle: any;
  
  downloadButtonOptions: DevExpress.ui.dxButtonOptions = {
    text: "Download",
    onClick: () => {
      window.open(this.downloadUrl, "_blank");
    }
  }

  bind(bindingContext: any, overrideContext: OverrideContext) {
    this.bindingContext = bindingContext;
    this.overrideContext = overrideContext;

    const bindingOptions = this.options["bindingOptions"];
    if (bindingOptions && bindingOptions.value) {
      this.observeValue(bindingOptions.value, (v) => this.currentValue = v);
    }

    if (this.options.iconDownloadExpression) {
      this.observeValue(this.options.iconDownloadExpression, (v) => this.iconDownload = v);
    } else if (this.options.iconDownload) {
      this.iconDownload = this.options.iconDownload;
    }

    if (this.options.placeholderImageExpression) {
      this.observeValue(this.options.placeholderImageExpression, (v) => this.placeholderImage = v);
    } else if (this.options.placeholderImage) {
      this.placeholderImage = this.options.placeholderImage;
    }

    if (this.options.placeholderIconExpression) {
      this.observeValue(this.options.placeholderIconExpression, (v) => this.placeholderIcon = v);
    } else if (this.options.placeholderIcon) {
      this.placeholderIcon = this.options.placeholderIcon;
    }

    this.placeholderImageText = this.options.placeholderImageText
      || this.localization.translate(null, "forms.file_uploadClickHere");

    if (this.options.height) {
      this.imageStyle = {
        height: this.options.height
      };
    }
  }
  unbind() {
    if (this.observables) {
      this.observables.forEach(c => c.dispose());
      this.observables.length = 0;
    }
  }
  attached() {
    $(this.input).on("change", (e) => {
      if (this.input.files.length !== 1) {
        return;
      }

      this.taskQueue.queueMicroTask(() => {
        this.file
          .upload(this.input.files[0])
          .then(r => {
            if (!r || !r.length) {
              return;
            }

            this.currentValue = r[0];

            const bindingOptions = this.options["bindingOptions"];
            if (bindingOptions && bindingOptions.value) {
              const expression = this.bindingEngine.parseExpression(bindingOptions.value);
              expression.assign({
                bindingContext: this.bindingContext,
                overrideContext: this.overrideContext
              }, r[0], null);
            }
          });
      });
    });
  }

  getExpressionContext(propertyName: string) {
    return this.binding.getBindingContext({
        bindingContext: this.bindingContext,
        overrideContext: this.overrideContext
      }, propertyName);
  }
  observeValue(propertyName: string, setValueCallback: {(value): void}) {
    const expression = this.bindingEngine.parseExpression(propertyName);
    const context = this.getExpressionContext(propertyName);
    const observer = this.bindingEngine.expressionObserver(context, propertyName);

    this.observables.push(observer.subscribe((newValue, oldValue) => {
      setValueCallback(expression.evaluate({
        bindingContext: this.bindingContext,
        overrideContext: this.overrideContext
      }));
    }));

    setValueCallback(expression.evaluate({
      bindingContext: this.bindingContext,
      overrideContext: this.overrideContext
    }));
  }

  currentValueChanged(newValue: string) {
    if (newValue) {
      this.downloadUrl = this.file.getDownloadUrl(newValue);
    } else {
      this.downloadUrl = null;
    }
  }
  iconDownloadChanged(newValue: string) {
    let downloadButton: DevExpress.ui.dxButton = this["downloadButton"];
    const icon = `fa fa-${this.iconDownload || "cloud-download"}`;

    if (downloadButton) {
      downloadButton.option("icon", icon);
    } else {
      this.downloadButtonOptions.icon = icon;
    }
  }

  onClick(event: Event) {
    $(this.input).trigger("click");
    event.stopPropagation();
    event.preventDefault();
  }
}