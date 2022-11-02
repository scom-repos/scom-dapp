import { Module, Styles, Container, customModule, application } from '@ijstech/components';
import Assets from '@dapp/assets';

@customModule
export default class Module1 extends Module {
    render(){
        return <i-panel>
            <i-label caption='Module 1!'></i-label>
            <i-image url={Assets.logo}></i-image>
        </i-panel>
    }
}