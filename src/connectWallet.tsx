import {
    customElements,
    Module,
    Styles,
    HStack,
    Input,
    VStack,
    Label,
    Control,
    Button,
} from '@ijstech/components';
import { Wallet } from '@ijstech/eth-wallet';
import { requestLoginSession, sendAuthCode, verifyAuthCode } from './API';
import assets from './assets';
import { LoginSessionType } from './constants';
import { getOAuthProvider } from './site';
import { connectWallet, getSupportedWalletProviders, getWalletPluginProvider, initWalletPlugins, WalletPlugin } from './wallet';

declare const google: any;
const Theme = Styles.Theme.ThemeVars;

@customElements('scom-dapp--connect-wallet')
export class ConnectWallet extends Module {
    private pnlWalletPlugins: VStack;
    private pnlOAuthPlugins: HStack;
    private walletMapper: Map<string, HStack>;
    private currActiveWallet: string;
    private inputEmailAddress: Input;
    private btnSubmitEmail: Button;
    private lbConfirmEmailRecipient: Label;
    private pnlAuthCodeDigits: HStack;
    private pnlLogin: VStack;
    private pnlConfirmEmail: VStack;
    private pnlEmail: VStack;
    private digitInputs: Input[];
    private loginSessionNonce: string;
    private loginSessionExpireAt: number;

    async onWalletSelected() { }
    isWalletActive(walletPlugin) {
        const provider = getWalletPluginProvider(walletPlugin);
        return provider ? provider.installed() && Wallet.getClientInstance().clientSideProvider?.name === walletPlugin : false;
    }

    openLink(link: any) {
        return window.open(link, '_blank');
    };
    async handleSignInWithGoogle(response: any) {
        let idToken = response.credential;
        let payload = JSON.parse(atob(idToken.split('.')[1]));
        let email = payload.email;
        let loginSessionResult = await requestLoginSession(LoginSessionType.Email);
        if (!loginSessionResult.success) {
            return;
        }
        this.loginSessionNonce = loginSessionResult.data.nonce;
        this.loginSessionExpireAt = loginSessionResult.data.expireAt;
        await connectWallet(WalletPlugin.Email, {
            sessionNonce: this.loginSessionNonce,
            sessionExpireAt: this.loginSessionExpireAt,
            userTriggeredConnect: true,
            verifyAuthCode: verifyAuthCode,
            verifyAuthCodeArgs: {
                email: email,
                authCode: idToken,
                provider: 'google'
            }
        });
        await this.onWalletSelected();
        console.log(email);
    }

    connectToProviderFunc = async (walletPlugin: string) => {
        const provider = getWalletPluginProvider(walletPlugin);
        if (provider?.installed()) {
            let loginSessionResult = await requestLoginSession(LoginSessionType.Email);
            if (!loginSessionResult.success) {
                return;
            }
            this.loginSessionNonce = loginSessionResult.data.nonce;
            this.loginSessionExpireAt = loginSessionResult.data.expireAt;
            await connectWallet(walletPlugin, {
                userTriggeredConnect: true,
                sessionNonce: this.loginSessionNonce,
                sessionExpireAt: this.loginSessionExpireAt,
            });
        }
        else {
            let homepage = provider.homepage;
            this.openLink(homepage);
        }
        await this.onWalletSelected();
    }

    private onDigitInputKeyUp(target: Input, event: KeyboardEvent, index: number) {
        if (target.value.length === 1) {
            if (index === this.digitInputs.length - 1) {
                this.handleEmailLogin();
            }
            else {
                this.digitInputs[index + 1].focus();
            }     
        }
        else if (event.key === 'Backspace' && target.value === '' && index !== 0) {
            this.digitInputs[index - 1].focus();
        }
    }

