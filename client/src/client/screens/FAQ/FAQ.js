import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronRight, ChevronLeft } from "react-feather";
import PDFFile from "../../../assets/documents/FAQs.pdf";
import "./faq.scss"
const FAQ = () => {
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };

  const [accordianState, setAccordianState] = useState([]);


  const faqs = [
    {
      no: 1,
      title: "What is IdeaTribe?",
      content: ["IdeaTribe is a blockchain-based platform to mint Ideas and make them real. Users can capture their inspiration and store it on the blockchain as proof of original thought. Then, they can collaborate with others in the community to enhance, produce, finance and market the final product resulting from that moment of inspiration."]
    },
    {
      no: 2,
      title: "What is Blockchain?",
      content: ["Blockchain is a technology that creates immutable records. Any information put in theblockchain is stored forever and cannot be changed. This feature helps us store originalIdeas with time and location stamp, which helps users establish priority of their Idea.", "Blockchain is also an effective way to create smart contracts, which get executedautomatically when certain conditions are met. This quality ensures that all partiesinvolved in a transaction are protected."]
    },
    {
      no: 3,
      title: "What is an Idea in IdeaTribe?",
      content: ["In IdeaTribe, an Idea can be an original thought, not yet fully formed but holds thepromise of something more substantial. So, an Idea can be the seed of a story, aninvention, a meme, a song or a perspective. It can also be a work in progress or afinished product - like a unique artwork, business plan, blueprint of an invention or aresearch paper.", "An Idea can be minted on IdeaTribe at any stage of its maturity. We enable users toupdate their Idea as it evolves and mint afresh, maintaining the history of the Idea."]
    },
    {
      no: 4,
      title: "What is Gas fee?",
      content: ["Gas is the name of the transaction amount paid to the blockchain to register a record onthe blockchain. It is paid in the currency of each particular blockchain. In the case ofIdeaTribe, Gas fee is paid is Matic.", "Matic can be bought on any crypto-exchange like Coinbase, <Other names> andtransferred to your Metamask wallet. You will need Matic in your Metamask account tomint Ideas and enter into smart contracts in IdeaTribe."]
    },
    {
      no: 5,
      title: "Why did you choose Polygon blockchain?",
      content: ["We had 3 reasons to choose Polygon blockchain for IdeaTribe."],
      item: [
        "We wanted a blockchain whose Gas fees were affordable. Polygon has some of thelowest Gas fees among all blockchains.",
        "We wanted a credible blockchain with a large number of users. With blockchaintechnology becoming increasingly popular, the market is replete with blockchains thatare untested or expensive. Polygon is one of the most popular blockchains withhundreds of millions of users and yet, inexpensive Gas fees.",
        "We wanted a blockchain that operates on Proof-of-Stake not Proof-of-Work.Blockchains use a consensus mechanism to ensure that data is not hacked.Proof-of-Stake and Proof-of-Work are 2 consensus mechanisms that are popularlyused. Proof-of-Work is significantly more energy intensive than Proof-of-Stake.Polygon fits this requirement well."
      ]
    },
    {
      no: 6,
      title: "Does minting an Idea on IdeaTribe mean that it is legally protected?",
      content: ["No. Minting an Idea on IdeaTribe does not imply that it is legally protected.", "However, the record of having minted an Idea on the blockchain at a certain time isadmissible in a court of law."]
    },
    {
      no: 7,
      title: "Does minting an Idea on IdeaTribe mean that I do not have to file for patent orcopyright?",
      content: ["No. Minting an Idea on IdeaTribe is NOT a substitute for filing patents or copyright.However, minting an Idea on IdeaTribe can be used as proof that an original Idea wasconceived at a certain time and location."]
    },
    {
      no: 8,
      title: "Isn’t blockchain bad for the environment?",
      content: ["Not necessarily. While some of the older blockchains like Bitcoin are known to consumea lot of energy for computing, newer blockchains that use Proof-of-Stake consensusmodels are substantially more efficient. IdeaTribe is built on Polygon, which is aProof-of-Stake blockchain."]
    },
    {
      no: 9,
      title: "What is the value of TribeGold?",
      content: ["Tribers can earn TribeGold for at least the following:"],
      item: ["Minting Ideas", "Referring friends who mint Ideas", "Getting upvotes for their Ideas"],
      afterItem: "The specific amount of TribeGold for these will vary with time. IdeaTribe will also addmore activities for which Tribers can earn TribeGold."
    },
    {
      no: 10,
      title: "How can I spend TribeGold?",
      content: ["Our vision is to enable Tribers to use TribeGold to do the following:"],
      item: ["Use TribeGold to pay for high quality collaborations and services.", "Invest TribeGold in Ideas that they believe have high potential of success and impact."],
      afterItem: "We are still working on these features and will release them when we are ready!"
    }
  ]
  const changeAccordianState = (item) => {
    accordianState[item.no] = !accordianState[item.no];
    setAccordianState({...accordianState})
  }

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);
  return (
    <div className="main-content-component container faq d-flex">
      <>
        {/* <p className="page-container text-center cursor-pointer">
          <ChevronLeft
            className={pdfPages.currentPage === 1 ? "disable" : ""}
            onClick={() =>
              setPdfPages({
                ...pdfPages,
                currentPage: pdfPages.currentPage - 1,
              })
            }
          />
          Page {pdfPages.currentPage} of {pdfPages.totalPages}
          <ChevronRight
            className={
              pdfPages.currentPage === pdfPages.totalPages ? "disable" : ""
            }
            onClick={() =>
              setPdfPages({
                ...pdfPages,
                currentPage: pdfPages.currentPage + 1,
              })
            }
          />
        </p> */}

        <div className="faq-body">
        <div className="father-grey color-secondary mb-4">FAQs</div>
        {faqs.map(item => (
          <div>
            <div className="faq-title" onClick={(e) => changeAccordianState(item)}> 
              <span className="mr-2"> {item.no} . </span>
              <span> {item.title} </span>
            </div>
            {!accordianState[item.no] && item.content && item.content.map(res=> (<div className="faq-content ml-4"> {res} </div>))}
            {!accordianState[item.no] && item.item && item.item.map((sub, index) => (<div className="faq-content ml-4"> {index + 1}. {sub} </div>))}
            {!accordianState[item.no] && <div className="faq-content ml-4"> {item.afterItem} </div>}
          </div>
        ))}
        </div>
        {/* <Document
          file={PDFFile}
          className="pdf-document"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={pdfPages.currentPage} />
        </Document> */}
      </>
    </div>
  );
};

export default FAQ;
