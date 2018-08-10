import boxModel from "./box.model";
import boxResolvers from "./box.resolvers";
import { loadGQLFile } from "../../utils/gqlLoader";

export default {
    model: boxModel,
    resolvers: boxResolvers,
    typeDefs : loadGQLFile('box/box.graphql')
}