    private renderAuthCodeDigits() {
        this.digitInputs = [];
        this.pnlAuthCodeDigits.clearInnerHTML();
        for (let i = 0; i < 6; i++) {
            const digitInput = (
                <i-input
                    inputType='number'
                    maxLength={1}
                    height={'3.625rem'}
                    width={'2.875rem'}
                    border={{ radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }}
                    padding={{ left: '0.625rem', right: '0.625rem' }}
                    font={{ size: '1.125rem' }}
                    onFocus={this.onInputFocused}
                    onBlur={this.onInputBlured}
                    onKeyUp={(target: Input, event: KeyboardEvent) => this.onDigitInputKeyUp(target, event, i)}
                ></i-input>
            )
            this.digitInputs.push(digitInput);
            this.pnlAuthCodeDigits.appendChild(digitInput)
        }
    }

    async onSubmitEmail() {
        let loginSessionResult = await requestLoginSession(LoginSessionType.Email);
        if (!loginSessionResult.success) {
            return;
        }
        this.loginSessionNonce = loginSessionResult.data.nonce;
        this.loginSessionExpireAt = loginSessionResult.data.expireAt;
        await sendAuthCode(this.inputEmailAddress.value);
        this.lbConfirmEmailRecipient.caption = this.inputEmailAddress.value;
        this.renderAuthCodeDigits();
        this.pnlConfirmEmail.visible = true;
        this.pnlLogin.visible = false;
    }

    async handleEmailLogin() {
        let authCode = '';
        this.digitInputs.forEach((digitInput) => {
            authCode += digitInput.value;
        })
        if (authCode.length !== 6) return;
        await connectWallet(WalletPlugin.Email, {
            sessionNonce: this.loginSessionNonce,
            sessionExpireAt: this.loginSessionExpireAt,
            userTriggeredConnect: true,
            verifyAuthCode: verifyAuthCode,
            verifyAuthCodeArgs: {
                email: this.inputEmailAddress.value,
                authCode: authCode
            }
        });
        await this.onWalletSelected();
    }

