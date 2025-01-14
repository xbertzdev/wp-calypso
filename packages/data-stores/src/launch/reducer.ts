import { combineReducers } from '@wordpress/data';
import { LaunchStep } from './data';
import type { LaunchAction } from './actions';
import type { LaunchStepType } from './types';
import type { Plans } from '..';
import type * as DomainSuggestions from '../domain-suggestions';
import type { Reducer } from 'redux';

const step: Reducer< LaunchStepType, LaunchAction > = ( state = LaunchStep.Name, action ) => {
	if ( action.type === 'SET_STEP' ) {
		return action.step;
	}
	return state;
};

const siteTitle: Reducer< string | undefined, LaunchAction > = ( state = undefined, action ) => {
	if ( action.type === 'SET_SITE_TITLE' ) {
		return action.title;
	}
	return state;
};

const domain: Reducer< DomainSuggestions.DomainSuggestion | undefined, LaunchAction > = (
	state,
	action
) => {
	if ( action.type === 'SET_DOMAIN' ) {
		return action.domain;
	}
	if ( action.type === 'UNSET_DOMAIN' ) {
		return undefined;
	}
	return state;
};

const domainSearch: Reducer< string, LaunchAction > = ( state = '', action ) => {
	if ( action.type === 'SET_DOMAIN_SEARCH' ) {
		return action.domainSearch;
	}
	return state;
};

const confirmedDomainSelection: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'CONFIRM_DOMAIN_SELECTION' ) {
		return true;
	}
	return state;
};

const planProductId: Reducer< number | undefined, LaunchAction > = ( state, action ) => {
	if ( action.type === 'SET_PLAN_PRODUCT_ID' ) {
		return action.planProductId;
	}
	if ( action.type === 'UNSET_PLAN_PRODUCT_ID' ) {
		return undefined;
	}
	return state;
};

const planBillingPeriod: Reducer< Plans.PlanBillingPeriod, LaunchAction > = (
	state = 'ANNUALLY',
	action
) => {
	if ( action.type === 'SET_PLAN_BILLING_PERIOD' ) {
		return action.billingPeriod;
	}
	return state;
};

// Check if focused launch modal is open
const isFocusedLaunchOpen: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'OPEN_FOCUSED_LAUNCH' ) {
		return true;
	}

	if ( action.type === 'CLOSE_FOCUSED_LAUNCH' ) {
		return false;
	}
	return state;
};

// Check if step-by-step launch modal is open
const isSidebarOpen: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'OPEN_SIDEBAR' ) {
		return true;
	}

	if ( action.type === 'CLOSE_SIDEBAR' ) {
		return false;
	}
	return state;
};

// Check if step-by-step launch modal is full screen
const isSidebarFullscreen: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'SET_SIDEBAR_FULLSCREEN' ) {
		return true;
	}
	if ( action.type === 'UNSET_SIDEBAR_FULLSCREEN' ) {
		return false;
	}
	return state;
};

const isAnchorFm: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'ENABLE_ANCHOR_FM' ) {
		return true;
	}

	return state;
};

// Check if site title step should be displayed
const isSiteTitleStepVisible: Reducer< boolean, LaunchAction > = ( state = false, action ) => {
	if ( action.type === 'SHOW_SITE_TITLE_STEP' ) {
		return true;
	}

	return state;
};

// Check if launch modal can be dismissed
const isModalDismissible: Reducer< boolean, LaunchAction > = ( state = true, action ) => {
	if ( action.type === 'SET_MODAL_DISMISSIBLE' ) {
		return true;
	}

	if ( action.type === 'UNSET_MODAL_DISMISSIBLE' ) {
		return false;
	}

	return state;
};

// Check if launch modal title should be visible
const isModalTitleVisible: Reducer< boolean, LaunchAction > = ( state = true, action ) => {
	if ( action.type === 'SHOW_MODAL_TITLE' ) {
		return true;
	}

	if ( action.type === 'HIDE_MODAL_TITLE' ) {
		return false;
	}

	return state;
};

const reducer = combineReducers( {
	step,
	siteTitle,
	domain,
	confirmedDomainSelection,
	domainSearch,
	planBillingPeriod,
	planProductId,
	isSidebarOpen,
	isSidebarFullscreen,
	isAnchorFm,
	isFocusedLaunchOpen,
	isSiteTitleStepVisible,
	isModalDismissible,
	isModalTitleVisible,
} );

export type State = ReturnType< typeof reducer >;

export default reducer;
