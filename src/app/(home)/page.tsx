import React from 'react';
import { type NextPage } from 'next';
import { LuRadioTower, LuTrophy } from 'react-icons/lu';
import { Badge } from '@/components/Badge';
import { PageContent } from '@/components/PageContent';
import { ProfilePicture } from '@/components/ProfilePicture';
import { getPositionName } from '@/utils/facilities';
import { formatDuration } from '@/utils/time';
import { getRecentAnnouncements } from '@/lib/announcements/repository';
import { getOnlineControllers, getTopControllers, getTopPositions } from '@/lib/connections/repository';
import { getEvents } from '@/lib/events/repository';
import { getNewestControllers } from '@/lib/users/repository';
import { AnnouncementCard, EventCard } from './HomepageCards';
import { HomepageBanner } from './HomepageBanner';

export const metadata = { title: 'Welcome to Houston ARTCC!' };

const TROPHY_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];

const Home: NextPage = async () => {
    const [
        onlineConnections,
        recentAnnouncements,
        upcomingEvents,
        newestControllers,
        topControllers,
        topPositions,
    ] = await Promise.all([
        getOnlineControllers(),
        getRecentAnnouncements(4),
        getEvents({ limit: 2 }),
        getNewestControllers(3),
        getTopControllers(3),
        getTopPositions(3),
    ]);

    return (
        <>
            <HomepageBanner />
            <PageContent>
                <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div>
                        <h1 className="text-[2.5rem] font-bold">Virtual Houston ARTCC</h1>
                        <h3 className="mb-5 text-2xl font-medium text-slate-400">
                            Part of VATUSA & the VATSIM Network.
                        </h3>
                        <p>
                            Welcome to the Virtual Houston Air Route Traffic Control Center! Encompassing an airspace of
                            approximately 280,000 square miles in parts of Texas, Louisiana, Mississippi, and Alabama,
                            Houston has a diverse selection of destinations for you to choose from along with the
                            professional air traffic control services to support your flight.
                        </p>
                    </div>
                    <div className="lg:ml-auto lg:min-w-[50%]">
                        <h2 className="mb-5 text-3xl font-medium">Who's Online?</h2>
                        <div className="flex flex-col gap-3">
                            {onlineConnections.length === 0 && <p>Nobody 😢</p>}
                            {onlineConnections.map((connection) => (
                                <div key={connection.id} className="flex items-center gap-3">
                                    <Badge>{connection.callsign}</Badge>
                                    <span className="font-medium">
                                        {connection.user.first_name} {connection.user.last_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Announcements</h2>
                        <div className="flex flex-col gap-5">
                            {recentAnnouncements.map((announcement) => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Events</h2>
                        <div className="flex flex-col gap-5">
                            {upcomingEvents.length === 0 && <p>There are no published events, check back later.</p>}
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Newest Controllers</h2>
                        <div className="flex flex-col gap-5">
                            {newestControllers.map((controller) => (
                                <div key={controller.cid} className="flex h-10 items-center gap-3">
                                    <ProfilePicture user={controller} size={40} />
                                    <p className="text-lg font-medium">
                                        {controller.first_name} {controller.last_name} ({controller.initials})
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Top Controllers</h2>
                        <div className="flex flex-col gap-5">
                            {topControllers.map((controller, i) => (
                                <div key={i} className="flex h-10 items-center gap-3">
                                    <LuTrophy size={35} className={TROPHY_COLORS[i]} />
                                    <div>
                                        <p className="-mb-1 text-lg font-medium">
                                            {controller.first_name} {controller.last_name}
                                        </p>
                                        <p className="text-slate-400">{formatDuration(controller.hours)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Top Positions</h2>
                        <div className="flex flex-col gap-5">
                            {topPositions.map((position, i) => (
                                <div key={position.position} className="flex h-10 items-center gap-3">
                                    <LuRadioTower size={35} className={TROPHY_COLORS[i]} />
                                    <div>
                                        <p className="-mb-1 text-lg font-medium">
                                            {getPositionName(position.position)}
                                        </p>
                                        <p className="text-slate-400">{formatDuration(position.hours)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </PageContent>
        </>
    );
};

export default Home;
