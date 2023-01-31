import { extendType, floatArg, nonNull, objectType, stringArg } from 'nexus';
import { User } from '../entities/User';
import { Context } from '../types/Context';
import { Product } from '../entities/Product';

export const ProductType = objectType({
  name: 'Product',
  definition(t) {
    t.nonNull.int('id'), t.nonNull.string('name'), t.nonNull.float('price');
    t.nonNull.int('creatorId');

    t.field('createdBy', {
      type: 'User',
      resolve(parent, _args, _context: Context, _info): Promise<User | null> {
        return User.findOne({ where: { id: parent.creatorId } });
      },
    });
  },
});

export const ProductsQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('products', {
      type: 'Product',
      resolve(_parent, _args, context: Context, _info): Promise<Product[]> {
        const { conn } = context;
        return conn.query(`select * from product`);
      },
    });
  },
});

export const CreateProductMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createProduct', {
      type: 'Product',
      args: {
        name: nonNull(stringArg()),
        price: nonNull(floatArg()),
      },
      async resolve(_parent, args, context: Context, _info): Promise<Product> {
        const { name, price } = args;
        const { userId } = context;

        if (!userId || !(await User.findOne({ where: { id: userId } }))) {
          throw new Error("Can't create product without logging in.");
        }

        return Product.create({ name, price, creatorId: userId }).save();
      },
    });
  },
});
