import { Module, customModule, application, Label } from '@ijstech/components';
import Assets from '@modules/assets';

@customModule
export default class Module1 extends Module {
    private lblTitle: Label;
    private headerVisible = true;
    private footerVisible = true;

    onShow(options: any) {
        if (options?.title) {
            this.lblTitle.caption = options.title;
        }
    }

    toggleHeader() {
        this.headerVisible = !this.headerVisible;
        application.EventBus.dispatch('setHeaderVisibility', this.headerVisible);
    }
    toggleFooter() {
        this.footerVisible = !this.footerVisible;
        application.EventBus.dispatch('setFooterVisibility', this.footerVisible);
    }
    render(){
        return <i-panel>
            <i-label id="lblTitle" caption='Module 1!'></i-label>
            <i-vstack position='absolute' top='45%' gap='0.5rem' zIndex={10}>
                <i-button
                    width={120}
                    height={36}
                    caption='toggle header'
                    onClick={this.toggleHeader.bind(this)}
                ></i-button>
                <i-button
                    width={120}
                    height={36}
                    caption='toggle footer'
                    onClick={this.toggleFooter.bind(this)}
                ></i-button>
            </i-vstack>
            <i-image url={Assets.logo.header.desktop}></i-image>
        </i-panel>
    }
}