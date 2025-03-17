import React from 'react';
import Image from 'next/image';
import { type NextPage } from 'next';
import { Page } from '@/components/Page';
import { PageContent } from '@/components/PageContent';
import spotsImg from '@/img/kiah-brief/spots.png';
import turnsImg from '@/img/kiah-brief/turns.png';

export const metadata = { title: 'KIAH Pilot Briefing' };

const BushPilotBriefingPage: NextPage = async () => (
    <Page {...metadata}>
        <PageContent>
            <h2 className="mb-5 text-3xl font-medium">Welcome to George Bush Intercontinental Airport!</h2>
            <p className="mb-10">
                KIAH is the 2nd busiest airport in Texas and 15th busiest in the United States.
                Its 3 parallel East-West runways and 2 parallel NW-SE runways allow for high
                arrival and departure throughput with minimal delays in the terminal area.
                VATSIM pilots operating at IAH are encouraged to review this briefing
                to ensure a successful flight into or out of the airport.
            </p>

            <h2 className="mb-5 text-3xl font-medium">Airline Parking</h2>
            <p className="mb-3">
                While airlines usually operate out of specific gates/terminals in real life,
                no such requirements or operational limits exist on VATSIM.
                Below are the common real-world airline parking locations
                at IAH should you wish to mirror real world operations:
            </p>
            <table className="mb-3 w-full table-fixed">
                <thead>
                    <tr className="border-b-2 border-b-gray-200 dark:border-b-zinc-600">
                        <th className="px-2 py-1">Terminal A</th>
                        <th className="px-2 py-1">Terminal B</th>
                        <th className="px-2 py-1">Terminal C</th>
                        <th className="px-2 py-1">Terminal D</th>
                        <th className="px-2 py-1">Terminal E</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-b-gray-200 last:border-b-0 odd:bg-gray-200/25 dark:border-b-zinc-700 dark:odd:bg-zinc-600/25">
                        <td className="py-1 pl-2">
                            <ul className="ml-0 list-none">
                                <li>Air Canada Express</li>
                                <li>Alaska</li>
                                <li>American</li>
                                <li>American Eagle</li>
                                <li>Delta</li>
                                <li>Delta Connection</li>
                                <li>Frontier</li>
                                <li>Spirit</li>
                                <li>Sun Air</li>
                                <li>US Airways</li>
                                <li>United Express</li>
                            </ul>
                        </td>
                        <td className="py-1 pl-2">
                            <ul className="ml-0 list-none">
                                <li>United Express</li>
                            </ul>
                        </td>
                        <td className="py-1 pl-2">
                            <ul className="ml-0 list-none">
                                <li>United Express</li>
                                <li>United</li>
                            </ul>
                        </td>
                        <td className="py-1 pl-2">
                            <ul className="ml-0 list-none">
                                <li>Aeromexico</li>
                                <li>Air France</li>
                                <li>British Airways</li>
                                <li>Emirates</li>
                                <li>KLM</li>
                                <li>Lufthansa</li>
                                <li>Qatar Airways</li>
                                <li>Singapore</li>
                                <li>TACA</li>
                                <li>Turkish</li>
                                <li>VivaAerobus</li>
                            </ul>
                        </td>
                        <td className="py-1 pl-2">
                            <ul className="ml-0 list-none">
                                <li>United</li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p className="mb-10">
                General Aviation flights park at Signature (west side abeam 33L) or Atlantic (midpoint 33R).
                Most cargo flights originate and terminate at the East Cargo complex between the 26L and 26R arrival paths.
            </p>

            <h2 className="mb-5 text-3xl font-medium">Clearance Delivery</h2>
            <p className="mb-10">
                Clearances are given by Pre-Departure Clearance text messages as much as possible
                If you have a question about your clearance you may ask the relevant controller.
                Be sure to read your entire PDC as it will usually include your departure
                runway and additional important information.
                It is helpful to be squawking your assigned code with Mode-C on before calling for push and start.
            </p>

            <h2 className="mb-5 text-3xl font-medium">Ramp Control</h2>
            <p className="mb-3">
                IAH features a Ramp Control program run by United Airlines in the real world.
                Controllers on VATSIM simulate these ramp procedures as much as possible while online.
                As instructed in your Pre-Departure Clearance (PDC),
                pilots should contact the appropriate controller before pushing back at ANY terminal parking location.
                Ramp Control begins and ends at numbered spots surrounding the non-movement pavement area.
                Note that many simulator default sceneries do not include these markings,
                nor are they published on the FAA Airport Diagram.
                It is up to the pilot to locate and comply with controller instructions.
                <em> Navigraph/Jeppesen chart users can reference KIAH chart 70-9B.</em>
            </p>
            <div className="mb-5 lg:mx-auto lg:w-3/4">
                <Image
                    src={spotsImg}
                    alt="satellite image of KIAH with spot numbers"
                    className="mb-2 rounded-md shadow dark:shadow-stone-900"
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="text-center">
                        <ul className="ml-0 list-none">
                            <li>Spot 1 - RA short of WB</li>
                            <li>Spot 2 - RB short of WB</li>
                            <li>Spot 3 - RC short of WB</li>
                            <li>Spot 4 - Ramp short of NR</li>
                            <li>Spot 5 - Ramp short of NR</li>
                            <li>Spot 6 - NF short of NC</li>
                            <li>Spot 7 - ND short of NC</li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <ul className="ml-0 list-none">
                            <li>Spot 8 - Ramp short of ND</li>
                            <li>Spot 9 - NR short of ND</li>
                            <li>Spot 10 - NG short of NB</li>
                            <li>Spot 11 - NG short of NB</li>
                            <li>Spot 12 - NG short of NB</li>
                            <li>Spot 14 - NJ short of NB</li>
                            <li>Spot 15 - NJ short of NB</li>
                        </ul>
                    </div>
                    <div className="text-center">
                        <ul className="ml-0 list-none">
                            <li>Spot 16 - NJ short of NB</li>
                            <li>Spot 17 - NK short of NB</li>
                            <li>Spot 18/A - NK short of NB</li>
                            <li>Spot 19 - Ramp short of SF</li>
                            <li>Spot 20 - RB short of SF</li>
                            <li>Spot 21 - RA short of SF</li>
                            <li>Spot 22 - SC short of SB</li>
                        </ul>
                    </div>
                </div>
            </div>
            <h3 className="mb-3 text-xl font-medium">Examples</h3>
            <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                    <p className="italic">"Ramp, United 1464 at Gate B27 with information Alpha, ready for push."</p>
                    <p className="mb-2 font-bold">"United 1464, Houston Ramp, push and start to Spot 2 via Romeo Bravo."</p>
                    <p>
                        The aircraft is expected to push from their gate, start engines,
                        taxi to Spot 2 via taxiway Romeo Bravo and hold short of Whiskey Bravo at Spot 2.
                        On the way to or at the spot, the aircraft will be instructed to contact or monitor the Ground or Metering controller.
                    </p>
                </div>
                <div>
                    <p className="italic">"Ramp, United 455 at Gate C35 with information Sierra, ready for push."</p>
                    <p className="mb-2 font-bold">"United 455, Houston Ramp, push and start facing south, hold short of Romeo Bravo."</p>
                    <p>
                        The aircraft is expected to push from their gate, start engines,
                        and pull up to and hold short of Romeo Bravo to await additional instructions.
                        They will likely be given additional taxi instructions to a Spot where they will be handed off to Ground or Metering.
                    </p>
                </div>
            </div>

            <h2 className="mb-5 text-3xl font-medium">Ground Metering</h2>
            <p className="mb-10">
                During busy events, a Metering controller may be online to update pilots
                on any traffic management initiatives in effect for that flight or route.
                The Ramp controller will hand you off to Metering when applicable.
                If you are told to contact metering,
                check-in with your Spot number or location as well as the ATIS code you have on board.
                The Metering controller will hand you over to the appropriate Ground controller for sequencing to the runway.
            </p>

            <h2 className="mb-5 text-3xl font-medium">Ground Control</h2>
            <p className="mb-3">
                At this point, IAH functions like any other airport in the United States.
                Listen carefully to any instructions and comply as best you can.
                Note that all taxiways at IAH are double-lettered,
                which means taxi instructions can become quite a mouthful.
                Keep notes and cross-reference your airport diagrams as you proceed around the airport.
                Always feel free to ask the controller for clarification if you are unsure of your next move.
            </p>
            <p className="mb-10 text-center italic">
                "FedEx 455 Heavy, runway 15 left, taxi via Echo Bravo, November Bravo, November Echo, Whiskey Whiskey."
            </p>

            <h2 className="mb-5 text-3xl font-medium">Departure Turns</h2>
            <p className="mb-3">
                IAH departures often involve turns of more than 180 degrees off the departure end of the runway.
                It is very important that you listen for and comply with
                the <strong>direction of departure turn</strong> when reading back your take off clearance.
            </p>
            <p className="mb-3">
                Most aircraft autopilot systems will command a turn in the shortest direction when a heading is selected.
                This is not always the desired behavior when departing from IAH.
                The best way to ensure a smooth departure without conflicting with controller instructions
                or other traffic is to set an intermediate heading in the direction of the turn then,
                once the turn begins, continue to adjust the heading until the desired heading is selected.
            </p>
            <div className="lg:mx-auto lg:w-1/2">
                <Image
                    src={turnsImg}
                    alt="visual demonstration of proper departure turn procedure"
                    className="mb-2 rounded-md shadow  dark:shadow-stone-900"
                />
                <p className="italic">
                    Example: An aircraft departing from 15L is told to
                    turn <strong>right</strong> to heading 360 after departure.
                    Since the aircraft will be at heading 149 on the runway,
                    the shortest turn to heading 360 would be to the left.
                    In this case, the pilot should choose a westward heading (~270) to begin a right turn
                    then adjust the heading bug in the turn until 360 is selected.
                </p>
            </div>
        </PageContent>
    </Page>
);

export default BushPilotBriefingPage;
