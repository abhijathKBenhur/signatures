const UserSchema = require("../db-config/user.schema");
const IdeaSchema = require("../db-config/Signature.schema");
const RelationSchema = require("../db-config/relation.schema");


getIdeasCountFromUser = async (creatorId) => {
  let findCriteria = {
    creator: creatorId,
  };
  return IdeaSchema.find(findCriteria)
  .count()
};


getUpvoteCountForIdeas = async (ideaId) => {
  let findCriteria = {
    to: ideaId,
    relation :"UPVOTE"
  };
  return RelationSchema.find(findCriteria)
  .count()
};

getFollowCountForUser = async (ownerUserName) => {
  let findCriteria = {
    to: ownerUserName,
    relation: "FOLLOW"
  };
  return RelationSchema.find(findCriteria)
  .count()
};




module.exports = {
  getIdeasCountFromUser,
  getUpvoteCountForIdeas,
  getFollowCountForUser
};
