import { Module, Styles, Container, customModule, application } from '@ijstech/components';
@customModule
export default class Module1 extends Module {
    render(){
        return <i-panel>
            <i-label caption='Module 2!'></i-label>
        </i-panel>
    }
}