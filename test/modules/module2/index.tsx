import { Module, Styles, Container, customModule, application, Label } from '@ijstech/components';
@customModule
export default class Module1 extends Module {
    private lblParams: Label;
    onLoad(options?: any) {
        this.lblParams.caption = options ? JSON.stringify(options) : "";
    }
    render() {
        return <i-panel>
            <i-vstack>
                <i-label caption='Module 2!'></i-label>
                <i-label id="lblParams"></i-label>
            </i-vstack>
        </i-panel>
    }
}