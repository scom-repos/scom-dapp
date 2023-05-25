import { Module, Styles, Container, customModule, application } from '@ijstech/components';
import { BigNumber, Wallet } from '@ijstech/eth-wallet';
import Assets from '@modules/assets';
import { Contracts as DripContracts } from '@scom/oswap-drip-contract';

@customModule
export default class Module1 extends Module {
    private async test(){
        const launcherInstanceId = application.store['instanceId'];
        console.log(`launcherInstanceId: ${launcherInstanceId}`);
        const wallet = Wallet.getRpcWalletInstance(launcherInstanceId);
        await wallet.switchNetwork(97);
        let drip = new DripContracts.Drip(wallet, '0xFc28280774317326229aCC97C830ad77348fa1eF');
        let info = await drip.getInfo(1);
        const tokenDecimals = 18;
        let output = {
            startDate: new BigNumber(info._startDate).shiftedBy(3).toNumber(),
            endDate: new BigNumber(info._endDate).shiftedBy(3).toNumber(),
            claimedAmount:  new BigNumber(info._claimedAmount).shiftedBy(-tokenDecimals).toFixed(),
            unclaimedAmount: new BigNumber(info._unclaimedFunds).shiftedBy(-tokenDecimals).toFixed(),
            totalAmount: new BigNumber(info._totalAmount).shiftedBy(-tokenDecimals).toFixed(),
        }
        console.log(output);
    }
    render(){
        return <i-panel>
            <i-label caption='Module 1!'></i-label>
            <i-image url={Assets.logo.header.desktop}></i-image>
            <i-button caption='Test' onClick={this.test}></i-button>
        </i-panel>
    }
}