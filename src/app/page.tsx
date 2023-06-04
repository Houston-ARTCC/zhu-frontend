import React from 'react';
import { NextPage } from 'next';
import { LuRadioTower, LuTrophy } from 'react-icons/lu';
import Image from 'next/image';
import { Badge } from '@/components/Badge';
import { AnnouncementCard, EventCard } from '@/components/Card';
import { HomepageBanner } from '@/components/static/HomepageBanner';
import { Disclaimer } from '@/components/static/Disclaimer';
import { getPositionName } from '@/utils/facilities';
import { formatDuration } from '@/utils/time';
import { type BasicUser } from '@/types/users';
import { type Event } from '@/types/events';
import { type Announcement } from '@/types/announcements';
import { type OnlineConnection, type TopController, type TopPosition } from '@/types/connections';

export const metadata = { title: 'Welcome to Houston ARTCC!' };

const TROPHY_COLORS = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];

async function getOnlineConnection(): Promise<OnlineConnection[]> {
    return fetch('https://api.zhuartcc.org/api/connections/online/', {
        next: { revalidate: 60 },
    }).then((res) => res.json());
}

async function getRecentAnnouncements(): Promise<Announcement[]> {
    return fetch('https://api.zhuartcc.org/api/announcements/recent/', {
        cache: 'no-store',
    }).then((res) => res.json());
}

async function getUpcomingEvents(): Promise<Event[]> {
    const data: Event[] = await fetch('https://api.zhuartcc.org/api/events/', {
        cache: 'no-store',
    }).then((res) => res.json());

    return data.filter((event) => !event.hidden).slice(0, 2);
}

async function getNewestControllers(): Promise<BasicUser[]> {
    const data: BasicUser[] = await fetch('https://api.zhuartcc.org/api/users/newest/', {
        next: { revalidate: 60 },
    }).then((res) => res.json());

    return data.slice(0, 3);
}

async function getTopControllers(): Promise<TopController[]> {
    const data: TopController[] = await fetch('https://api.zhuartcc.org/api/connections/top/controllers/', {
        next: { revalidate: 60 },
    }).then((res) => res.json());

    return data.slice(0, 3);
}

async function getTopPositions(): Promise<TopPosition[]> {
    const data: TopPosition[] = await fetch('https://api.zhuartcc.org/api/connections/top/positions/', {
        next: { revalidate: 60 },
    }).then((res) => res.json());

    return data.slice(0, 3);
}

const Home: NextPage = async () => {
    const onlineConnections = await getOnlineConnection();
    const recentAnnouncements = await getRecentAnnouncements();
    const upcomingEvents = await getUpcomingEvents();
    const newestControllers = await getNewestControllers();
    const topControllers = await getTopControllers();
    const topPositions = await getTopPositions();

    return (
        <>
            <HomepageBanner />
            <main className="container mx-auto px-20 py-16">
                <div className="mb-16 grid grid-cols-2 gap-10">
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
                    <div className="ml-auto min-w-[50%]">
                        <h2 className="mb-5 text-3xl font-medium">Who's Online?</h2>
                        <div className="flex flex-col gap-3">
                            {onlineConnections.length === 0 && <p>Nobody is online.</p>}
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

                <div className="mb-16 grid grid-cols-2 gap-10">
                    <div>
                        <h2 className="text-3xl font-medium">Announcements</h2>
                        <h3 className="mb-5 font-medium text-slate-400">What's happening at Houston?</h3>
                        <div className="flex flex-col gap-5">
                            {recentAnnouncements.map((announcement) => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-medium">Events</h2>
                        <h3 className="mb-5 font-medium text-slate-400">Are y'all busy?</h3>
                        <div className="flex flex-col gap-5">
                            {upcomingEvents.length === 0 && <p>There are no published events, check back later.</p>}
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-16 grid grid-cols-3 gap-10">
                    <div>
                        <h2 className="mb-5 text-3xl font-medium">Newest Controllers</h2>
                        <div className="flex flex-col gap-5">
                            {newestControllers.map((controller) => (
                                <div key={controller.cid} className="flex h-10 items-center gap-3">
                                    <Image
                                        className="rounded-full bg-slate-300"
                                        src={`https://api.zhuartcc.org${controller.profile}`}
                                        alt={`${controller.first_name} ${controller.last_name}`}
                                        height={40}
                                        width={40}
                                    />
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
                <Disclaimer />
            </main>
        </>
    );
};

export default Home;
