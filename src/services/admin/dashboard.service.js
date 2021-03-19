const {
  totalOrder,
  totalTime,
  totalPrice,
} = require("../customer/order.services");
const { totalTransaction } = require("../customer/transaction.services");
const { totalUser } = require("../users");
const { totalBookType } = require("../admin/admin.services.typebook");
const { totalBook } = require("../admin/admin.services.books");
const { totalAuthor } = require("../admin/admin.services.author");
const { totalPublishers } = require("../admin/admin.services.publishers");

module.exports.getDashboard = async () => {
  const totalBorrow = await totalOrder();
  const totalBorrowTime = await totalTime();
  const totalBorrowPrice = await totalPrice();
  const totalTransactionAmount = await totalTransaction();
  const totalUserJoin = await totalUser();
  const bookType = await totalBookType();
  const book = await totalBook();
  const author = await totalAuthor();
  const publishers = await totalPublishers();
  return {
    borrow: {
      totalBorrow: totalBorrow,
      totalBorrowTime: totalBorrowTime,
      totalBorrowPrice: totalBorrowPrice,
    },
    totalTransactionAmount: totalTransactionAmount,
    totalUserJoin: totalUserJoin,
    totalBookType: bookType,
    totalBook: book,
    totalAuthor: author,
    totalPublishers: publishers,
  };
};
