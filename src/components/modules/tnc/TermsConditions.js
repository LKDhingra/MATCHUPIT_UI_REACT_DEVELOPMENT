import React from 'react';
import './tnc.css';
import Navbar from '../../shared/navbar/Navbar';
import Footer from '../../shared/footer/Footer';

class TermsConditions extends React.Component {
    render() {
        return (
            <div id="TermsConditions">
                <Navbar />
                <div className="container" style={{ marginTop: '70px' }}>
                    <div className="text-center">
                        <h3>Terms Of Use</h3>
                    </div>
                    <div className="panel-group" id="accordion">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse1">1. Introduction</a>
                                </h4>
                            </div>
                            <div id="collapse1" className="panel-collapse collapse in">
                                <div className="panel-body">
                                    <div className="card-body">
                                        <p>
                                            Matchup IT is a platform that is built and owned by EnSignis Digital LLC., 8000 Avalon Blvd., Suite 100, Alpharetta, GA 30009. The mission of this platform is to – (i) connect the world’s technology professionals and help to collaborate with communities (ii) Companies to search right and genuine talent to add to their workforce. Effectively, this platform brings IT professionals and Companies together. The matchup IT platform is designed to provide opportunity for IT professionals to improve their value by sharing knowledge in the form of white papers/blogs. They can also attach documents (text, picture, and video). Individual professionals can also search companies to find opportunities to work in those companies and connect directly with them. Companies can benefit by having a database of potentially millions of IT professionals that can be searched against their needs. They can also find out the location where there are cluster of desired skills.
                                        </p>
                                        <br/>
                                        <h4>1.1 Contract</h4>
                                        <p>
                                            When you use our platform, you agree to all these terms and subject to our <a href="/privacy-policy" target="_blank" style={{marginRight:"unset", textDecoration:"underline"}}>Privacy Policy</a>, which covers how we collect, use, share, and store your personal information.
                                        </p>
                                        <p>
                                            You agree that by registering on matchup IT (by clicking  “Join matchupIT” or “Sign Up” ) or similar, registering, accessing or using our platform, you are to entering into a legally binding agreement  with matchupIT owned by EnSignis Digital LLC  (even if you are using our Services on behalf of a company). If you do not agree to this contract (“Contract” or Agreement”), do not click “Sign Up” (or similar) and do not access or otherwise use our platform. If you wish to terminate this contract, at any time you can do so by closing your account and no longer accessing or using our platform
                                        </p>
                                        {/* <p>
                                            <b>Services</b><br/>
                                            This Contract applies to MatchupIT.com, MatchupIT-branded appsand other MatchupIT-related sites, apps, communications and other services that state that they are offered under this Contract (“Services”), including the offsite collection of data for those Services, such as our ads and the “Apply with MatchupIT” and “Share with MatchupIT” plugins. Registered users of our Services are “Members” and unregistered users are “Visitors”.
                                        </p> */}
                                        <p>
                                            <b>MatchupIT Platform</b><br/>
                                            You are entering into this Contract with MatchupIT.com  that is owned by EnSignis Digital LLC. (also referred to as “we” and “us”). Registered users of our platform are “ Individual Members” and “Corporate Members”. This Contract applies to both members,
                                            <br/>
                                            As a Member or just a visitor of our platform, the collection, use and sharing of your personal data is subject to this Privacy policy (which includes referenced in this Privacy Policy) and updates.
                                        </p>
                                        <br/>
                                        <h4>1.2 Members</h4>
                                        <p>
                                            When you register and join the MatchupIT platform, you become a Member. If you have chosen not to pay to for services provided by our platform, you may have limited access to certain basic features on our platform.
                                        </p>
                                        <br/>
                                        <h4>1.3 Change</h4>
                                        <p>
                                            We may modify/update/change this Contract, and our Privacy Policy, from time to time. In case of material changes to the contract, we will notify you and provide you the opportunity to review the changes before they become effective. We agree that changes cannot be retroactive. If you object to any changes, you may choose to close your account. Your continued use of our platform after we publish or send a notice about our changes to these terms means that you are consenting to the updated terms as of their effective date.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse2">2. Obligations</a>
                                </h4>
                            </div>
                            <div id="collapse2" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        You must comply with all applicable laws as well as with the Agreement, as may be amended from time to time with or without advance notice.
                                    </p>
                                    <br/>
                                    <h4>2.1 Eligibility</h4>
                                    {/* <p>Here are some promises that you make to us in this Contract:</p> */}
                                    <p>
                                        You are eligible to enter this Contract and you are at least our “Minimum Age” (18 years or older) threshold.  The services on the platform are not for use by anyone under the age of 18.
                                    </p>
                                    <p>
                                        To use features on our platform, you agree that:
                                    </p>
                                    <p>(1) You must be the “Minimum Age” (defined above).</p>
                                    <p>(2) You will only have one MatchupIT account, which must be in your real name.</p>
                                    <p>(3) You are not already restricted by MatchupIT from using the platform. Creating an account with false information is a violation of our terms, including accounts registered on behalf of others or persons under the age of 18.</p>
                                    <p>(4) Will only maintain one matchup IT account at any given time – you may access that from corporate or Individual level.</p>
                                    <p>(5) Have full power and authority to enter this contract and doing so will not violate any other agreement to which you are a party.</p>
                                    <p>(6) Will not violate any rights of matchup IT including intellectual property rights.</p>
                                    <br/>
                                    <h4>2.2 Your Account</h4>
                                    <p>You will keep your password a secret.</p>
                                    <p>
                                        You will not share an account with anyone else and will follow our rules and the law.<br/>
                                        Members are account holders. You agree to: 
                                    </p>
                                    <p>(1) Use a strong password and keep it confidential.</p>
                                    <p>(2) Not transfer your account and </p>
                                    <p>(3) Follow the law. You are responsible for anything that happens through your account unless you close it or report misuse.</p>
                                    <p>As between you and others (including your employer), your account belongs to you. However, if the certain were purchased by another party for you to use, the party paying for such features has the right to control access to and get reports on your use of such paid feature; however, they do not have rights to your personal account.</p>
                                    <br/>
                                    <h4>2.3 Payment</h4>
                                    <p>You will honor your payment obligations and you are okay with us storing your payment information. We use third party secured services to keep the financial data. You understand that there may be fees and taxes that are added to our prices.</p>
                                    <p>
                                        Refunds are subject to our policy.<br/>
                                        Also, you agree that:
                                        <ul>
                                            <li>(1) Your subscription purchase may be subject to foreign exchange fees or differences in prices based on location (e.g. exchange rates).</li>
                                            <li>(2) We may store and continue billing your payment method (e.g. credit card) even after it has expired, to avoid interruptions in your services.</li>
                                            <li>(3) Your payment method automatically will be charged at the start of each subscription period for the fees and taxes applicable to that period. To avoid future charges, cancel before the renewal date.</li>
                                            <li>(4) We may calculate taxes payable by you based on the billing information that you provide us at the time of purchase.</li>
                                        </ul>
                                    </p>
                                    <br/>
                                    <h4>2.4 Notices and Messages</h4>
                                    <p>
                                    We will be providing notices and messages to you through our websites, apps, and contact information.<br/>
                                    You agree that we will provide notices and messages to you in the following ways:  
                                    </p>
                                    <p>(1) Within the Service, or </p>
                                    <p>(2) Sent to the contact information you provided us (e.g., email, mobile number, physical address).</p>
                                    <p>You agree to keep your contact information up to date. In case your contact information is out of date, you may miss out on important notices.</p>
                                    <br/>
                                    <h4>2.5 Sharing</h4>
                                    <p>
                                        When you share information on our others, others can see and copy your information. Some part of the data that you wish to keep it hidden from everyone will not show or presented to business or community member. Our platform allows messaging and sharing of information in many ways, such as your profile, articles, group posts, pictures, videos, or any other content that you have shared. We have made settings available; we will honor the choices you make about what content or information (e.g., message content to your addressees, sharing content only to MatchupIT corporate members restricting your profile visibility to other individuals within community.
                                    </p>
                                    <p>We are not obligated to publish any information or content on our platform and can remove it with or without notice.</p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse3">3. Rights and Limits</a>
                                </h4>
                            </div>
                            <div id="collapse3" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <h4>3.1. Your License to MatchupIT</h4>
                                    <p>
                                        You own all the content, and personal information you provide to us, but you also grant us a non-exclusive license to it. We will honor the choices you make about who gets to see your information and content. As between you and MatchupIT, you own the content and information that you submit or post to the platform, and you are only granting MatchupIT and our affiliates the following non-exclusive license:
                                        A worldwide, transferable and sublicensable right to use, copy, modify, distribute, publish and process, information and content that you provide through our platform and the services of others (in case other services are provided) without any further consent, notice and/or compensation to you or others. These rights are limited in the following ways:
                                    </p>
                                    <p>(1) You can end this license for specific content by deleting such content from our platform, or generally by closing your account, except (a) to the extent you shared it with others as part of the services provided by the platform and they copied, re-shared it or stored it and (b) for the reasonable time it takes to remove from backup and other systems.</p>
                                    <p>(2) We will not include your content in any advertisements for the products and services of third parties to others without your separate consent.</p>
                                    <p>(3) Because you own your content and information and we only have non-exclusive rights to it, you may choose to make it available to others.</p>
                                    <p>
                                        You and MatchupIT agree that if content includes personal data, it is subject to our <a href="/privacy-policy" target="_blank" style={{marginRight:"unset", textDecoration:"underline"}}>Privacy Policy</a>.<br/>
                                        You and MatchupIT agree that we may access, store, process and use any information and personal data that you provide in accordance with, the terms of the <a href="/privacy-policy" target="_blank" style={{marginRight:"unset", textDecoration:"underline"}}>Privacy Policy</a> and your choices (including settings).<br/>
                                        By submitting suggestions or other feedback regarding our platform features to MatchupIT, you agree that MatchupIT can use and share (but does not have to) such feedback for any purpose without compensation to you.
                                    </p>
                                    <p>
                                        You promise to only provide information and content that you have the right to share, and that your MatchupIT profile will be truthful.
                                    </p>
                                    <p>
                                        You agree to only provide content or information that does not violate the law nor anyone’s rights (including intellectual property rights). You also agree that your profile information will be truthful. MatchupIT may be required by law to remove certain information or content in certain countries.
                                    </p>
                                    <br/>
                                    <h4>3.2 Feature Availability</h4>
                                    <p>
                                        We may change, suspend, or discontinue any of our feature on the platform. We may also modify our prices effective prospectively upon reasonable notice to the extent allowed under the law.
                                    </p>
                                    <p>We do not promise to store or keep showing any information and content that you have posted.</p>
                                    <p>You agree that we have no obligation to store, maintain or provide you a copy of any content or information that you or others provide, except to the extent required by applicable law and as noted in our Privacy Policy.</p>
                                    <br/>
                                    <h4>3.3 Other Content, Sites and Apps</h4>
                                    <p>
                                        Your use of others’ content and information posted on our platform, is at your own risk.<br/>
                                        Others may offer their own information through our platform, and we are not responsible for those third-party activities.<br/>
                                        By using matchupIT,  you may encounter content or information that might be inaccurate, incomplete, delayed, misleading, illegal, offensive, or otherwise harmful. MatchupIT generally does not review content provided by our subscribed members. You agree that we are not responsible for others’ (including other Members’) content or information. We cannot always prevent this misuse of our services on the platform, and you agree that we are not responsible for any such misuse.
                                    </p>
                                    <br/>
                                    <h4>3.4 Limits</h4>
                                    <p>
                                        We have the right to limit how you connect and interact within your chosen communities on our platform.<br/>
                                        MatchupIT reserves the right to limit your use of the services, including the number of posts (including use of video and pictures) and number of communities you can connect to. MatchupIT reserves the right to restrict, suspend, or terminate your account if you breach this Contract or the law or are misusing any feature/service of the platform.
                                    </p>
                                    <br/>
                                    <h4>3.5 Intellectual Property Rights</h4>
                                    <p>
                                        MatchupIT reserves all its intellectual property rights. Trademarks and logos used in connection to providing services are the trademarks of their respective owners. MatchupIT logo, any specific service marks, graphics, and logos used for our services are trademarks or registered trademarks of MatchupIT and EnSignis Digital LLC.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse4">4. Disclaimer and Limit of Liability</a>
                                </h4>
                            </div>
                            <div id="collapse4" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <h4>4.1 Disclaimer</h4>
                                    <p>
                                        MATCHUPIT AND ENSIGNIS DIGITAL LLC MAKE NO REPRESENTATION OR WARRANTY ABOUT THE SERVICES, INCLUDING ANY REPRESENTATION THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, AND PROVIDE THE SERVICES (INCLUDING CONTENT AND INFORMATION) ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE FULLEST EXTENT PERMITTED UNDER APPLICABLE LAW, MATCHUPIT AND ITS AFFILIATES DISCLAIM ANY IMPLIED OR STATUTORY WARRANTY, INCLUDING ANY IMPLIED WARRANTY OF TITLE, ACCURACY OF DATA, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                                    </p>
                                    <p>
                                        TO THE FULLEST EXTENT PERMITTED BY LAW, MATCHUPIT, ITS PARENT COMPANY ENSIGNIS DGITAL, WILL NOT BE LIABLE IN CONNECTION WITH THIS CONTRACT FOR LOST PROFITS OR LOST BUSINESS OPPORTUNITIES, REPUTATION (E.G., OFFENSIVE OR DEFAMATORY STATEMENTS), LOSS OF DATA (E.G., DOWN TIME OR LOSS, USE OF, OR CHANGES TO, YOUR INFORMATION OR CONTENT) OR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL OR PUNITIVE DAMAGES.
                                    </p>
                                    <p>
                                        NEITHER MATCHUPIT OR ENSIGNIS DIGITAL, EMPLOYEES, SHAREHOLDERS, OR DIRECTORS SHALL BE LIABLE FOR (a) ANY DAMAGES IN EXCESS OF 4 TIMES THE MOST RECENT MONTHLY FEE THAT YOU PAID OR USD 50 (FOR INDIVIDUAL) OR USD 1000 (FOR CORPORATE), WHICEVER AMOUNT IS GREATER. OR (b) ANY SPEACIAL INCIDENTAL, INDIRECT, PUNITIVE OR CONSEQUENTIAL DAMAGES OR LOSS OF USE, PROFIT, REVENUE OR DATA TO YOU OR ANY THIRD PARTY ARISING FROM YOUR USE OF THE SERVICE, ANY PLATFORM APPLICATIONS OR ANY OF THE CONTENT OR OTHER MATERIALS ON, ACCESSED THROUGH OR DOWNLOADED FROM MATCHUPIT.
                                    </p>
                                    <br/>
                                    <h4>4.2 Limitation of Liability</h4>
                                    <p>
                                        APPLY REGARDLESS OF WHETHER (1) YOU BASE YOUR CLAIM ON CONTRACT, TORT, STATUE OR ANYOTHER LEGAL THEORY, (2) WE KNEW OR SHOULD HAVE KNOWN ABOUT POSSIBILITY OF SUCH DAMAGES, OR (3) THE LIMITED REMEDIES PROVIDED IN THIS SECTION FOIL OF THEIR ESSENTIAL PURPOSE AND NOT APPLY TO ANY DAMAGE THAT MATCHUPIT MAY CAUSE YOU INTENTIONALLY OF KNOWNIGLY IN VOILATION OF THIS AGREEMENT OR APPLICABLE LAW, OR AS OTHERWISSE MANDATED BY APPLICABLE LAW THAT CAN NOT BE DISCLAIMED FROM IN THIS AGREEMENT.
                                    </p>
                                    <p>
                                        NOT APPLY TO LIABILITY FOR DEATH OR PERSONAL INJURY OR FOR FRAUD, GROSS NEGLIGENCE OR INTENTIONAL MISCONDUCT, OR IN CASES OF NEGLIGENCE WHERE A MATERIAL OBLIGATION HAS BEEN BREACHED, A MATERIAL OBLIGATION BEING SUCH WHICH FORMS A PREREQUISITE TO OUR DELIVERY OF SERVICES AND ON WHICH YOU MAY REASONABLY RELY, BUT ONLY TO THE EXTENT THAT THE DAMAGES WERE DIRECTLY CAUSED BY THE BREACH AND WERE FORESEABLE UPON CONCLUSION OF THIS CONTRACT AND TO THE EXTENT THAT THEY ARE TYOICAL IN THE ONTEXT OF THIS CONTRACT.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse5">5. Termination</a>
                                </h4>
                            </div>
                            <div id="collapse5" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        Both you and MatchupIT may terminate this Contract at any time with notice to the other. On termination, you lose the right to access or use the platform. The following shall survive termination:
                                    </p>
                                    <p>(1) Our rights to use and disclose your feedback.</p>
                                    <p>(2) Subscribers rights to further re-share content and information you shared using platform.</p>
                                    <p>(3) Sections 4, 6, 7, and 8.2 of this contract.</p>
                                    <p>(4) Any amounts owed by either party prior to termination remain owed after termination.</p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse6">6. Governing Law</a>
                                </h4>
                            </div>
                            <div id="collapse6" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        In the unlikely event we end up in a legal dispute, you and MatchupIT agree to resolve it in Georgia courts using Georgia law.<br/>
                                        This section shall not deprive you of any mandatory consumer protections under the law of the country to which we direct Services to you, where you have your habitual residence.<br/>
                                        For others outside who live outside of the United States: You and MatchupIT agree that the laws of the State of Georgia, U.S.A., excluding its conflict of laws rules, shall exclusively govern any dispute relating to this Contract and/or the Services. You and MatchupIT both agree that all claims and disputes can be litigated only in the federal or state courts in Fulton County, Georgia, USA, and you and MatchupIT each agree to personal jurisdiction in those courts.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse7">7. General Terms</a>
                                </h4>
                            </div>
                            <div id="collapse7" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        Here are some important details about the Contract.<br/>
                                        If a court with authority over this Contract finds any part of it unenforceable, you and we agree that the court should modify the terms to make that part enforceable while still achieving its intent. If the court cannot do that, you and we agree to ask the court to remove that unenforceable part and still enforce the rest of this Contract.
                                    </p>
                                    <p>This Contract (including additional terms that may be provided by us when you engage with a feature of the Services) is the only agreement between us regarding the Services and supersedes all prior agreements for the Services.</p>
                                    <p>If we do not act to enforce a breach of this Contract, that does not mean that MatchupIT has waived its right to enforce this Contract. You may not assign or transfer this Contract (or your membership or use of Services) to anyone without our consent. However, you agree that MatchupIT may assign this Contract to its affiliates or a party that buys it without your consent. There are no third-party beneficiaries to this Contract.</p>
                                    <p>You agree that the only way to provide us legal notice is at the addresses provided in Section 10.</p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse8">8. Dos and Dont's</a>
                                </h4>
                            </div>
                            <div id="collapse8" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        MatchupIT is a community of IT professionals.<br/>
                                        This list of “Dos and Don’ts” along with our limit what you can and can’t do on our platform.
                                    </p>
                                    <h4>8.1. Dos</h4>
                                    <p>
                                        <b>You agree that you will:</b>
                                        <ol type="a">
                                            <li>Comply with all applicable laws, including, without limitation, privacy laws, intellectual property laws, anti-spam laws, export control laws, tax laws, and regulatory requirements.</li>
                                            <li>Provide accurate information to us and keep it updated.</li>
                                            <li>Use your real name on your profile; and</li>
                                            <li>Use the Services in a professional manner.</li>
                                        </ol>
                                    </p>
                                    <br/>
                                    <h4>8.2. Don’ts</h4>
                                    <p>
                                        <b>You agree that you will not:</b>
                                        <ol type="a">
                                            <li>Create a false identity on MatchupIT, misrepresent your identity, create a Member profile for anyone other than yourself (a real person), or use or attempt to use another’s account.</li>
                                            <li>Develop, support or use software, devices, scripts, robots or any other means or processes (including crawlers, browser plugins and add-ons or any other technology) to scrape the Services or otherwise copy profiles and other data from the Services.</li>
                                            <li>Override any security feature or bypass or circumvent any access controls or use limits of the Service (such as caps on keyword searches or profile views).</li>
                                            <li>Copy, use, disclose or distribute any information obtained from the Services, whether directly or through third parties (such as search engines), without the consent of MatchupIT.</li>
                                            <li>Disclose information that you do not have the consent to disclose (such as confidential information of others (including your employer)).</li>
                                            <li>Violate the intellectual property rights of others, including copyrights, patents, trademarks, trade secrets or other proprietary rights. For example, do not copy or distribute (except through the available sharing functionality) the posts or other content of others without their permission, which they may give by posting under a Creative Commons license.</li>
                                            <li>Post anything that contains software viruses, worms, or any other harmful code.</li>
                                            <li>Reverse engineer, decompile, disassemble, decipher, or otherwise attempt to derive the source code for the Services or any related technology that is not open source.</li>
                                            <li>Imply or state that you are affiliated with or endorsed by MatchupIT without our express consent (e.g., representing yourself as an accredited MatchupIT trainer).</li>
                                            <li>Deep link to our Services for any purpose other than to promote your profile or a Group on our Services, without MatchupIT’s consent.</li>
                                            <li>Use bots or other automated methods to access the Services, add or download contacts, send, or redirect messages.</li>
                                            <li>Monitor the Services’ availability, performance, or functionality for any competitive purpose.</li>
                                            <li>Engage in “framing,” “mirroring,” or otherwise simulating the appearance or function of the Services.</li>
                                            <li>Overlay or otherwise modify the Services or their appearance (such as by inserting elements into the Services or removing, covering, or obscuring an advertisement included on the Services).</li>
                                            <li>Interfere with the operation of, or place an unreasonable load on, the Services (e.g., spam, denial of service attack, viruses, gaming algorithms); and/or</li>
                                        </ol>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse9">9. Complaints Regarding Content</a>
                                </h4>
                            </div>
                            <div id="collapse9" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        Contact information for complaint about content provided by our Members.<br/>
                                        We respect the intellectual property rights of others. We require that information posted by Members be accurate and not in violation of the intellectual property rights or other rights of third parties.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#accordion" href="#collapse10">10. Contact Information</a>
                                </h4>
                            </div>
                            <div id="collapse10" className="panel-collapse collapse">
                                <div className="panel-body">
                                    <p>
                                        Our Contact information.<br/>
                                        For general inquiries, you may contact us contact@matchupit.com. For legal notices or service of process, you may write us at this address:
                                    </p>
                                    <p>
                                        8000 Avalon Blvd., Suite 100,<br/>
                                        Alpharetta, GA 30009
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }

}

export default TermsConditions