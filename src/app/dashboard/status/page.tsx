import React, { type PropsWithChildren } from 'react';
import type { NextPage } from 'next';
import { format } from 'date-fns-tz';
import { addMonths, getQuarter, startOfQuarter } from 'date-fns';
import { LuCheckCircle, LuHelpCircle, LuMinusCircle, LuXCircle } from 'react-icons/lu';
import classNames from 'classnames';
import { Card } from '@/components/Card';
import { fetchApi } from '@/utils/fetch';
import type { UserStatusStatistics } from '@/types/connections';

const Explain: React.FC<PropsWithChildren> = ({ children }) => (
    <button className="group relative ml-auto" type="button">
        <span className="flex items-center gap-1 text-gray-600">
            Explain
            <LuHelpCircle />
        </span>
        <Card
            className={classNames(
                'pointer-events-none absolute right-0 z-10 w-[40rem] text-left opacity-0 !duration-200',
                'group-hover:opacity-100 group-focus:opacity-100',
            )}
        >
            {children}
        </Card>
    </button>
);

async function getQuarterlyStatus(): Promise<UserStatusStatistics> {
    return fetchApi(
        '/connections/statistics/status/',
        { cache: 'no-store' },
    );
}

const QuarterlyStatus: NextPage = async () => {
    const status = await getQuarterlyStatus();

    const quarter = startOfQuarter(new Date());

    const houTier1 = status.endorsements.hou_twr || status.endorsements.hou_gnd;
    const iahTier1 = status.endorsements.iah_twr || status.endorsements.iah_gnd;
    const i90Tier1 = status.endorsements.i90;

    return (
        <>
            <div className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                    {status.rating === 'OBS'
                        ? <LuMinusCircle size={25} className="text-slate-400" />
                        : status.quarter_active
                            ? <LuCheckCircle size={25} className="text-green-400" />
                            : <LuXCircle size={25} className="text-red-400" />}
                    <h3 className="text-2xl font-medium">General Controlling Activity</h3>
                    <Explain>
                        <p className="mb-3">
                            Any home or visiting controller that holds a rating of S1, S2, S3, C1, or C3
                            is expected to control for a minimum of <b>three (3) hours</b> during each quarter.
                        </p>
                        <p>
                            Any person holding a staff position within the Houston ARTCC (i.e. ATM, DATM, TA, EC, FE, WM, assistant,
                            instructor, mentor) is expected to control for a minimum of <b>six (6) hours</b> during each quarter.
                        </p>
                    </Explain>
                </div>
                {status.rating === 'OBS' ? (
                    <p>
                        Since you hold an OBS rating, you are exempt from this requirement and are instead
                        expected to fulfill the <b>Training Activity</b> requirements to remain active.
                    </p>
                ) : (
                    <>
                        <p className="mb-1">
                            Based on your roles, you are expected to control for
                            {' '}
                            <b>{status.quarter_quota === '06:00' ? 'six (6)' : 'three (3)'} hours</b>.
                            Below are your hours for each month of the current quarter:
                        </p>
                        <table className="border-separate border-spacing-x-3 border-spacing-y-0.5">
                            <tbody>
                                <tr>
                                    <th className="text-right">{format(quarter, 'MMMM')}</th>
                                    <td className="font-mono text-sm">{status.month_1_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">{format(addMonths(quarter, 1), 'MMMM')}</th>
                                    <td className="font-mono text-sm">{status.month_2_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">{format(addMonths(quarter, 2), 'MMMM')}</th>
                                    <td className="font-mono text-sm">{status.month_3_hours ?? '00:00'}</td>
                                </tr>
                                <tr />
                                <tr>
                                    <th className="text-right">Quarter {getQuarter(new Date())} Total</th>
                                    <td className="font-mono text-sm">{status.quarter_hours ?? '00:00'} / {status.quarter_quota}</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <div className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                    {(!houTier1 && !iahTier1 && !i90Tier1)
                        ? <LuMinusCircle size={25} className="text-slate-400" />
                        : status.t1_active
                            ? <LuCheckCircle size={25} className="text-green-400" />
                            : <LuXCircle size={25} className="text-red-400" />}
                    <h3 className="text-2xl font-medium">Tier 1 Currency</h3>
                    <Explain>
                        <p className="mb-3">
                            Any home or visiting controller who holds any tier one endorsement is expected to
                            control for at least <b>three (3) hours</b> on their highest endorsed position(s).
                        </p>
                        <ul>
                            <li>
                                For controllers with ground or local tier one endorsements at <i>either</i> HOU or IAH,
                                all three hours must be spent staffing the highest endorsed position at that airport.
                            </li>
                            <li>
                                For controllers with ground or local tier one endorsements at <i>both</i> HOU and IAH,
                                at least one hour must be spent staffing the highest endorsed position at each airport.
                            </li>
                            <li>
                                For controllers with a I90 TRACON tier one endorsement,
                                all three hours must be spent staffing any I90 TRACON position.
                                Satisfying this requirement also satisfies the HOU and IAH currency requirements.
                            </li>
                            <li>
                                For controllers with a center tier two endorsement,
                                tier one currency may be met by providing top-down coverage of the I90 airspace.
                            </li>
                        </ul>
                    </Explain>
                </div>
                {(!houTier1 && !iahTier1 && !i90Tier1) ? (
                    <p>Since you do not hold any tier one or tier two endorsements, you are not subject to this requirement.</p>
                ) : (
                    <>
                        <p className="mb-3">
                            You are expected to control tier one positions for <b>three (3) hours</b>.
                            {' '}
                            {status.endorsements.zhu ? (
                                <>
                                    Since you hold a ZHU tier two endorsement, tier one currency is
                                    calculated from time spent controlling any I90 TRACON or Houston Center position.
                                </>
                            ) : i90Tier1 ? (
                                <>
                                    Since you hold an I90 tier one endorsement, tier one currency is
                                    calculated from time spent controlling any I90 TRACON position.
                                </>
                            ) : (houTier1 && iahTier1) ? (
                                <>
                                    Since you hold both HOU and IAH tier one endorsements, tier one currency
                                    is calculated from time spent controlling your highest endorsed position at each airport.
                                    Additionally, you are expected to control for at least one hour at each airport.
                                </>
                            ) : (
                                <>
                                    Since you only hold an {iahTier1 ? 'IAH' : 'HOU'} tier one endorsement, tier one currency
                                    is calculated from time spent controlling your highest endorsed position at {iahTier1 ? 'IAH' : 'HOU'}.
                                </>
                            )}
                        </p>
                        <table className="border-separate border-spacing-x-3 border-spacing-y-0.5">
                            <tbody>
                                <tr>
                                    <th className="text-right">HOU GND</th>
                                    <td className="font-mono text-sm">{status.hou_gnd_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">HOU TWR</th>
                                    <td className="font-mono text-sm">{status.hou_twr_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">IAH GND</th>
                                    <td className="font-mono text-sm">{status.iah_gnd_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">IAH TWR</th>
                                    <td className="font-mono text-sm">{status.iah_twr_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">I90</th>
                                    <td className="font-mono text-sm">{status.i90_hours ?? '00:00'}</td>
                                </tr>
                                <tr>
                                    <th className="text-right">ZHU</th>
                                    <td className="font-mono text-sm">{status.zhu_hours ?? '00:00'}</td>
                                </tr>
                                <tr />
                                <tr>
                                    <th className="text-right">Tier 1 Total</th>
                                    <td className="font-mono text-sm">{status.t1_hours ?? '00:00'} / 03:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            <div className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                    {status.rating !== 'OBS'
                        ? <LuMinusCircle size={25} className="text-slate-400" />
                        : status.training_active
                            ? <LuCheckCircle size={25} className="text-green-400" />
                            : <LuXCircle size={25} className="text-red-400" />}
                    <h3 className="text-2xl font-medium">Training Activity</h3>
                    <Explain>
                        <p>
                            Any home controller who does not hold an S1 rating is expected to
                            complete at least <b>three (3) hours</b> of training during each quarter.
                        </p>
                    </Explain>
                </div>
                {status.rating !== 'OBS' ? (
                    <p>
                        Since you hold an {status.rating} rating, you are exempt from this requirement and
                        are instead expected to fulfill the <b>General Controlling Activity</b> and,
                        if applicable, <b>Tier 1 Currency</b> requirements to remain active.
                    </p>
                ) : (
                    <p>
                        This quarter, you have completed
                        {' '}
                        <b className="font-mono text-sm">{status.training_hours ?? '00:00'}</b>
                        {' / '}
                        <b className="font-mono text-sm">03:00</b>
                        {' '}
                        hours of training.
                    </p>
                )}
            </div>
        </>
    );
};

export default QuarterlyStatus;