    initWallet = async () => {
        await initWalletPlugins();
        this.walletMapper = new Map();
        const walletList = getSupportedWalletProviders();
        this.pnlWalletPlugins.clearInnerHTML();
        walletList.forEach((wallet) => {
            if (wallet.name === WalletPlugin.Email) {
                this.pnlEmail.visible = true;
            }
            else if (wallet.name === WalletPlugin.Google) {
                const googleContainer = new HStack();
                this.pnlOAuthPlugins.append(googleContainer);
                google.accounts.id.initialize({
                    client_id: getOAuthProvider(WalletPlugin.Google).clientId,
                    context: 'signin',
                    ux_mode: 'popup',
                    callback: this.handleSignInWithGoogle.bind(this)
                });
                // google.accounts.id.prompt();
                google.accounts.id.renderButton(
                    googleContainer,
                    {
                        type: 'icon',
                        shape: 'rectangular',
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        logo_alignment: 'left',
                    }
                )
            }
            else {
                const isActive = this.isWalletActive(wallet.name);
                if (isActive) this.currActiveWallet = wallet.name;
                const imageUrl = wallet.image;
                const hsWallet = (
                    <i-hstack
                        verticalAlignment="center" horizontalAlignment="space-between"
                        gap={'0.5rem'} height={'2.75rem'}
                        border={{ radius: '0.35rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }}
                        padding={{ top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' }}
                        cursor='pointer'
                        onClick={() => this.connectToProviderFunc(wallet.name)}
                    >
                        <i-button
                            caption={wallet.displayName}
                            icon={{
                                width: '1.75rem',
                                height: '1.75rem',
                                image: {
                                    width: '1.75rem',
                                    height: '1.75rem',
                                    display: 'inline-block',
                                    url: imageUrl
                                },
                                margin: { right: '0.438rem' }
                            }}
                            padding={{ top: '0px', bottom: '0px', left: '0px', right: '0px' }}
                            font={{ weight: 500, size: '0.875rem' }}
                            background={{ color: 'transparent' }}
                            boxShadow='none'
                            width={'100%'} height={'100%'}
                            grid={{ horizontalAlignment: 'start' }}
                        ></i-button>
                        <i-label caption='Connect' font={{ color: Theme.colors.primary.main }}></i-label>
                    </i-hstack>
                );
                this.walletMapper.set(wallet.name, hsWallet);
                this.pnlWalletPlugins.append(hsWallet);
            }
        })
    }

    setActiveWalletIndicator(connected: boolean) {
        const wallet = Wallet.getClientInstance();
        if (this.currActiveWallet && this.walletMapper.has(this.currActiveWallet)) {
            this.walletMapper.get(this.currActiveWallet).classList.remove('is-actived');
        }
        if (connected && this.walletMapper.has(wallet.clientSideProvider?.name)) {
            this.walletMapper.get(wallet.clientSideProvider?.name).classList.add('is-actived');
        }
        this.currActiveWallet = wallet.clientSideProvider?.name;
    }

    private onTogglePanel(target: Control) {
        const groups = this.querySelectorAll('.group');
        for (let group of groups) {
            (group as Control).visible = false;
        }
        const nextElm = target.nextSibling as Control;
        if (nextElm) nextElm.visible = true;
    }

    private onEmailInputChanged(target: Input) {
        this.btnSubmitEmail.enabled = target.value;
        this.btnSubmitEmail.font = { color: this.btnSubmitEmail.enabled ? Theme.colors.primary.contrastText : Theme.text.disabled };
    }

    private onInputFocused(target: Control, isParent = false) {
        if (!target) return;
        target.border.color = Theme.colors.primary.light;
        target.border.width = '1px';
        target.border.style = 'solid';
        target.border.radius = isParent ? '0.375rem 0 0 0.375rem' : '0.75rem';
        target.boxShadow = `0 0 0 1px ${Theme.colors.primary.light})`;
    }

    private onInputBlured(target: Control, isParent = false) {
        if (!target) return;
        target.border.color = isParent ? 'transparent' : Theme.colors.secondary.light;
        target.boxShadow = `none`;
    }

    show(): void {
        this.pnlConfirmEmail.visible = false;
        this.pnlLogin.visible = true;
    }

    async init() {
        super.init();
        await this.initWallet();
    }

    render() {
        return (
            <i-vstack padding={{ left: '1rem', right: '1rem', bottom: '2rem' }} lineHeight={1.5}>
                <i-vstack
                    id="pnlLogin"
                    height={'100%'}
                    stack={{ grow: '1' }}
                >
                    <i-vstack
                        width="100%"
                        padding={{ left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' }}
                        gap="0.75rem"
                        border={{ radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.primary.light }}
                        margin={{ bottom: '1rem' }}
                    >
                        <i-panel height="100%" cursor="pointer" onClick={this.onTogglePanel}>
                            <i-label
                                caption='Connect Wallet'
                                font={{ size: '0.875rem', weight: 500 }}
                                lineHeight={1.25}
                            ></i-label>
                        </i-panel>
                        <i-vstack gap="0.75rem" class="group">
                            <i-vstack gap={'0.5rem'} id="pnlWalletPlugins">
                            </i-vstack>
                        </i-vstack>
                    </i-vstack>
                    <i-vstack
                        width="100%"
                        padding={{ left: '0.75rem', right: '0.75rem', top: '0.75rem', bottom: '0.75rem' }}
                        gap="0.75rem"
                        border={{ radius: '0.75rem', width: '1px', style: 'solid', color: Theme.colors.primary.light }}
                    >
                        <i-panel cursor="pointer" onClick={this.onTogglePanel}>
                            <i-label
                                caption='Email & Social'
                                font={{ size: '0.875rem', weight: 500 }}
                                lineHeight={1.25}
                            ></i-label>
                        </i-panel>
                        <i-vstack gap="0.75rem" visible={false} class="group">
                            <i-vstack id="pnlEmail" visible={false}>
                                <i-hstack
                                    border={{ radius: '0.375rem', width: '1px', style: 'solid', color: Theme.colors.secondary.light }}
                                    height={'2.75rem'} width={'100%'}
                                >
                                    <i-hstack
                                        verticalAlignment="center" gap={'1.25rem'} width='100%'
                                        stack={{ grow: '1' }} padding={{ left: '0.5rem' }}
                                        background={{color: Theme.input.background}}
                                        border={{ radius: '0.375rem 0 0 0.375rem', width: '1px', style: 'solid', color: 'transparent' }}
                                    >
                                        <i-icon name="envelope" fill={Theme.text.secondary} width={'1.25rem'} height={'1.25rem'}></i-icon>
                                        <i-input
                                            id="inputEmailAddress"
                                            border={{ radius: '0.375rem 0 0.375rem 0' }}
                                            height={'100%'}
                                            width={'100%'}
                                            placeholder='your@email.com'
                                            onChanged={this.onEmailInputChanged}
                                            onFocus={(target: Input) => this.onInputFocused(target.parent, true)}
                                            onBlur={(target: Input) => this.onInputBlured(target.parent, true)}
                                        ></i-input>
                                    </i-hstack>
                                    <i-button
                                        id="btnSubmitEmail"
                                        caption='Submit'
                                        boxShadow='none'
                                        height={'100%'}
                                        padding={{ left: '0.9rem', right: '0.9rem' }}
                                        border={{ radius: '0 0.375rem 0.375rem 0' }}
                                        enabled={false}
                                        stack={{ basis: '4.688rem' }}
                                        onClick={this.onSubmitEmail}
                                    ></i-button>
                                </i-hstack>
                                <i-label caption={`Get started without a wallet.`} font={{ color: Theme.text.secondary, size: '0.813rem' }}></i-label>
                                <i-hstack width={'100%'} gap={'0.5rem'} verticalAlignment="center" padding={{ left: '0.5rem', right: '0.5rem' }}>
                                    <i-panel
                                        width={'100%'}
                                        height={1}
                                        border={{ top: { width: '1px', style: 'solid', color: Theme.colors.secondary.light } }}
                                    ></i-panel>
                                    <i-label caption='Or' font={{ color: Theme.text.secondary, size: '0.813rem' }}></i-label>
                                    <i-panel
                                        width={'100%'}
                                        height={1}
                                        border={{ top: { width: '1px', style: 'solid', color: Theme.colors.secondary.light } }}
                                    ></i-panel>
                                </i-hstack>
                            </i-vstack>
                            <i-hstack id="pnlOAuthPlugins" gap={'0.25rem'} verticalAlignment="center" height={'2.75rem'}>
                            </i-hstack>
                        </i-vstack>
                    </i-vstack>
                </i-vstack>
                <i-vstack
                    id="pnlConfirmEmail"
                    justifyContent="center" alignItems='center'
                    gap={'1rem'}
                    height={'100%'} width={'100%'}
                    visible={false}
                >
                    <i-image url={`${assets.fullPath('img/envelop.svg')}`} width={'3rem'} height={'3rem'}></i-image>
                    <i-label caption='Enter confirmation code' font={{ size: '1.063rem', weight: 500 }}></i-label>
                    <i-hstack gap={'0.25rem'} verticalAlignment='center' horizontalAlignment='center' margin={{ bottom: '1.5rem' }} wrap='wrap'>
                        <i-label
                            caption='Please check'
                            font={{ color: Theme.text.secondary, weight: 300 }}
                        ></i-label>
                        <i-label
                            id="lbConfirmEmailRecipient"
                            font={{ color: Theme.text.secondary, weight: 600 }}
                        ></i-label>
                        <i-label
                            caption='for an email and enter your code below.'
                            font={{ color: Theme.text.secondary, weight: 300 }}
                        ></i-label>
                    </i-hstack>
                    <i-hstack id="pnlAuthCodeDigits" width={'100%'} margin={{ top: '1.25rem' }} horizontalAlignment="space-between" overflow={'hidden'}></i-hstack>
                    <i-hstack verticalAlignment="center" horizontalAlignment="space-between" width={'100%'}>
                        <i-label caption={`Didn't get an email?`} font={{ color: Theme.text.secondary, size: '0.813rem' }}></i-label>
                        <i-label caption={`Resend Code`} font={{ color: Theme.text.secondary, size: '0.813rem' }} link={{ href: '' }}></i-label>
                    </i-hstack>
                </i-vstack>
            </i-vstack>
        )
    }
}