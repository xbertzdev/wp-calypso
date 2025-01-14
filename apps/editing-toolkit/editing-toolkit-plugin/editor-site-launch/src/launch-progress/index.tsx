import { useSelect } from '@wordpress/data';
import { sprintf } from '@wordpress/i18n';
import { useI18n } from '@wordpress/react-i18n';
import * as React from 'react';
import { LAUNCH_STORE } from '../stores';
import type { LaunchSelect } from '@automattic/data-stores';

import './styles.scss';

const LaunchProgress: React.FunctionComponent = () => {
	const { __ } = useI18n();

	const { currentStep, LaunchSequence } = useSelect( ( select ) => {
		const launchStore: LaunchSelect = select( LAUNCH_STORE );
		return {
			currentStep: launchStore.getCurrentStep(),
			LaunchSequence: launchStore.getLaunchSequence(),
		};
	}, [] );

	const current = LaunchSequence.indexOf( currentStep ) + 1;
	const total = LaunchSequence.length;

	/* translators: current progress in launch flow, eg: "2 of 4" */
	const summary = sprintf( __( '%1$d of %2$d', 'full-site-editing' ), current, total );

	return <div className="nux-launch-progress">{ summary }</div>;
};

export default LaunchProgress;
