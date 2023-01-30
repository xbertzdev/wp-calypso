import { WPCOM_FEATURES_COPY_SITE } from '@automattic/calypso-products';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch as useReduxDispatch, useSelector } from 'react-redux';
import { useQuerySitePurchases } from 'calypso/components/data/query-site-purchases';
import { ONBOARD_STORE, SITE_STORE } from 'calypso/landing/stepper/stores';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import { clearSignupDestinationCookie } from 'calypso/signup/storageUtils';
import { getCurrentUserId } from 'calypso/state/current-user/selectors';
import {
	hasLoadedSitePurchasesFromServer,
	isFetchingSitePurchases,
} from 'calypso/state/purchases/selectors';
import getSiteFeatures from 'calypso/state/selectors/get-site-features';
import siteHasFeature from 'calypso/state/selectors/site-has-feature';
import { fetchSiteFeatures } from 'calypso/state/sites/features/actions';
import type { SiteExcerptData } from 'calypso/data/sites/site-excerpt-types';

function useSafeSiteHasFeature( siteId: number | undefined, feature: string ) {
	const dispatch = useReduxDispatch();
	useEffect( () => {
		if ( ! siteId ) {
			return;
		}
		dispatch( fetchSiteFeatures( siteId ) );
	}, [ dispatch, siteId ] );

	return useSelector( ( state ) => {
		if ( ! siteId ) {
			return false;
		}
		return siteHasFeature( state, siteId, feature );
	} );
}

export const useSiteCopy = (
	site: Pick< SiteExcerptData, 'ID' | 'site_owner' | 'plan' > | undefined
) => {
	const userId = useSelector( ( state ) => getCurrentUserId( state ) );
	const hasCopySiteFeature = useSafeSiteHasFeature( site?.ID, WPCOM_FEATURES_COPY_SITE );
	const { isRequesting: isRequestingSiteFeatures } = useSelector( ( state ) => {
		const siteFeatures = getSiteFeatures( state, site?.ID );
		return siteFeatures ? siteFeatures : { isRequesting: true };
	} );
	const isAtomic = useSelect( ( select ) => site && select( SITE_STORE ).isSiteAtomic( site.ID ) );
	const plan = site?.plan;
	const isSiteOwner = site?.site_owner === userId;

	useQuerySitePurchases( site?.ID );
	const isLoadingPurchase = useSelector(
		( state ) => isFetchingSitePurchases( state ) || ! hasLoadedSitePurchasesFromServer( state )
	);

	const { setPlanCartItem } = useDispatch( ONBOARD_STORE );

	const shouldShowSiteCopyItem = useMemo( () => {
		return hasCopySiteFeature && isSiteOwner && plan && isAtomic && ! isLoadingPurchase;
	}, [ hasCopySiteFeature, isSiteOwner, plan, isLoadingPurchase, isAtomic ] );

	const startSiteCopy = useCallback(
		//eslint-disable-next-line @typescript-eslint/no-explicit-any
		( eventName: string, extraProps?: Record< string, any > ) => {
			if ( ! plan ) {
				return;
			}
			clearSignupDestinationCookie();
			setPlanCartItem( { product_slug: plan.product_slug } );
			recordTracksEvent( eventName, extraProps );
		},
		[ plan, setPlanCartItem ]
	);

	return useMemo(
		() => ( {
			shouldShowSiteCopyItem,
			startSiteCopy,
			isFetching: isLoadingPurchase || isRequestingSiteFeatures,
		} ),
		[ isLoadingPurchase, isRequestingSiteFeatures, shouldShowSiteCopyItem, startSiteCopy ]
	);
};

export const withSiteCopy = createHigherOrderComponent(
	( Wrapped ) => ( props ) => {
		const { shouldShowSiteCopyItem, startSiteCopy } = useSiteCopy( props.site );
		return (
			<Wrapped
				{ ...props }
				shouldShowSiteCopyItem={ shouldShowSiteCopyItem }
				startSiteCopy={ startSiteCopy }
			/>
		);
	},
	'withSiteCopy'
);