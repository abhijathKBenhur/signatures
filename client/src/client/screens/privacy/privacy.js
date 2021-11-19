import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronRight, ChevronLeft } from "react-feather";
import PDFFile from "../../../assets/documents/privacy.pdf";
import { ListGroup } from "react-bootstrap";
import "./privacy.scss"
const Help = () => {
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);
  return (
    <div className="main-content-component container privacy">
      <span className="father-grey color-secondary">Privacy document</span>
      <>
        <div className="privacy-body">
          {/* <div className="father-grey color-secondary mb-4">FAQs</div> */}
          <div>
            <p>IdeaTribe (“IdeaTribe,” “we” or “us”) is committed to protecting your privacy. We have prepared this Privacy Policy to describe to you our practices regarding the Personal Data (as defined below) we collect from users of our website, located at <a href="https://ideatribe.io/">https://IdeaTribe.io</a>(the “Site”) and online services (collectively, the “Service”).</p>
          </div>
          <div>
          <ul className="numbered-list">
            <li>
                <div>
                  <div> Types of Data We Collect. “Personal Data” means data that allows someone to identify or contact you, including, for example, your name, address, telephone number, e-mail address, as well as any other non-public information about you that is associated with or linked to any of the foregoing data. “Anonymous Data” means data, including aggregated and de-identified data, that is not associated with or linked to your Personal Data; Anonymous Data does not, by itself, permit the identification of individual persons. We collect Personal Data and Anonymous Data, as described below. </div>
                </div>
                <ul className="alphabet-list">
                  <li>
                    <div>
                      <div> InformationYouProvideUs. </div>
                      <ul className="roman-list">
                        <li> We may collect Personal Data from you, such as your first and last name, e-mail and mailing addresses, Ethereum address, and IdeaTribe password when you create an account to log in to our network (“Account”). </li>
                        <li> If you use our Services on your mobile device, we may collect your phone number and the unique device id number. </li>
                        <li> Our Service lets you store preferences like how your content is displayed, your location, safe search settings, notification settings, and favorite widgets. We may associate these choices with your ID, browser or mobile device, and you can edit these preferences at any time. </li>
                        <li> When connecting to our Services via a service provider that uniquely identifies your mobile device, we may receive this identification and use it to offer extended services and/or functionality. </li>
                        <li> Certain Services, such as two-factor authentication, may require our collection of your phone number. We may associate that phone number to your mobile device identification information. </li>
                        <li> If you provide us feedback or contact us via e-mail, we will collect your name and e-mail address, as well as any other content included in the e-mail, in order to send you a reply. </li>
                        <li> We also collect other types of Personal Data that you provide to us voluntarily, such as your operating system and version, product registration number, Polygon Network address, and other requested information if you contact us via e-mail regarding support for the Services. </li>
                        <li> We may also collect Personal Data at other points in our Service that state that Personal Data is being collected. </li>
                      </ul>
                    </div>
                  </li>
                  <li> 
                    <div>
                      <div> InformationCollectedviaTechnology.Asyounavigatethroughand interact with our Service, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions and patterns, including: </div>
                      <ul className="roman-list">
                        <li> <p><span className="underline">Information Collected by Our Servers.</span> To make our Service more useful to you, our servers (which may be hosted by a third party service provider) collect information from you, including your browser type, operating system, Internet Protocol (“IP”) address (a number that is automatically assigned to your computer when you use the Internet, which may vary from session to session), domain name, Polygon Network address, wallet type, and/or a date/time stamp for your visit. </p></li>
                        <li> <p><span className="underline">Log Files.</span> As is true of most websites, we may gather certain information automatically and store it in log files. This information includes IP addresses, browser type, Internet service provider (“ISP”), referring/exit pages, operating system, date/time stamp, and clickstream data. We use this information to analyze trends, administer the Service, track users’ movements around the Service, gather demographic information about our user base as a whole, and better tailor our Services to our users’ needs. For example, some of the information may be collected so that when you visit the Service, it will recognize you and the information could then be used to serve advertisements and other information appropriate to your interests. </p></li>
                        <li> <p><span className="underline">Cookies.</span> Like many online services, we use cookies to collect information. “Cookies” are small pieces of information that a website sends to your computer’s hard drive while you are viewing the website. We may use both session Cookies (which expire once you close your web browser) and persistent Cookies (which stay on your computer until you delete them) to provide you with a more personal and interactive experience on our Service. This type of information is collected to make the Service more useful to you and to tailor the experience with us to meet your special interests and needs. </p></li>
                        <li> <p><span className="underline">Pixel Tag.</span> In addition, we may use “Pixel Tags” (also referred to as clear Gifs, Web beacons, or Web bugs). Pixel Tags are tiny graphic images with a unique identifier, similar in function to Cookies, that are used to track online movements of Web users. In contrast to Cookies, which are stored on a user’s computer hard drive, Pixel Tags are embedded invisibly in Web pages. Pixel Tags also allow us to send e-mail messages in a format users can read, and they tell us whether e-mails have been opened to ensure that we are sending only messages that are of interest to our users. We may use this information to reduce or eliminate messages sent to a user. We do not tie the information gathered by Pixel Tags to our users’ Personal Data. </p></li>
                        <li> <p><span className="underline">Analytics Services.</span> In addition to the tracking technologies we place, other companies may set their own cookies or similar tools when you visit our Service. This includes third party analytics services, including but not limited to Google Analytics (“Analytics Services”), that we engage to help analyze how users use the Service. We may receive reports based on these parties’ use of these tools on an individual or aggregate basis. We use the information we get from Analytics Services only to improve our Service. The information generated by the Cookies or other technologies about your use of our Service (the “Analytics Information”) is transmitted to the Analytics Services. The Analytics Services use Analytics Information to compile reports on user activity. The Analytics Services may also transfer information to third parties where required to do so by law, or where such third parties process Analytics Information on their behalf. Each Analytics Services’ ability to use and share Analytics Information is restricted by such Analytics Services’ Terms of Use and Privacy Policy. By using our Service, you consent to the processing of data about you by Analytics Services in the manner and for the purposes set out above. For a full list of Analytics Services, please contact us at contact@ideatribe.io. </p></li>
                      </ul>
                    </div> 
                  </li>
                  <li> Information Collected from Third Party Companies. We may receive Personal and/or Anonymous Data about you from companies that provide our Services by way of a co-branded or private-labeled website or companies that offer their products and/or services on our Service. In particular, MetaMask and other wallets provide us with your Polygon address and certain other information you choose to share with MetaMask and other wallets. These third party companies may supply us with Personal Data. We may add this to the information we have already collected from you via our Service in order to improve it. We do not collect Personal Data automatically, but we may tie the information that we collect automatically to Personal Data about you that we collect from other sources or that you provide to us. </li>
                </ul>
              </li>
            <li> 
              <div> 
                <div> Use of Your Personal Data </div>
                <ul className="alphabet-list"> 
                  <li> 
                    <div> 
                      <div> GeneralUse.Ingeneral,PersonalDatayousubmittousisusedeither to respond to requests that you make, or to aid us in serving you better. We may use your Personal Data in the following ways: </div>
                      <ul className="roman-list"> 
                        <li> facilitate the creation of and secure your Account on our network; </li>
                        <li> identify you as a user in our system; </li>
                        <li> provide improved administration of our Service; </li>
                        <li> <p>provide the Services you request, including but not limited to facilitating your cryptocurrency transactions through MetaMask (<a href="https://metamask.io/">https://metamask.io</a>) or other wallets; </p></li>
                        <li> improve the quality of experience when you interact with our Service; </li>
                        <li> send you a welcome e-mail to verify ownership of the e-mail address provided when your Account was created; </li>
                        <li> protect you and other users from any conduct that violates the Terms of Use or to prevent abuse or harassment of any user; </li>
                        <li> display your username next to the digital assets you wish to sell, license, auction, collaborate on or keep on the Website; </li>
                        <li> send you administrative e-mail notifications, such as security or support and maintenance advisories; </li>
                        <li> send you e-mail notifications related to actions on Service, including notifications of offers on your digital assets; </li>
                        <li> respond to your inquiries related to employment opportunities or other requests; </li>
                        <li> make telephone calls to you, from time to time, as a part of secondary fraud protection or to solicit your feedback; </li>
                        <li> in any other way we may describe when you provide the Personal Data; and </li>
                        <li> send newsletters, surveys, offers, and other promotional materials related to our Services and for other marketing purposes of IdeaTribe. </li>
                      </ul>
                      <div> We may use your Personal Data to contact you about our own and third parties’ goods and services that may be of interest to you. </div>
                    </div>
                  </li>
                  <li> AnonymousData.WemaycreateAnonymousDatarecordsfrom Personal Data by excluding information (such as your name) that makes the data personally identifiable to you. We use this Anonymous Data to analyze request and usage patterns so that we may enhance the content of our Services and improve Service navigation. We reserve the right to use Anonymous Data for any purpose and to disclose Anonymous Data to third parties without restriction. </li>
                </ul>
              </div>
            </li>
            <li> 
              <div> 
                <div> Disclosure of Your Personal Data. We disclose your Personal Data as described below and as described elsewhere in this Privacy Policy. </div>
                <ul className="alphabet-list">
                  <li> ThirdPartyServiceProviders.WemayshareyourPersonalDatawith third party service providers to: provide you with the Services that we offer you through our Service; to conduct quality assurance testing; to facilitate creation of accounts; to provide technical support; and/or to provide other services to the IdeaTribe. </li>
                  <li> Affiliates.WemaysharesomeorallofyourPersonalDatawithour parent company, subsidiaries, joint ventures, or other companies under a common control (“Affiliates”), in which case we will require our Affiliates to honor this Privacy Policy. </li>
                  <li> Corporate Restructuring. We may share some or all of your Personal Data in connection with or during negotiation of any merger, financing, acquisition or dissolution transaction or proceeding involving sale, transfer, divestiture, or disclosure of all or a portion of our business or assets. In the event of an insolvency, bankruptcy, or receivership, Personal Data may also be transferred as a business asset. If another company acquires our company, business, or assets, that company will possess the Personal Data collected by us and will assume the rights and obligations regarding your Personal Data as described in this Privacy Policy. </li>
                  <li> AsLegallyRequired.Regardlessofanychoicesyoumakeregarding your Personal Data (as described below), IdeaTribe may disclose Personal Data if it believes in good faith that such disclosure is necessary (a) in connection with any legal investigation; (b) to comply with relevant laws or to respond to subpoenas or warrants served on IdeaTribe; (c) to protect or defend the rights or property of IdeaTribe or users of the Service; and/or (d) to investigate or assist in preventing any violation or potential violation of the law, this Privacy Policy, or our Terms of Use. </li>
                  <li> Other Disclosures. We may also disclose your Personal Data, to fulfill the purpose for which you provide it; for any other purpose disclosed by us when you provide it; or with your consent. We do not sell your Personal Data. </li>
                </ul>
              </div>
            </li>
            <li> Third Party Websites. Our Service may contain links to third party websites. When you click on a link to any other website or location, you will leave our Service and go to another site, and another entity may collect Personal Data or Anonymous Data from you. We have no control over, do not review, and cannot be responsible for, these outside websites or their content. Please be aware that the terms of this Privacy Policy do not apply to these outside websites or content, or to any collection of your Personal Data after you click on links to such outside websites. We encourage you to read the privacy policies of every website you visit. The links to third party websites or locations are for your convenience and do not signify our endorsement of such third parties or their products, content or websites. </li>
            <li> <p>Third-Party Wallet Extensions. For conducting cryptocurrency transactions we use third-party electronic wallet extensions such as (but not limited to) MetaMask; your interactions with MetaMask and/or any third-party electronic wallet extensions are governed by the applicable privacy policies. In the case of MetaMask, its privacy policy is available <a href="https://metamask.io/privacy.html">here.</a></p></li>
            <li> 
              <div> 
                <div> Your Choices Regarding Information. You have several choices regarding the use of information on our Services: </div>
                <ul className="alphabet-list"> 
                  <li> EmailCommunications.Wewillperiodicallysendyoufree,opt-in newsletters and e-mails that directly promote the use of our Service. We may send you occasional service related communications, including notices of updates to our Terms of Use or Privacy Policy. </li>
                  <li> IfyoudecideatanytimethatyounolongerwishtoacceptCookies from our Service for any of the purposes described above, then you can instruct your browser, by changing its settings, to stop accepting Cookies or to prompt you before accepting a Cookie from the websites you visit. Consult your browser’s technical information. If you do not accept Cookies, however, you may not be able to use all portions of the Service or all functionality of the Service. If you have any questions about how to disable or modify Cookies, please let us know at the address given in paragraph (1). </li>
                </ul>
              </div>
            </li>
            <li> Data Access and Control. You can view, access, edit, or delete your personal data for many aspects of the Service via your account settings page. You can also make choices about IdeaTribe's use of your data. You can always choose whether you want to receive marketing communications from us. You can also opt out from receiving marketing communications from us by using the opt-out link on the communication, or by visiting your account settings page. We may retain an archived copy of your records as required by law or for legitimate business purposes. You can modify your Personal Data on your account. </li>
            <li> Data Retention. We may retain your Personal Data as long as you continue to use the Service, have an account with us, or for as long as is necessary to fulfill the purposes outlined in this Privacy Policy. You can ask to close your account by contacting us as described above, and we will delete your Personal Data on request. We may, however, retain Personal Data for an additional period as is permitted or required under applicable laws, for legal, tax, or regulatory reasons, or for legitimate and lawful business purposes. </li>
            <li> Data Protection. We care about the security of your information and use physical, administrative, and technological safeguards to preserve the integrity and security of all information collected through our website. However, no security system is impenetrable and we cannot guarantee the security of our systems 100%. In the event that any information under our control is compromised as a result of a breach of security, we will take steps to investigate the situation and, where appropriate, notify those individuals whose information may have been compromised and take other steps, in accordance with any applicable laws and regulations. </li>
            <li> A Note About Children. We do not intentionally gather Personal Data from visitors who are under the age of 13. If a child under 13 submits Personal Data to IdeaTribe and we learn that the Personal Data is the information of a child under 13, we will attempt to delete the information as soon as possible. If you believe that we might have any Personal Data from a child under 13, please contact us at the address indicated in Section 1 above. </li>
            <li> A Note to Users Outside of the United States. If you are a non-U.S. user of the Service, by visiting the Service and providing us with data, you acknowledge and agree that your Personal Data may be processed for the purposes identified in the Privacy Policy. In addition, your Personal Data may be processed in the country in which it was collected and in other countries, including the United States, where laws regarding processing of Personal Data may be less stringent than the laws in your country. By providing your data, you consent to such transfer. </li>
            <li> 
              <p>Changes to This Privacy Policy. This Privacy Policy may be updated from time to time for any reason. We will notify you of any changes to our Privacy Policy by posting the new Privacy Policy at 
              <a className="ml-1" href="https://opensea.io/privacy"> https://IdeaTribe.io/privacy. </a> 
              The date the Privacy Policy was last revised is identified at the beginning of this Privacy Policy. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our Service and this Privacy Policy to check for any changes. </p>
            </li>
            <li>Questions; Contacting IdeaTribe; Reporting Violations. If you have any questions or concerns or complaints about our Privacy Policy or our data collection or processing practices, or if you want to report any security violations to us, please contact us at the following address: 16192 Coastal Highway, Lewes, Delaware 19958, County of Sussex.</li>
          </ul>
          </div>
        </div>  
       </>
    </div>
    // <>
    // <Document
    //       file={PDFFile}
    //       className="pdf-document"
    //       onLoadSuccess={onDocumentLoadSuccess}
    //     >
    //       <Page pageNumber={pdfPages.currentPage} />
    //     </Document>
    // </>
  );
};

export default Help;
