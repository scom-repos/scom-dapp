import {
    customElements,
    Module,
    ControlElement,
    Styles,
    GridLayout,
    HStack,
    Container,
    Panel,
} from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';
import { getSiteSupportedNetworks, isDefaultNetworkFromWallet, switchNetwork } from './wallet';

const Theme = Styles.Theme.ThemeVars;

@customElements('scom-dapp--select-network')
export class SelectNetwork extends Module {
    private gridNetworkGroup: GridLayout;
    private networkMapper: Map<number, HStack>;
    private networkActiveIndicatorMap: Map<number, Panel>;
    private currActiveNetworkId: number;

    async onNetworkSelected() { }
    async switchNetwork(chainId: number) {
        if (!chainId || isDefaultNetworkFromWallet()) return;
        await switchNetwork(chainId);
        this.onNetworkSelected();
    }
    isNetworkActive(chainId: number) {
        return Wallet.getInstance().chainId === chainId;
    }
    renderNetworks() {
        this.gridNetworkGroup.clearInnerHTML();
        this.networkMapper = new Map();
        this.networkActiveIndicatorMap = new Map();
        const supportedNetworks = getSiteSupportedNetworks();
        this.gridNetworkGroup.append(...supportedNetworks.map((network) => {
            const img = network.image ? <i-image url={network.image} width={34} height={34} /> : [];
            const isActive = this.isNetworkActive(network.chainId);
            if (isActive) this.currActiveNetworkId = network.chainId;
            const activeIndicator = (
                <i-panel 
                    visible={isActive}
                    position='absolute'
                    border={{ radius: '50%' }} 
                    background={{ color: '#20bf55' }} 
                    width="10px" 
                    height="10px"
                ></i-panel>
            );
            this.networkActiveIndicatorMap.set(network.chainId, activeIndicator);
            const hsNetwork = (
                <i-hstack
                    onClick={() => this.switchNetwork(network.chainId)}
                    background={{ color: Theme.colors.secondary.light }}
                    border={{ radius: 10 }}
                    opacity={isActive ? 1 : 0.5}
                    hover={{opacity: 1}}
                    position="relative"
                    cursor='pointer'
                    verticalAlignment="center"
                    padding={{ top: '0.65rem', bottom: '0.65rem', left: '0.5rem', right: '0.5rem' }}
                >
                    {activeIndicator}
                    <i-hstack margin={{ left: '1rem' }} verticalAlignment="center" gap={12}>
                        {img}
                        <i-label caption={network.chainName} wordBreak="break-word" font={{ size: '.875rem', bold: true, color: Theme.colors.primary.dark }} />
                    </i-hstack>
                </i-hstack>
            );
            this.networkMapper.set(network.chainId, hsNetwork);
            return hsNetwork;
        }));
    }
    setActiveNetworkIndicator(connected: boolean) {
        const wallet = Wallet.getClientInstance();
        if (this.currActiveNetworkId !== undefined && this.currActiveNetworkId !== null && this.networkMapper.has(this.currActiveNetworkId)) {
            const networkHStack = this.networkMapper.get(this.currActiveNetworkId);
            networkHStack.opacity = 0.5;
            this.networkActiveIndicatorMap.get(this.currActiveNetworkId).visible = false;
        }
        if (connected && this.networkMapper.has(wallet.chainId)) {
            const networkHStack = this.networkMapper.get(wallet.chainId);
            networkHStack.opacity = 1;
            this.networkActiveIndicatorMap.get(wallet.chainId).visible = true;
        }
        this.currActiveNetworkId = wallet.chainId;
    }
    async init() {
        super.init();
        this.renderNetworks();
        this.setActiveNetworkIndicator(Wallet.getClientInstance().isConnected);
    }
    render() {
        return (
            <i-vstack
                height='100%' lineHeight={1.5}
                padding={{ left: '1rem', right: '1rem', bottom: '2rem' }}
            >
                <i-hstack
                    margin={{ left: '-1.25rem', right: '-1.25rem' }}
                    height='100%'
                >
                    <i-grid-layout
                        id='gridNetworkGroup'
                        font={{ color: '#f05e61' }}
                        height="calc(100% - 160px)"
                        width="100%"
                        overflow={{ y: 'auto' }}
                        margin={{ top: '1.5rem' }}
                        padding={{ left: '1.25rem', right: '1.25rem' }}
                        columnsPerRow={1}
                        templateRows={['max-content']}
                        class='list-view'
                        gap={{ row: '0.5rem' }}
                    ></i-grid-layout>
                </i-hstack>
            </i-vstack>
        )
    }
}