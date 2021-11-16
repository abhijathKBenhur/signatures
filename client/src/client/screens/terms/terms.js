import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronRight, ChevronLeft } from "react-feather";
import PDFFile from "../../../assets/documents/whitepaper.pdf";
import src from "../../../assets/images/terms.png";
import { Image } from "react-bootstrap";
import "./terms.scss"
const Help = () => {
  const [pdfPages, setPdfPages] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPdfPages({ ...pdfPages, totalPages: numPages });
  };


  const tableContent = ["Abstract", "The Inspiration", "What is an Idea?", "The Product", "TribeGold [TRBG]", "TribeGold Minting Policy", "Earning TribeGold", "Spending TribeGold", "Conclusion"]
  const terms = [
    {
      title: "Abstract",
      content: ["To imagine new worlds and to profit from that imagination, is a uniquely human quality. We callthese imagined worlds, Ideas.", "History is after all, a series of Ideas being realized in the real world. But while everyone has them,few are able to craft and market Ideas to a wider audience - perhaps because most of us are our ownworst critics and because many of us do not have the resources to carry an Idea from inspiration tomarket. Even among Ideas that have found a market, many are orphaned because nobodyremembers their creator.", "All this is set to change. With blockchain, it is possible to capture the genesis of an Idea, that momentof inspiration and save it for eternity. Ideators will be remembered forever.", "Blockchain also enables smart contract-based collaboration between various people who arerequired to improve, produce, finance and market an Idea. Since these transactions are automated,decentralized and executed without human agency, the speed, efficiency and transparency withwhich Ideas can be realized is unprecedented.", "IdeaTribe.io is a blockchain-based community of ideators and collaborators, where Ideas are minted,nurtured, developed and taken to market."],
      note: ["This whitepaper is provided for informational purposes only and does not and will not createany legally binding obligation on the authors or on any third party. For specific legal terms governingthe use of the IdeaTribe.io website, please view the Terms of Use here: <Link to T&C>"]
    },
    {
      title: "The Inspiration",
      content: ["The story of humanity is the story of Ideas. We are a prolific species when it comes to inventing newways of doing things. From inventing the wheel and painting on cave walls to sending satellites intodeep space; from yodelling to creating symphonies; from bartering goods to creating sophisticatedbusiness models; from imagining Universes built on turtles to theorizing about space-time continuaand quantum particles – we have progressed, an idea at a time.",
                "Ideating is a creative process. Ideators know the thrill of inspiration and the ecstasy of creation. But itis also rewarding in material ways. There is money to be made with Ideas – not just for the ideatorbut also for people who help make them real. Every community in history has had a marketplacewhere people can collaborate on Ideas - enhance, productionize, finance and market them - forprofit. This is the Idea Supply Chain. It starts with the ideator and ends with the consumer, theultimate beneficiary of the value of an Idea. Over time however, the Idea Supply Chain has becomemore sophisticated and as with many large complex systems, less equitable.",
                "Today, the Idea Supply Chain is a ruthless place for ideators without patrons, pedigree or deeppockets. Those with such privileges find it easy to turn their inspiration into products that are eagerlysought by millions of consumers. They have ecosystems of collaborators who help them fine-tunetheir Idea, sign partnerships, get multi-million dollar deals heavily influenced by the weight of theiridentity. This is a compounding game – for ideators with privilege, the route to success becomesshorter and smoother with every new Idea.",
                "Yet – as it always happens in the story of human ingenuity – we have a solution to set things right; tocorrect these inequities and make the Idea Supply Chain fairer. The solution is Blockchain.",
                "With blockchain, every ideator has equal opportunity and is bound to operate by the same hardrules. The rules cannot be tinkered with, adapted or ignored to favor any specific group of people.There are no middle-people who can influence policy to privilege one person over another. If therules are specific, simple and immutable, the Idea Supply Chain built on blockchain will reward truemerit: People whose ideas add value and people who help them realize that value, will profit.",
                "IdeaTribe has been inspired by the possibilities of blockchain. We realized that blockchain willaddress the chinks in the Idea Supply Chain; every Idea and ideator will get their due, without beingcompromised by the politics of influence. Ideas will reach their audiences faster and benefit from thesupport of global collaborators. People will be paid fairly and on time, for their creativity and effort.",
                "Thus, we decided to create IdeaTribe on blockchain to build an equitable Idea Supply Chain."]
    },
    {
      title: "What is an Idea?", 
      content: ["At IdeaTribe, an Idea is any thought that - if realized properly - may be valued by the world. It neednot be developed into its final form, nor even defined in fine details. The first spark of inspiration,where an Idea originates, is the genesis of the Idea Supply Chain. Therefore, an Idea could be thegerm of a story that will eventually become a blockbuster movie; a ditty that will evolve into asymphony; a doodle that may be a world-changing invention; or a perspective that may become anew theory of how things work.", 
                "We believe that this first spark of inspiration is precious. Before it dies in a miasma of self-doubt,cynicism and detracting advice, it must be recorded with due credit to the ideator.Ideas develop continually and often with help from collaborators. This is the natural process of anIdea finding its true potential. At IdeaTribe, we recognize that making this as smooth, simple andnon-judgmental as possible is the healthy way to build a truly meritocratic Idea Supply Chain."]
    },
    {
      title: "The Product", 
      content: ["IdeaTribe.io is built on the MATIC blockchain. IdeaTribe.io will provide 3 essential services of the Idea", "Supply Chain:"],
      item: ["Create and maintain an immutable record of who originally conceived an Idea. When an Idea isminted on IdeaTribe, the creator is issued a Billet – a digital certificate that forever marks thetime and location of when and where the Idea was minted.", "Enable refinement and enhancement of an Idea to make it ready-for-market. This will be donethrough version upgrades of Ideas and smart contract-based collaborations between communitymembers.", "Enable commercialization of Ideas and services associated with the Idea Supply Chain. This willbe done through smart contract-based sale and auction of Ideas and purchase of services."]
    },
    {
      title: "TribeGold [TRBG]",
      content: ["The meritocratic Idea Supply Chain works on 2 key principles:"],
      item: ["That an Idea’s journey, from inspiration to market, is based on hard rules, common to everyone.", "That the Community will engage to support an Idea’s journey and individual members [calledTribers] will be rewarded – automatically and without manual influence – for the support theylend."],
      afterContent: ["IdeaTribe has designed an ERC-20 utility token called TribeGold to realize these principles.", "TribeGold is an asset of IdeaTribe to reward Tribers for building the community, bringing Ideas toIdeaTribe and realizing a fast, efficient and meritocratic Idea Supply Chain.", "IdeaTribe intends to mint 27,182,818 TribeGold coins. We believe that by the time these coins aredistributed, there will be a thriving community of Tribers who are regularly publishing Ideas,improving them, collaborating with each other and taking Ideas to market. In this way, not onlyideators and the IdeaTribe community, but also society will benefit from the value unlocked by theseIdeas.", "We want to have enough coins in circulation at maturity to ensure robust trade, collaboration andrealization of Ideas. We also want to ensure that the coins are a representation of the collective valueof all Ideas published, improved and realized on IdeaTribe. Hence we are limiting the number ofTribeGold coins. As the community matures, the true value of TribeGold (as represented in fiat) willincrease.", "We have chosen to mint 27,182,818 coins which is e*10^7. This is a hat-tip to the power ofcompounding and our belief that the value of Ideas compound when the community gets together."]
    },
    {
      title:  "TribeGold Minting Policy", 
      content: ["To achieve 27,182,818 coins that compound at a rate of e [Euler’s Constant = 2.7182818], we startwith 744 coins. Over 9 compounding cycles, the total number of TribeGold coins will become27,182,818.", "In each cycle, 75% of the TribeGold coins minted will be available for distribution to the community.25% will be allotted to IdeaTribe.io, towards maintenance and enhancement of the platform.", "Each minting cycle will start when 70% of the coins available in the previous cycle are distributed.", "Therefore, the minting cycles will be:"],
      table: undefined
    },
    {
      title: "Earning TribeGold", 
      content: ["Tribers can earn TribeGold by participating in and contributing to the community. IdeaTribe willperiodically revise the policy on activities that earn TribeGold. Broadly, TribeGold can be earned for:"],
      bullet: ["Joining the community", "Enabling friends to join the community", "Minting Ideas", "Actively developing an Idea and taking it to market", "Helping Tribers to enhance and market their Idea"],
      afterContent: ["IdeaTribe will also do periodic airdrops of TribeGold to reward Tribers who contribute most to the community."]
    },
    {
      title: "Spending TribeGold", 
      content: ["Tribers will be able to spend TribeGold in 2 ways:"],
      item: ["Use TribeGold to pay for high quality collaborations and services. Both seekers and providers ofcollaboration and services may advertise the amount of TribeGold they are willing to give foreffecting these transactions.", "Invest TribeGold in Ideas that they believe have high potential of success and impact. Owners ofIdeas may advertise the amount of stake they are willing to share in their Idea. They may alsoshare their plans for marketing the Idea. Based on the proposition, other Tribers will be able toinvest TribeGold in these Ideas. Upon realization of the plan, investors can get their share ofreturns from the investment."]
    },
    {
      title: "Conclusion",
      content: ["We believe that a new world is unfolding before us. This is a glorious place, full of opportunities foreveryone and it is being made possible by wonderful technology. We are excited to harness thepower of blockchain and re-imagine the uniquely human quality of profiting from our imaginations."],
      afterContent: ["If we silence our inner critic,", "If we let hope overpower our fears,", "If we help fulfil each other’s true self,", "If we let Ideas triumph over patronage and pedigree,", "We’re All Gonna Make It."],
      author: true
    }
  ]

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);
  return (
    <div className="main-content-component container terms d-flex">
      <>
        <div className="terms-body">
        <span className="father-grey color-secondary">Terms & Conditions</span>
        <div>
        <Image src={src} className="w-100"></Image>
        </div>
        <div className="mb-4">Table of Contents</div>
        {tableContent.map((item, index) => (
          <div>
            <div className="faq-title"> 
              <span className="mr-2"> {index + 1} . </span>
              <span> {item} </span>
            </div>
          </div>
        ))}
        <br/>
        {terms.map((item, index) => (
          <div label={`items-` + index}>
          <div>
            <div className="faq-title"> 
              <span className="mr-2"> {index + 1} . </span>
              <span> {item.title} </span>
            </div>
            {item.content && item.content.map(res=> (<div className="faq-content ml-4"> {res} </div>))}
            {item.item && item.item.map((sub, index) => (<div className="faq-content ml-4"> {index + 1}. {sub} </div>))}
            {item.bullet && item.bullet.map((sub, index) => (<div className="faq-content ml-4"> {(index + 10).toString(36).toUpperCase()}. {sub} </div>))}
            {item.afterContent && item.afterContent.map(after => (<div className="faq-content ml-4"> {after} </div>))}
            {item.note && <div className="faq-content ml-4"> Note: {item.note} </div>}
            {item.author && <div className="author"> IdeaTribe.io </div>}
          </div>
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

export default Help;
