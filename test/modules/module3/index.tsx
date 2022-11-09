import { Module, Styles, Container, customModule, application, Label } from '@ijstech/components';
@customModule
export default class Module3 extends Module {
  private lblId: Label;
  onShow(options?: any) {
    this.lblId.caption = options?.id || "";
  }
  onHide() {
      console.log("module 3 hide")
  }
  render() {
    return <i-panel>
      <i-vstack margin={{ top: '1rem', bottom: '1rem' }}>
        <i-label caption='Module 3!' font={{ size: '1.5rem', bold: true }}></i-label>
        <i-hstack verticalAlignment='center' gap={4}>
          <i-label caption="id: "></i-label>
          <i-label id="lblId"></i-label>
        </i-hstack>
      </i-vstack>
    </i-panel>
  }
}