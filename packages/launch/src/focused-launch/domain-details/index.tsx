/* eslint-disable wpcalypso/jsx-classname-namespace */

import { recordTracksEvent } from '@automattic/calypso-analytics';
import DomainPicker, {
	mockDomainSuggestion,
	SUGGESTION_ITEM_TYPE_BUTTON,
} from '@automattic/domain-picker';
import { useLocale } from '@automattic/i18n-utils';
import { Title, SubTitle } from '@automattic/onboarding';
import { useI18n } from '@wordpress/react-i18n';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { FOCUSED_LAUNCH_FLOW_ID } from '../../constants';
import LaunchContext from '../../context';
import { useDomainSearch, useDomainSelection, useSiteDomains } from '../../hooks';
import GoBackButton from '../go-back-button';
import type { DomainSuggestions } from '@automattic/data-stores';

const ANALYTICS_UI_LOCATION = 'domain_step';

const DomainDetails: React.FunctionComponent = () => {
	const { getCurrentLaunchFlowUrl, redirectTo } = React.useContext( LaunchContext );
	const { __, hasTranslation } = useI18n();
	const locale = useLocale();
	const { siteSubdomain } = useSiteDomains();
	const { domainSearch, setDomainSearch } = useDomainSearch();
	const { onDomainSelect, onExistingSubdomainSelect, currentDomain } = useDomainSelection();
	const history = useHistory();

	const goBack = () => {
		history.goBack();
	};

	const launchFlowUrl = getCurrentLaunchFlowUrl();
	const redirectToUseDomainFlow = (): void => {
		const useYourDomainUrl = `/start/launch-site/domains-launch/use-your-domain?siteSlug=${ siteSubdomain?.domain }&source=${ launchFlowUrl }`;
		redirectTo( useYourDomainUrl );
	};

	const handleSelect = ( suggestion: DomainSuggestions.DomainSuggestion ) => {
		onDomainSelect( suggestion );
		goBack();
	};

	const handleSubdomainSelect = () => {
		onExistingSubdomainSelect();
		goBack();
	};

	const trackDomainSearchInteraction = ( query: string ) => {
		recordTracksEvent( 'calypso_newsite_domain_search_blur', {
			flow: FOCUSED_LAUNCH_FLOW_ID,
			query,
			where: ANALYTICS_UI_LOCATION,
		} );
	};

	const fallbackSubtitleText = __(
		'Free for the first year with any paid plan.',
		__i18n_text_domain__
	);
	const newSubtitleText = __(
		'Free for the first year with any annual plan.',
		__i18n_text_domain__
	);
	const subtitleText =
		locale === 'en' || hasTranslation?.( 'Free for the first year with any annual plan.' )
			? newSubtitleText
			: fallbackSubtitleText;

	return (
		<div className="focused-launch-container">
			<div className="focused-launch-details__back-button-wrapper">
				<GoBackButton onClick={ goBack } />
			</div>
			<div className="focused-launch-details__header">
				<Title>{ __( 'Choose a domain', __i18n_text_domain__ ) }</Title>
				<SubTitle>{ subtitleText }</SubTitle>
			</div>
			<div className="focused-launch-details__body">
				<DomainPicker
					initialDomainSearch={ domainSearch }
					onSetDomainSearch={ setDomainSearch }
					onDomainSearchBlur={ trackDomainSearchInteraction }
					currentDomain={ currentDomain }
					existingSubdomain={ mockDomainSuggestion( siteSubdomain?.domain ) }
					onDomainSelect={ handleSelect }
					onExistingSubdomainSelect={ handleSubdomainSelect }
					analyticsFlowId={ FOCUSED_LAUNCH_FLOW_ID }
					analyticsUiAlgo={ ANALYTICS_UI_LOCATION }
					segregateFreeAndPaid
					locale={ locale }
					itemType={ SUGGESTION_ITEM_TYPE_BUTTON }
					onUseYourDomainClick={ redirectToUseDomainFlow }
				/>
			</div>
		</div>
	);
};

export default DomainDetails;
