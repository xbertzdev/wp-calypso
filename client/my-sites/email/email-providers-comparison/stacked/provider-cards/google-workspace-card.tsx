import { useShoppingCart } from '@automattic/shopping-cart';
import { translate } from 'i18n-calypso';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import googleWorkspaceIcon from 'calypso/assets/images/email-providers/google-workspace/icon.svg';
import { getSelectedDomain } from 'calypso/lib/domains';
import { hasGSuiteSupportedDomain, getGoogleMailServiceFamily } from 'calypso/lib/gsuite';
import useCartKey from 'calypso/my-sites/checkout/use-cart-key';
import { getGoogleAppLogos } from 'calypso/my-sites/email/email-provider-features/list';
import GoogleWorkspacePrice from 'calypso/my-sites/email/email-providers-comparison/price/google-workspace';
import EmailProvidersStackedCard from 'calypso/my-sites/email/email-providers-comparison/stacked/email-provider-stacked-card';
import getOnSubmitNewMailboxesHandler from 'calypso/my-sites/email/email-providers-comparison/stacked/provider-cards/get-on-submit-new-mailboxes-handler';
import getUpsellProps from 'calypso/my-sites/email/email-providers-comparison/stacked/provider-cards/get-upsell-props';
import {
	EmailProvidersStackedCardProps,
	ProviderCardProps,
} from 'calypso/my-sites/email/email-providers-comparison/stacked/provider-cards/provider-card-props';
import { getProductByProviderAndInterval } from 'calypso/my-sites/email/email-providers-comparison/stacked/provider-cards/selectors/get-product-by-provider-and-interval';
import { NewMailBoxList } from 'calypso/my-sites/email/form/mailboxes/components/new-mailbox-list';
import { EmailProvider } from 'calypso/my-sites/email/form/mailboxes/types';
import canUserPurchaseGSuite from 'calypso/state/selectors/can-user-purchase-gsuite';
import { getDomainsBySiteId } from 'calypso/state/sites/domains/selectors';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import type { TranslateResult } from 'i18n-calypso';
import type { ReactElement } from 'react';

import './google-workspace-card.scss';

const getGoogleFeatures = (): TranslateResult[] => {
	return [
		translate( 'Send and receive from your custom domain' ),
		translate( '30GB storage' ),
		translate( 'Email, calendars, and contacts' ),
		translate( 'Video calls, docs, spreadsheets, and more' ),
		translate( 'Real-time collaboration' ),
		translate( 'Store and share files in the cloud' ),
		translate( '24/7 support via email' ),
	];
};

const googleWorkspaceCardInformation: ProviderCardProps = {
	className: 'google-workspace-card',
	expandButtonLabel: translate( 'Select' ),
	providerKey: 'google',
	description: translate(
		'Business email with Gmail. Includes other collaboration and productivity tools from Google.'
	),
	logo: { path: googleWorkspaceIcon, className: 'google-workspace-icon' },
	appLogos: getGoogleAppLogos(),
	productName: getGoogleMailServiceFamily(),
	features: getGoogleFeatures(),
};

const GoogleWorkspaceCard = ( props: EmailProvidersStackedCardProps ): ReactElement => {
	const {
		detailsExpanded,
		intervalLength,
		isDomainInCart = false,
		onExpandedChange,
		selectedDomainName,
	} = props;
	const selectedSite = useSelector( getSelectedSite );
	const siteSlug = selectedSite?.slug ?? '';
	const domains = useSelector( ( state ) => getDomainsBySiteId( state, selectedSite?.ID ) );
	const domain = getSelectedDomain( {
		domains,
		selectedDomainName: selectedDomainName,
	} );

	const cartKey = useCartKey();
	const dispatch = useDispatch();
	const shoppingCartManager = useShoppingCart( cartKey );

	const provider = EmailProvider.Google;
	const gSuiteProduct = useSelector( ( state ) =>
		getProductByProviderAndInterval( state, provider, intervalLength )
	);

	const canPurchaseGSuite = useSelector( canUserPurchaseGSuite );

	const [ addingToCart, setAddingToCart ] = useState( false );

	const isGSuiteSupported =
		canPurchaseGSuite && ( isDomainInCart || hasGSuiteSupportedDomain( [ domain ] ) );

	const googleWorkspace: ProviderCardProps = { ...googleWorkspaceCardInformation };
	googleWorkspace.detailsExpanded = isGSuiteSupported && detailsExpanded;
	googleWorkspace.showExpandButton = isGSuiteSupported;
	googleWorkspace.priceBadge = (
		<GoogleWorkspacePrice
			domain={ domain }
			isDomainInCart={ isDomainInCart }
			intervalLength={ intervalLength }
		/>
	);

	const handleSubmit = getOnSubmitNewMailboxesHandler( {
		...props,
		dispatch,
		domain,
		emailProduct: gSuiteProduct,
		provider,
		setAddingToCart,
		shoppingCartManager,
		siteSlug,
	} );

	googleWorkspace.onExpandedChange = onExpandedChange;
	googleWorkspace.formFields = ! isGSuiteSupported ? undefined : (
		<NewMailBoxList
			areButtonsBusy={ addingToCart }
			isInitialMailboxPurchase
			onSubmit={ handleSubmit }
			provider={ provider }
			selectedDomainName={ selectedDomainName }
			showAddNewMailboxButton
			submitActionText={ translate( 'Purchase' ) }
			{ ...getUpsellProps( { isDomainInCart, siteSlug } ) }
		/>
	);

	return <EmailProvidersStackedCard { ...googleWorkspace } />;
};

export default GoogleWorkspaceCard;