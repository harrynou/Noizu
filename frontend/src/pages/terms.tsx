import React, { useState } from 'react';

const TermsPage: React.FC = (): JSX.Element => {
    const [activeSection, setActiveSection] = useState<string>('terms');
    
    // Function to handle section navigation
    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        // Scroll to top when changing sections
        window.scrollTo(0, 0);
    };
    
    // List of sections for the sidebar
    const sections = [
        { id: 'terms', title: 'Terms of Service' },
        { id: 'privacy', title: 'Privacy Policy' },
        { id: 'copyright', title: 'Copyright' },
        { id: 'acceptable-use', title: 'Acceptable Use' },
        { id: 'third-party', title: 'Third-Party Services' }
    ];

    return (
        <div className="container text-textPrimary mx-auto p-2 md:p-6 pb-24">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar navigation */}
                <aside className="md:w-1/4">
                    <div className="bg-gray-800 rounded-lg p-4 sticky top-20">
                        <h2 className="text-xl font-bold mb-4">Legal Information</h2>
                        <nav>
                            <ul className="space-y-2">
                                {sections.map((section) => (
                                    <li key={section.id}>
                                        <button
                                            onClick={() => handleSectionChange(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-md transition ${
                                                activeSection === section.id
                                                    ? 'bg-accentPrimary text-white'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            {section.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <p className="text-sm text-gray-400">
                                Last updated: April 10, 2025
                            </p>
                        </div>
                    </div>
                </aside>
                
                {/* Main content area */}
                <main className="md:w-3/4">
                    <div className="text-secondary rounded-lg p-6">
                        {activeSection === 'terms' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-8"><span className='bg-accentPrimary rounded-full px-6 py-3'>Terms of Service</span></h1>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>1. Acceptance of Terms</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        By accessing or using Noizu, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
                                    </p>
                                    <p className="text-gray-300">
                                        We reserve the right to modify these terms at any time, and changes will be effective immediately upon posting to the website. Your continued use of Noizu after any such changes constitutes your acceptance of the new Terms of Service.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>2. Account Registration</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        To access certain features of Noizu, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        You are responsible for safeguarding the password that you use to access Noizu and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>3. Authentication with Third-Party Services</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu allows you to authenticate using your Spotify and SoundCloud accounts. By connecting these accounts, you authorize Noizu to access your information from these platforms according to their respective terms and privacy policies.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        We only request the minimum necessary permissions to provide our service. You can revoke access to these platforms at any time through their respective settings.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>4. Service Usage</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu is provided "as is" without any guarantees or warranty. We make no promises about the reliability, availability, or continuity of our services.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        We reserve the right to modify, suspend, or discontinue Noizu or any part thereof at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>5. Content and Copyright</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu does not claim ownership of any content accessed through third-party services such as Spotify and SoundCloud. All music, album artwork, and related content remain the property of their respective owners.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        Any content that you create on Noizu, such as playlists, is subject to our Content Policy. You retain ownership of your original content, but grant us a license to use, modify, and display that content for the purpose of providing Noizu services.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>6. Termination</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We may terminate or suspend your account and access to Noizu immediately, without prior notice or liability, for any reason, including if you breach the Terms of Service.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        Upon termination, your right to use Noizu will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                                    </p>
                                </section>
                                
                                <section>
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>7. Contact Us</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        If you have any questions about these Terms of Service, please contact us at <a href="mailto:legal@Noizu.com" className="text-accentPrimary hover:underline">legal@Noizu.com</a>.
                                    </p>
                                </section>
                            </div>
                        )}
                        
                        {activeSection === 'privacy' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>1. Information We Collect</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We collect information that you provide directly to us, such as when you create an account, update your profile, or interact with features of our service. This may include your name, email address, and password.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        When you connect your Spotify or SoundCloud accounts, we collect information from these services, including your public profile information, playlists, and favorites. We only access the information necessary to provide our services.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        We automatically collect certain information when you use Noizu, including your IP address, browser type, operating system, referring URLs, access times, and pages viewed.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>2. How We Use Your Information</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We use the information we collect to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Provide, maintain, and improve our services</li>
                                        <li>Process and complete transactions</li>
                                        <li>Create and update your account</li>
                                        <li>Personalize your experience</li>
                                        <li>Communicate with you about service-related announcements</li>
                                        <li>Monitor and analyze trends, usage, and activities</li>
                                        <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                                    </ul>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>3. Sharing of Information</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                                        <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
                                        <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Noizu or others</li>
                                        <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company</li>
                                    </ul>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>4. Data Security</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. Any transmission of personal information is at your own risk.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>5. Your Choices</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        You may update, correct, or delete your account information at any time by logging into your account settings. If you wish to delete your account, please contact us.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        You can disconnect your Spotify or SoundCloud accounts at any time through your account settings. This will revoke our access to those services.
                                    </p>
                                </section>
                                
                                <section>
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>6. Changes to this Privacy Policy</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                                    </p>
                                </section>
                            </div>
                        )}
                        
                        {activeSection === 'copyright' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Copyright Policy</h1>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>1. Digital Millennium Copyright Act (DMCA)</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu respects the intellectual property rights of others and expects its users to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        If you believe that your content has been copied in a way that constitutes copyright infringement, please provide us with the following information:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
                                        <li>Identification of the copyrighted work claimed to have been infringed</li>
                                        <li>Identification of the material that is claimed to be infringing and where it is located on the service</li>
                                        <li>Your contact information, including your address, telephone number, and an email address</li>
                                        <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law</li>
                                        <li>A statement, made under penalty of perjury, that the above information is accurate, and that you are the copyright owner or are authorized to act on behalf of the owner</li>
                                    </ul>
                                    <p className="text-gray-300 mb-4">
                                        DMCA notices should be sent to <a href="mailto:copyright@Noizu.com" className="text-accentPrimary hover:underline">copyright@Noizu.com</a>.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>2. Noizu's Response to DMCA Notices</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Upon receiving a compliant DMCA notice, Noizu will promptly take the following actions:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Remove or disable access to the content identified in the notice</li>
                                        <li>Notify the user that we have removed or disabled access to the content</li>
                                        <li>Provide the user with a copy of the DMCA complaint</li>
                                        <li>Provide the user with information about submitting a counter-notice</li>
                                    </ul>
                                </section>
                                
                                <section>
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>3. Counter-Notices</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        If you believe that your content was removed or disabled by mistake or misidentification, you may send us a counter-notice. Your counter-notice must include:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Your physical or electronic signature</li>
                                        <li>Identification of the content that has been removed or to which access has been disabled and the location at which the content appeared before it was removed or disabled</li>
                                        <li>A statement under penalty of perjury that you have a good faith belief that the content was removed or disabled as a result of mistake or a misidentification</li>
                                        <li>Your name, address, telephone number, and email address</li>
                                        <li>A statement that you consent to the jurisdiction of the federal court in [Your Jurisdiction] and a statement that you will accept service of process from the person who provided notification of the alleged infringement</li>
                                    </ul>
                                    <p className="text-gray-300 mb-4">
                                        If we receive a counter-notice, we may send a copy to the original complainant informing them that we may restore the removed content in 10 business days. Unless the copyright owner files an action seeking a court order against the content provider, the removed content may be restored in 10 to 14 business days or more after receipt of the counter-notice.
                                    </p>
                                </section>
                            </div>
                        )}
                        
                        {activeSection === 'acceptable-use' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Acceptable Use Policy</h1>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>1. Prohibited Activities</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        You agree not to engage in any of the following prohibited activities:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Violating any laws, regulations, or third-party rights</li>
                                        <li>Using the service to transmit any material that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, invasive of another's privacy, or otherwise objectionable</li>
                                        <li>Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity</li>
                                        <li>Interfering with or disrupting the service or servers or networks connected to the service</li>
                                        <li>Attempting to gain unauthorized access to the service, other accounts, computer systems, or networks through hacking, password mining, or any other means</li>
                                        <li>Using any robot, spider, scraper, or other automated means to access the service or collect content for any purpose without our express written permission</li>
                                        <li>Encouraging or enabling any other individual to do any of the foregoing</li>
                                    </ul>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>2. Content Guidelines</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        You are solely responsible for any content that you create, upload, post, or share on Noizu. This includes playlist names, descriptions, and any comments or messages.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        The following types of content are prohibited:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Content that promotes hatred, violence, or discrimination against any group or individual</li>
                                        <li>Content that is sexually explicit, pornographic, or contains graphic violence</li>
                                        <li>Content that infringes upon the intellectual property rights of others</li>
                                        <li>Content that constitutes, encourages, or provides instructions for a criminal offense</li>
                                        <li>Content that contains viruses, malware, or other harmful code</li>
                                        <li>Content that is deceptive, misleading, or fraudulent</li>
                                    </ul>
                                </section>
                                
                                <section>
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>3. Enforcement</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        We reserve the right, but are not obligated, to remove or disable access to any content that violates these guidelines or our Terms of Service.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        Violations of this Acceptable Use Policy may result in:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Temporary or permanent removal of content</li>
                                        <li>Warning notifications</li>
                                        <li>Temporary suspension of your account</li>
                                        <li>Permanent termination of your account</li>
                                        <li>Legal action, if appropriate</li>
                                    </ul>
                                    <p className="text-gray-300 mb-4">
                                        If you believe that a user has violated this policy, please report it to <a href="mailto:support@Noizu.com" className="text-accentPrimary hover:underline">support@Noizu.com</a>.
                                    </p>
                                </section>
                            </div>
                        )}
                        
                        {activeSection === 'third-party' && (
                            <div>
                                <h1 className="text-2xl font-bold mb-6">Third-Party Services</h1>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>1. Overview</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu allows you to connect to third-party services such as Spotify and SoundCloud. These integrations enable you to access content from these platforms within our application.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        Your use of these third-party services is subject to their respective terms of service and privacy policies. We encourage you to review these documents before connecting your accounts.
                                    </p>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>2. Spotify Integration</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Our Spotify integration allows you to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Search for tracks, albums, artists, and playlists on Spotify</li>
                                        <li>Play Spotify content (requires a Spotify Premium account)</li>
                                        <li>Access your Spotify playlists and favorites</li>
                                        <li>Create and modify playlists on your Spotify account</li>
                                    </ul>
                                    <p className="text-gray-300 mb-4">
                                        To use these features, you must authorize Noizu to access your Spotify account. You can revoke this access at any time through your Spotify account settings.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        For more information about Spotify's terms and privacy policy, please visit:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li><a href="https://www.spotify.com/legal/end-user-agreement/" className="text-accentPrimary hover:underline" target="_blank" rel="noopener noreferrer">Spotify Terms of Service</a></li>
                                        <li><a href="https://www.spotify.com/legal/privacy-policy/" className="text-accentPrimary hover:underline" target="_blank" rel="noopener noreferrer">Spotify Privacy Policy</a></li>
                                    </ul>
                                </section>
                                
                                <section className="mb-8">
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>3. SoundCloud Integration</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Our SoundCloud integration allows you to:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li>Search for tracks, playlists, and artists on SoundCloud</li>
                                        <li>Play SoundCloud content</li>
                                        <li>Access your SoundCloud likes and playlists</li>
                                    </ul>
                                    <p className="text-gray-300 mb-4">
                                        To use these features, you must authorize Noizu to access your SoundCloud account. You can revoke this access at any time through your SoundCloud account settings.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        For more information about SoundCloud's terms and privacy policy, please visit:
                                    </p>
                                    <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
                                        <li><a href="https://soundcloud.com/terms-of-use" className="text-accentPrimary hover:underline" target="_blank" rel="noopener noreferrer">SoundCloud Terms of Use</a></li>
                                        <li><a href="https://soundcloud.com/pages/privacy" className="text-accentPrimary hover:underline" target="_blank" rel="noopener noreferrer">SoundCloud Privacy Policy</a></li>
                                    </ul>
                                </section>
                                
                                <section>
                                    <h2 className="text-xl font-notbold mb-4"><span className='bg-accentSecondary rounded-lg p-2'>4. Disclaimer</span></h2>
                                    <p className="text-gray-300 mb-4">
                                        Noizu is not affiliated with, endorsed by, or sponsored by Spotify or SoundCloud. All trademarks, service marks, trade names, and logos are the property of their respective owners.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        We do not guarantee the availability, reliability, or functionality of these third-party services. Noizu may be affected by changes to their APIs, terms of service, or business practices.
                                    </p>
                                    <p className="text-gray-300 mb-4">
                                        In the event that a third-party service becomes unavailable or changes in a way that affects Noizu, we will make reasonable efforts to adapt our application accordingly, but we cannot guarantee continuous or uninterrupted access to these services.
                                    </p>
                                </section>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TermsPage;