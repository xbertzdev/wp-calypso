import { StripeHookProvider } from '@automattic/calypso-stripe';
import { ShoppingCartProvider, createShoppingCartManagerClient } from '@automattic/shopping-cart';
import { PropsOf } from '@emotion/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import CheckoutMain from 'calypso/my-sites/checkout/composite-checkout/components/checkout-main';
import {
	mockGetCartEndpointWith,
	fetchStripeConfiguration,
	siteId,
	countryList,
	mockSetCartEndpointWith,
	createTestReduxStore,
} from './index';
import type { CartKey, SetCart, ResponseCart } from '@automattic/shopping-cart';

export function MockCheckout( {
	initialCart,
	mainCartKey,
	cartChanges,
	additionalProps,
	setCart,
}: {
	initialCart: ResponseCart;
	mainCartKey: CartKey;
	cartChanges?: Partial< ResponseCart >;
	additionalProps?: Partial< PropsOf< typeof CheckoutMain > >;
	setCart?: SetCart;
} ) {
	const reduxStore = createTestReduxStore();
	const queryClient = new QueryClient();

	const mockSetCartEndpoint = mockSetCartEndpointWith( {
		currency: initialCart.currency,
		locale: initialCart.locale,
	} );
	const managerClient = createShoppingCartManagerClient( {
		getCart: mockGetCartEndpointWith( { ...initialCart, ...( cartChanges ?? {} ) } ),
		setCart: setCart || mockSetCartEndpoint,
	} );
	return (
		<ReduxProvider store={ reduxStore }>
			<QueryClientProvider client={ queryClient }>
				<ShoppingCartProvider
					managerClient={ managerClient }
					options={ {
						defaultCartKey: mainCartKey,
					} }
				>
					<StripeHookProvider fetchStripeConfiguration={ fetchStripeConfiguration }>
						<CheckoutMain
							siteId={ siteId }
							siteSlug="foo.com"
							overrideCountryList={ countryList }
							{ ...additionalProps }
						/>
					</StripeHookProvider>
				</ShoppingCartProvider>
			</QueryClientProvider>
		</ReduxProvider>
	);
}
