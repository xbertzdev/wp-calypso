import { recordTracksEvent } from '@automattic/calypso-analytics';
import { Button, Popover } from '@automattic/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useI18n } from '@wordpress/react-i18n';
import { useState } from 'react';
import { HELP_CENTER_STORE } from '../stores';

interface Props {
	contextRef: React.RefObject< SVGSVGElement >;
}

const PromotionalPopover = ( { contextRef }: Props ) => {
	const { hasSeenPromotion, doneLoading } = useSelect(
		( select ) => ( {
			hasSeenPromotion: select( HELP_CENTER_STORE ).getHasSeenPromotionalPopover(),
			doneLoading: select( 'core/data' ).hasFinishedResolution(
				HELP_CENTER_STORE,
				'getHasSeenPromotionalPopover',
				[]
			),
		} ),
		[]
	);

	const { setHasSeenPromotionalPopover } = useDispatch( HELP_CENTER_STORE );
	const [ isDismissed, setIsDismissed ] = useState( false );
	const { __ } = useI18n();

	const recordDismiss = ( location: 'clicking-button' | 'clicking-outside' ) => {
		recordTracksEvent( 'calypso_helpcenter_promotion_popover_dismissed', {
			location,
		} );
	};

	if ( ! contextRef ) {
		return null;
	}

	return (
		<>
			<Popover
				className="help-center__promotion-popover"
				isVisible={ doneLoading && ! hasSeenPromotion && ! isDismissed }
				context={ contextRef }
				onClose={ () => {
					recordDismiss( 'clicking-outside' );
					setHasSeenPromotionalPopover( true );
					setIsDismissed( true );
				} }
				position="bottom left"
				showDelay={ 500 }
			>
				<div className="help-center__promotion-popover-inner" style={ { pointerEvents: 'none' } }>
					<h1>{ __( '✨ Our new Help Center', __i18n_text_domain__ ) }</h1>
					<p>
						{ __(
							'We moved our help resources! You can always find it in the top bar.',
							__i18n_text_domain__
						) }
					</p>
					<div className="help-center__promotion-popover-actions">
						<Button
							style={ { pointerEvents: 'all' } }
							onClick={ () => {
								recordDismiss( 'clicking-button' );
								setHasSeenPromotionalPopover( true );
								setIsDismissed( true );
							} }
						>
							{ __( 'Got it', __i18n_text_domain__ ) }
						</Button>
					</div>
				</div>
			</Popover>
		</>
	);
};

export default PromotionalPopover;