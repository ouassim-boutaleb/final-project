const { where } = require("sequelize");
const db = require("../db/models/index")
const { BadRequestError, UnauthenticatedError,ForbiddenError , NotFoundError} = require('../errors');
require('dotenv').config();
const asyncWrapper = require("../middlewares/async");
const { StatusCodes } = require('http-status-codes');

const getCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user; 
    
    let cart = await db.Cart.findOne({
      where: { userId },
      include: [
        {
          model: db.CartItem,
          as: "cartItems",
          include: [
            {
              model: db.Product,
              as: "product",
              attributes: ['id', 'name', 'price', 'image', 'category', 'description', 'rating', 'warehouseId'], // Specify desired attributes here
              
            },
            
          ],
        },
      ],
    });
    
    if (!cart) {
        cart = await db.Cart.create({ userId });
    }

    return res.status(StatusCodes.OK).json({cart})
});

const addToCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user;
    const { productId, quantity, size, color } = req.body;
    const product = await db.Product.findByPk(productId);
    if (!product) {
        throw new NotFoundError('Product not found');
    };
    
    if (quantity > product.stock) {
        throw new BadRequestError(`Only ${product.stock} items in stock`);
    }

    let cart = await db.Cart.findOne({
        where: { userId },
        include: [
            {
                model: db.CartItem,
                as: 'cartItems',
                include: [{ model: db.Product, as: 'product',attributes: ['id', 'name', 'image', 'category', 'price', 'warehouseId'], }],
            },
        ],
    });
    if (!cart) {
        cart = await db.Cart.create({ userId });
    } else {
        const cartItems = cart.cartItems;
        if ( cartItems.length > 0) {
            const existingWarehouseId = cartItems[0].product.warehouseId;
            if (product.warehouseId !== existingWarehouseId) {
                throw new BadRequestError('You can only add products from the same warehouse to the cart');
            }
        }
    }


    const [cartItem, created] = await db.CartItem.findOrCreate({
        where: { cartId: cart.id, productId, size: size ?? null, color : color ?? null },
        defaults: { quantity },
    });

    if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
    }
    return res.status(StatusCodes.OK).json({msg: 'Item added to cart',cartItem})
});

const updateCartItem = asyncWrapper(async (req, res) => {
    const { cartItemId } = req.params;
    
    const { quantity } = req.body;
    console.log(quantity);

    const cartItem = await db.CartItem.findOne({
        where: {
            productId: cartItemId, // Ensure you're querying by the correct field (cartItemId)
        },
        include: [
            {
                model: db.Product,
                as: "product", // Include the associated Product model
                attributes: ["id", "name", "stock"], // Specify the attributes you need
                
            },
            
        ],
    });
    if (!cartItem) {
        throw new NotFoundError('Cart item not found');
    }
    
    if (quantity <= 0 || quantity > cartItem.product.stock) {
        throw new BadRequestError('Invalid quantity');
    }
    cartItem.quantity = quantity;
    await cartItem.save();
    return res.status(StatusCodes.OK).json({msg: 'Cart item updated successfully',cartItem})
});

const deleteCartItem = asyncWrapper(async (req, res) => {
    const { cartItemId } = req.params;
    console.log(cartItemId);
    const cartItem = await db.CartItem.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { productId: cartItemId },
            
          ],
        },
      });
    if (!cartItem) {
        throw new NotFoundError('Cart item not found');
    }
    await cartItem.destroy();
    return res.status(StatusCodes.OK).json({msg: 'Cart item deleted successfully'})
});

const clearCart = asyncWrapper(async (req, res) => {
    const { id: userId } = req.user;
    
    const cart = await db.Cart.findOne({ where: {userId} });
    
    if (!cart) {
        throw new NotFoundError('Cart not found');
    }
    await db.CartItem.destroy({ where: { cartId: cart.id } });
    
    return res.status(StatusCodes.OK).json({msg: 'Cart cleared successfully'})
});

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    deleteCartItem,
    clearCart
}