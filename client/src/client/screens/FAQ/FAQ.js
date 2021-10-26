import React from "react";
import "./faq.scss";
import {Accordion,Badge, Button} from "react-bootstrap";
const FAQ = () => {
  return (
    <div className="main-content-component container">
      
      <Accordion >
        <Accordion.Item eventKey="0">
          <Accordion.Header>What is IdeaTribe?</Accordion.Header>
          <Accordion.Body>
            IdeaTribe is a blockchain-based platform to mint Ideas and make them
            real. Users can capture their inspiration and store it on the
            blockchain as proof of original thought. Then, they can collaborate
            with others in the community to enhance, produce, finance and market
            the final product resulting from that moment of inspiration.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>What is Blockchain?</Accordion.Header>
          <Accordion.Body>
            Blockchain is a technology that creates immutable records. Any
            information put in the blockchain is stored forever and cannot be
            changed. This feature helps us store original Ideas with time and
            location stamp, which helps users establish priority of their Idea.
            <br />
            Blockchain is also an effective way to create smart contracts, which
            get executed automatically when certain conditions are met. This
            quality ensures that all parties involved in a transaction are
            protected.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>What is an Idea in IdeaTribe?</Accordion.Header>
          <Accordion.Body>
            In IdeaTribe, an Idea can be an original thought, not yet fully
            formed but holds the promise of something more substantial. So, an
            Idea can be the seed of a story, an invention, a meme, a song or a
            perspective. It can also be a work in progress or a finished product
            - like a unique artwork, business plan, blueprint of an invention or
            a research paper.
            <br />
            An Idea can be minted on IdeaTribe at any stage of its maturity. We
            enable users to update their Idea as it evolves and mint afresh,
            maintaining the history of the Idea.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>What is Gas fee?</Accordion.Header>
          <Accordion.Body>
            Gas is the name of the transaction amount paid to the blockchain to
            register a record on the blockchain. It is paid in the currency of
            each particular blockchain. In the case of IdeaTribe, Gas fee is
            paid is Matic.
            <br />
            Matic can be bought on any crypto-exchange like Coinbase, and
            transferred to your Metamask wallet. You will need Matic in your
            Metamask account to mint Ideas and enter into smart contracts in
            IdeaTribe.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="4">
          <Accordion.Header>
            Why did you choose Matic blockchain?
          </Accordion.Header>
          <Accordion.Body>
            In IdeaTribe, an Idea can be an original thought, not yet fully
            formed but holds the promise of something more substantial. So, an
            Idea can be the seed of a story, an invention, a meme, a song or a
            perspective. It can also be a work in progress or a finished product
            - like a unique artwork, business plan, blueprint of an invention or
            a research paper.
            <br />
            We had 3 reasons to choose Matic blockchain for IdeaTribe.
            <br />
            1. We wanted a blockchain whose Gas fees were affordable. Matic has
            some of the lowest Gas fees among all blockchains.
            <br />
            2. We wanted a credible blockchain with a large number of users.
            With blockchain technology becoming increasingly popular, the market
            is replete with blockchains that are untested or expensive. Matic is
            one of the most popular blockchains with hundreds of millions of
            users and yet, inexpensive Gas fees.
            <br />
            3. We wanted a blockchain that operates on Proof-of-Stake not
            Proof-of-Work. Blockchains use a consensus mechanism to ensure that
            data is not hacked. Proof-of-Stake and Proof-of-Work are 2 consensus
            mechanisms that are popularly used. Proof-of-Work is significantly
            more energy intensive than Proof-of-Stake. Matic fits this
            requirement well.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="5">
          <Accordion.Header>
            Does minting an Idea on IdeaTribe mean that it is legally protected?
          </Accordion.Header>
          <Accordion.Body>
            No. Minting an Idea on IdeaTribe does not imply that it is legally
            protected.
            <br />
            However, the record of having minted an Idea on the blockchain at a
            certain time is admissible in a court of law.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="6">
          <Accordion.Header>
            Does minting an Idea on IdeaTribe mean that I do not have to file
            for patent or copyright?
          </Accordion.Header>
          <Accordion.Body>
            No. Minting an Idea on IdeaTribe is NOT a substitute for filing
            patents or copyright. However, minting an Idea on IdeaTribe can be
            used as proof that an original Idea was conceived at a certain time
            and location.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="7">
          <Accordion.Header>
            Isn’t blockchain bad for the environment?
          </Accordion.Header>
          <Accordion.Body>
            Not necessarily. While some of the older blockchains like Bitcoin
            are known to consume a lot of energy for computing, newer
            blockchains that use Proof-of-Stake consensus models are
            substantially more efficient. IdeaTribe is built on Matic, which is
            a Proof-of-Stake blockchain.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="8">
          <Accordion.Header>What is the value of TribeGold?</Accordion.Header>
          <Accordion.Body>
            TribeGold is the token of IdeaTribe. Tribers earn it for minting
            Ideas and engaging with the community.
            <br />
            Over time, we expect TribeGold to represent the value of all Ideas
            in the community.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="9">
          <Accordion.Header>How can I earn TribeGold?</Accordion.Header>
          <Accordion.Body>
            Tribers can earn TribeGold for at least the following:
            <br />
            Minting Ideas
            <br />
            Referring friends who mint Ideas
            <br />
            Getting upvotes for their Ideas
            <br />
            The specific amount of TribeGold for these will vary with time.
            IdeaTribe will also add more activities for which Tribers can earn
            TribeGold.
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="10">
          <Accordion.Header>How can I spend TribeGold?</Accordion.Header>
          <Accordion.Body>
            Our vision is to enable Tribers to use TribeGold to do the
            following:
            <br />
            1. Use TribeGold to pay for high quality collaborations and
            services.
            <br />
            2. Invest TribeGold in Ideas that they believe have high potential
            of success and impact.
            <br />
            We are still working on these features and will release them when we
            are ready!
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FAQ;
