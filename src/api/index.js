
//Librerias
import { PubSub } from 'graphql-yoga';
import { merge } from 'lodash';


//Modelos
import auth from './auth';
import box from './box';
import search from './search';

//Declaraciones
const pubSub = new PubSub();


export default {
  resolvers: merge({}, auth.resolvers, search.resolvers, box.resolvers),
  typeDefs: [ auth.typeDefs, search.typeDefs, box.typeDefs].join(' '),
  context: req => ({
    ...req,
    models: {
      user: auth.model,
      box: box.model
    },
    pubSub
  })
};
