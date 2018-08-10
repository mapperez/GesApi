import { parseDate } from "../../utils/util";

const CREATE_BOX_TRGGER = "CREATE_BOX";
const UPDATED_BOX_TRGGER = "UPDATE_BOX";

export default {
  Query: {
    async allBoxs(_, { first = 10, skip = 0, filter, orderBy }, ctx) {
      const query = filter
        ? {
            $or: [{ name: filter }]
          }
        : {};
      return await ctx.models.box
        .find(query)
        .select("_id nombre valor estado createdAt owner")
        .skip(skip)
        .limit(first)
        .sort(orderBy);
    },
    async findAllBoxs(_, { first = 10, cursor }, ctx) {
      const query = {};
      //cursor "12312313"
      if (cursor) {
        const date = parseDate(cursor);
        query.createdAt = {
          $lt: date
        };
      }
      return await ctx.models.box
        .find(query)
        .select("_id nombre valor estado createdAt owner")
        .limit(first)
        .sort("-createdAt");
    },
    async getBox(_, { _id }, ctx) {
      return await ctx.models.box.findById(_id);
    }
  },
  Mutation: {
    async createBox(_, { input }, ctx) {
      const box = await ctx.models.box.create({
        ...input,
        owner: ctx.userId
      });
      //notify to the users a new product has released
      ctx.pubSub.publish(CREATE_BOX_TRGGER, { newBox: box });
      return box;
    },
    async updateBox(_, { _id, input }, ctx) {
      const box= await ctx.models.box.findOneAndUpdate({ _id }, input, {
        new: true
      });

       //notify to the users a update product has released
       ctx.pubSub.publish(UPDATED_BOX_TRGGER, { upBox: box });

       return box;
    },
    async deleteBox(_, { _id }, ctx) {
      return await ctx.models.box.findByIdAndRemove(_id);
    }
  },
  Box: {
    async owner(box, args, ctx) {
      const owner = await ctx.models.user.findOne(
        {
          _id: box.owner
        },
        "_id email"
      );
      return owner;
    }
  },
  Subscription: {
    newBox: {
      subscribe(parent, args, { pubSub }) {
        //register a new listner or event or trigger
        return pubSub.asyncIterator(CREATE_BOX_TRGGER);
      }
    },
    upBox: {
      subscribe(parent, args, { pubSub }) {
        //register a new listner or event or trigger
        return pubSub.asyncIterator(UPDATED_BOX_TRGGER);
      }
    }
  }
};
