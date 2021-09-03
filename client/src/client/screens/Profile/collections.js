import React from 'react';
import { Container, Row } from "react-bootstrap";
import CollectionCard from "../../components/collection-card/collection-card";

const Collections = ({collectionList = []}) => {
    return(
<Container className="collection-container">

<Row className="collections">
  {collectionList.map((collection, index) => {
    return (
      <CollectionCard collection={collection} index={index}/>
      // <CollectionCard key={index} card={collection}>
      //   {" "}
      // </CollectionCard>
    );
  })}
</Row>
</Container>
    )

}

export default Collections;