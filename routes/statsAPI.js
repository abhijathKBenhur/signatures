const UserSchema = require("../db-config/user.schema");
const IdeaSchema = require("../db-config/Signature.schema");


getIdeasCountFromUser = async (creatorId) => {
  let findCriteria = {
    creator: creatorId,
  };
  return IdeaSchema.find(findCriteria)
  .count()

};


module.exports = {
  getIdeasCountFromUser,
};
