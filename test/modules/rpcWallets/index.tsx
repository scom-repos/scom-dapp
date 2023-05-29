import { Module, Styles, Container, customModule, application, CardLayout, VStack, HStack, Label } from '@ijstech/components';
import { BigNumber, Utils, Wallet, IRpcWallet, Constants, IEventBusRegistry } from '@ijstech/eth-wallet';
import Assets from '@modules/assets';
import { Contracts as DripContracts } from '@scom/oswap-drip-contract';

interface ICardInfo {
    recipient: string;
    unclaimedAmount: string;
    claimedAmount: string;
    totalAmount: string;
    startDate: number;
    endDate: number;
}

@customModule
export default class RpcWallets extends Module {
    private cardLayout: CardLayout;
    private eventsMap: Record<string, IEventBusRegistry[]> = {};

    private async appendLabel(caption: string, value: string, container: Container) {
        const pnl: HStack = await HStack.create({
            horizontalAlignment: 'space-between'
        }, container);
        const lbl: Label = await Label.create({
            caption: caption
        }, pnl);
        const lblValue: Label = await Label.create({
            caption: value
        }, pnl);
        return lblValue;
    }

    private async appendCard(rpcWallet: IRpcWallet, info: ICardInfo) {
        const tokenDecimals = 18;
        const pnlCard: VStack = await VStack.create({
            background: { color: '#FD7C6B' },
            padding: { bottom: '0.5rem', top: '0.5rem', right: '0.5rem', left: '0.5rem' }
        }, this.cardLayout);

        const lblStatusValue = await this.appendLabel('Status', rpcWallet.isConnected ? 'Connected' : 'Disconnected', pnlCard);
        const lblChainIdValue = await this.appendLabel('Chain Id', rpcWallet.chainId.toString(), pnlCard);
        const lblRecipientValue = await this.appendLabel('Recipient', info.recipient, pnlCard);
        const lblStartDateValue = await this.appendLabel('Start Date', info.startDate.toString(), pnlCard);
        const lblEndDateValue = await this.appendLabel('End Date', info.endDate.toString(), pnlCard);
        const lblClaimedAmountValue = await this.appendLabel('Claimed Amount', info.claimedAmount, pnlCard);
        const lblUnclaimedAmountValue = await this.appendLabel('Unclaimed Amount', info.unclaimedAmount, pnlCard);
        const lblTotalAmountValue = await this.appendLabel('Total Amount', info.totalAmount, pnlCard);

        const event = rpcWallet.registerWalletEvent(this, Constants.RpcWalletEvent.Connected, (connected: boolean) => {
            console.log(`connected: ${connected}`);
            lblStatusValue.caption = connected ? 'Connected' : 'Disconnected';
        });
        this.eventsMap[rpcWallet.instanceId] = [event];
    }

    private async fetchDripInfo(rpcWallet: IRpcWallet, contractAddress: string, campaignId: number) {
        const drip = new DripContracts.Drip(rpcWallet, contractAddress);
        const info = await drip.getInfo(campaignId);
        const tokenDecimals = 18;
        let output = {
            recipient: info._recipient,
            startDate: Utils.fromDecimals(info._startDate, 3).toNumber(),
            endDate: Utils.fromDecimals(info._endDate, 3).toNumber(),
            claimedAmount:  Utils.fromDecimals(info._claimedAmount, tokenDecimals).toFixed(),
            unclaimedAmount: Utils.fromDecimals(info._unclaimedFunds, tokenDecimals).toFixed(),
            totalAmount: Utils.fromDecimals(info._totalAmount, tokenDecimals).toFixed(),
        }
        return output;
    }

    private async show(){
        this.eventsMap = {};
        const launcherInstanceId = application.store['instanceId'];
        console.log(`launcherInstanceId: ${launcherInstanceId}`);
        const launcherRpcWallet = Wallet.getRpcWalletInstance(launcherInstanceId);
        await launcherRpcWallet.switchNetwork(97);

        let info = await this.fetchDripInfo(launcherRpcWallet, '0xFc28280774317326229aCC97C830ad77348fa1eF', 1);
        await this.appendCard(launcherRpcWallet, info);

        const wallet = Wallet.getClientInstance();
        const instanceId = wallet.initRpcWallet({
            networks: Object.values(application.store.networkMap),
            infuraId: application.store.infuraId
        });
        const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
        await rpcWallet.switchNetwork(43113);
        info = await this.fetchDripInfo(rpcWallet, '0x589AE79396f887313BEA981ea3f2ea78706BF47E', 0);
        await this.appendCard(rpcWallet, info);
    }

    private async hide() {
        this.cardLayout.clearInnerHTML();
        for (const instanceId in this.eventsMap) {
            const rpcWallet = Wallet.getRpcWalletInstance(instanceId);
            const events = this.eventsMap[instanceId];
            for (const event of events) {
                rpcWallet.unregisterWalletEvent(event);
            }
            const clientWallet = Wallet.getClientInstance();
            clientWallet.destoryRpcWalletInstance(instanceId);
        }
    }
    render(){
        return <i-panel>
            {/* <i-label caption='Module 1!'></i-label> */}
            {/* <i-image url={Assets.logo.header.desktop}></i-image> */}

            <i-hstack gap='1rem'>
                <i-button 
                    caption='Show' 
                    padding={{ top: '0.35rem', bottom: '0.35rem', left: '1rem', right: '1rem' }}
                    background={{ color: '#007bff' }}
                    onClick={this.show} 
                ></i-button>
                <i-button 
                    caption='Hide' 
                    padding={{ top: '0.35rem', bottom: '0.35rem', left: '1rem', right: '1rem' }}
                    background={{ color: '#28a745' }}
                    onClick={this.hide}
                ></i-button>
            </i-hstack>
            <i-card-layout id="cardLayout" columnsPerRow={4} gap={{ column: '0.5rem', row: '0.5rem' }}>
            </i-card-layout>
        </i-panel>
    }
}