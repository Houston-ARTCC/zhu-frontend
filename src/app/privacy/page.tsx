import React from 'react';
import { NextPage } from 'next';
import { Disclaimer } from '@/components/static/Disclaimer';

export const metadata = { title: 'Houston ARTCC: Privacy Policy' };

const PrivacyPolicy: NextPage = () => (
    <div className="container mx-auto mt-56 px-20 py-16">
        <h2 className="mb-5 text-3xl font-medium">Information We Collect</h2>
        <p className="mb-3">
            To help enhance the Virtual Houston ARTCC experience, we collect information across a series of products and
            services all to enhance the end user's experience. We collect information in the following ways:
        </p>
        <ul className="mb-10">
            <li>
                <b>Information you give us.</b> When you register an account with VATSIM and transfer to Virtual Houston
                ARTCC, login to the Virtual Houston ARTCC service, take a quiz, use our Computer Based Training (CBT)
                system, or participate in the forums, information that is generally considered personal is given to us
                from you and VATSIM to include, but is not limited to: your name and email address.
            </li>
            <li>
                <b>Information we get from you.</b> Some other information is passed by your computer or electronic
                device, web browser, and VATSIM client. Information can include: your IP address, web browser type and
                version, device specific information (such as operating system, unique device identifiers and mobile
                network information). This information may be linked to your account.
            </li>
            <li>
                <b>Log Information.</b> Each time you perform an action on Virtual Houston ARTCC services, your action
                is logged. Information logged can include: type of action, data being sent and received, IP address the
                request originated from, software used to make the request, identification cookies, and the reslits of
                the request.
            </li>
            <li>
                <b>Location Information.</b> Your location information may be associated with each request through
                geolocation against the originating IP address, information given to us by you or given to us by you
                through VATSIM.
            </li>
            <li>
                <b>Analytical Information.</b> Via Google Analytics, we may collect anonymized statistical information
                to include: age, gender, location, device information, web browser type and version, ISPs, mobile
                network provider information, etc. for the purposes of identifying trends and better target our
                platforms.
            </li>
            <li>
                <b>Storage Location.</b> Data is stored and encrypted on services owned or leased by Virtual Houston
                ARTCC within the United States.
            </li>
        </ul>

        <h2 className="mb-5 text-3xl font-medium">Information Usage</h2>
        <p className="mb-3">
            To help enhance the Virtual Houston ARTCC experience, we collect information across a series of products and
            services all to enhance the user experience.
        </p>
        <p className="mb-3">We use the information collected to provide, maintain, protect and improve our services.</p>
        <p className="mb-3">
            The information we collect is maintained with confidentiality to the extent possible. The following
            information is shared with Virtual Houston ARTCC associated facilities:
        </p>
        <ul className="mb-3">
            <li>VATSIM CERT Identification Number (CID)</li>
            <li>Your name</li>
            <li>Your VATSIM achievements and ratings</li>
            <li>Your VATSIM associated email address</li>
            <li>Virtual Houston ARTCC facility associations, VATSIM region and division associations</li>
            <li>Virtual Houston ARTCC staff associations and Virtual Houston ARTCC staff email addresses</li>
        </ul>
        <p className="mb-3">The following information may be shared publicly:</p>
        <ul className="mb-3">
            <li>VATSIM CERT Identification Number (CID)</li>
            <li>Your name</li>
            <li>Virtual Houston ARTCC staff associations and Virtual Houston ARTCC staff email addresses</li>
            <li>Virtual Houston ARTCC facility associations, VATSIM region and division associations</li>
            <li>VATSIM achievements and ratings</li>
        </ul>
        <p className="mb-3">
            The following information is collected and may be used to protect our services, up to and including
            cooperation with legal requests for information from Law Enforcement agencies:
        </p>
        <ul className="mb-3">
            <li>The above listed public information,</li>
            <li>All IP addresses used and associated with your account</li>
            <li>Geolocation against aforementioned IP addresses</li>
            <li>Activities performed with the Virtual Houston ARTCC web services</li>
            <li>
                We may store identification tokens and other limited information on your electronic device through web
                storage or cookie usage.
            </li>
        </ul>
        <p className="mb-10">
            We may store identification tokens and other limited information on your electronic device through web
            storage or cookie usage.
        </p>

        <h2 className="mb-5 text-3xl font-medium">Who We Share With</h2>
        <p className="mb-3">The information we collect may be shared, in limited capacities, with the following:</p>
        <ul className="mb-3">
            <li>
                Virtual Air Traffic Simulation Network (<a href="https://vatsim.net/">www.vatsim.net</a>)
            </li>
            <li>
                VATUSA (<a href="https://vatusa.net/">www.vatusa.net</a>)
            </li>
            <li>Other Virtual Houston ARTCC partners</li>
            <li>Law Enforcement agencies</li>
            <li>Google Analytics</li>
        </ul>
        <p className="mb-10">For more information on what is shared with whom, please see "How We Use Information".</p>

        <h2 className="mb-5 text-3xl font-medium">Cookie Usage</h2>
        <p className="mb-3">
            We use various technologies to collect and store information when you visit and use a Virtual Houston ARTCC
            service. This may include a cookie or other similar technologies to identify your browser or device. We also
            use Google Analytics to help analyze the traffic to our websites and the information may be linked, by
            Google Analytics, with customers for information across multiple websites.
        </p>
        <p className="mb-3">
            Our cookies are mainly used as a means of tracking virtual users across the Virtual Houston ARTCC domain.
            This allows us to know who is requesting and using our services, provide authentication and authorization
            checks to restricted areas.
        </p>
        <p className="mb-10">
            You may choose to disable cookie usage via your browser, but know that doing so will prevent access and use
            across restricted areas of the website and severely degrade your experience.
        </p>

        <h2 className="mb-5 text-3xl font-medium">Opt Out</h2>
        <p className="mb-3">
            Given the nature of our services, it is not possible to opt out of data collection and use our services. But
            if you desire to opt out and no longer desire to use our services, we will purge all information we have
            collected upon written request.
        </p>
        <p className="mb-3">
            The first step is to deactivate and request VATSIM to purge your data. Please head to
            <a href="https://membership.vatsim.net/">membership.vatsim.net</a> to do so.
        </p>
        <p className="mb-3">
            After VATSIM has purged your data, please send a written request to Virtual Houston ARTCC's Air Traffic
            Manager by emailing <a href="mailto:atm@zhuartcc.org">atm@zhuartcc.org</a>. It is a manual process, so
            please allow up to 30 days for information to be purged. You will receive an email response once the data
            has been purged.
        </p>
        <p className="mb-16">
            Note Virtual Houston ARTCC cannot guarantee that information collected by parties outside of Virtual Houston
            ARTCC will be purged in the process.
        </p>

        <Disclaimer />
    </div>
);

export default PrivacyPolicy;
