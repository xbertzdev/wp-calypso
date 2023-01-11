import { localizeUrl } from '@automattic/i18n-utils';
import { useTranslate } from 'i18n-calypso';
import { useSelector } from 'react-redux';
import FormattedHeader from 'calypso/components/formatted-header';
import InlineSupportLink from 'calypso/components/inline-support-link';
import Main from 'calypso/components/main';
import SectionNav from 'calypso/components/section-nav';
import useFollowersQuery from 'calypso/data/followers/use-followers-query';
import useUsersQuery from 'calypso/data/users/use-users-query';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { getSelectedSite } from 'calypso/state/ui/selectors';
import PeopleSectionNavCompact from '../people-section-nav-compact';
import Subscribers from '../subscribers';
import TeamInvites from '../team-invites';
import TeamInvitesAccepted from '../team-invites-accepted';
import TeamMembers from '../team-members';
import type { FollowersQuery } from '../subscribers/types';
import type { UsersQuery } from '../team-members/types';

interface Props {
	filter: string;
	search?: string;
}
function SubscribersTeam( props: Props ) {
	const _ = useTranslate();
	const { filter, search } = props;
	const site = useSelector( ( state ) => getSelectedSite( state ) );

	// fetching data config
	const followersFetchOptions = { search };
	const teamFetchOptions = search
		? {
				search: `*${ search }*`,
				search_columns: [ 'display_name', 'user_login' ],
		  }
		: {};

	const followersQuery = useFollowersQuery(
		site?.ID,
		'all',
		followersFetchOptions
	) as unknown as FollowersQuery;
	const usersQuery = useUsersQuery( site?.ID, teamFetchOptions ) as unknown as UsersQuery;

	return (
		<Main>
			<FormattedHeader
				brandFont
				className="people__page-heading"
				headerText={ _( 'Users' ) }
				subHeaderText={ _(
					'Invite subscribers and team members to your site and manage their access settings. {{learnMore}}Learn more{{/learnMore}}.',
					{
						components: {
							learnMore: (
								<InlineSupportLink
									showIcon={ false }
									supportLink={ localizeUrl( 'https://wordpress.com/support/invite-people/' ) }
								/>
							),
						},
					}
				) }
				align="left"
				hasScreenOptions
			/>
			<div>
				<SectionNav>
					<PeopleSectionNavCompact
						selectedFilter={ filter }
						searchTerm={ search }
						filterCount={ {
							subscribers: followersQuery.data?.total,
							'team-members': usersQuery.data?.total,
						} }
					/>
				</SectionNav>

				{ ( () => {
					switch ( filter ) {
						case 'subscribers':
							return (
								<>
									<PageViewTracker path="/people/subscribers/:site" title="People > Subscribers" />

									<Subscribers
										filter={ filter }
										search={ search }
										followersQuery={ followersQuery }
									/>
								</>
							);

						case 'team-members':
							return (
								<>
									<PageViewTracker
										path="/people/team-members/:site"
										title="People > Team Members / Invites"
									/>

									<TeamMembers search={ search } usersQuery={ usersQuery } />
									<TeamInvites />
									<TeamInvitesAccepted />
								</>
							);
					}
				} )() }
			</div>
		</Main>
	);
}

export default SubscribersTeam;
