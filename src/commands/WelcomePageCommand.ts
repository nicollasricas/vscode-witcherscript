import { ContentPreview } from "../components/ContentPreview";
import { Pages } from "../constants";

export class WelcomePageCommand implements Command {
    constructor(private contentPreview: ContentPreview) {}

    execute() {
        this.contentPreview.show(Pages.Welcome);
    }
}
