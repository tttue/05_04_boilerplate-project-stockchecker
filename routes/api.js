/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const tool = require("../tool/tool")
const database_tool = require("../tool/database_tool")

let timeout = 10000
module.exports = function (app) {

	app.route('/api/stock-prices')
		.get(function (req, res, next) {
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			let clientIP = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(",")[0] : req.connection.remoteAddress
			let stocks = req.query.stock;
			if (typeof stocks === "string") {
				stocks = [stocks.toUpperCase()]
			} else {
				stocks = stocks.map(elm => elm.toUpperCase())
			}

			let like = req.query.like;
			if (stocks.length === 0) {
				clearTimeout(t);
				tool.apiProcessResult(null, { errorCode: -1, message: "stock param is not empty" })
			} else {
				if (like === "true") {
					if (stocks.length == 1) {
						database_tool.addLike(stocks, clientIP, (err, info) => {
							clearTimeout(t)
							tool.apiProcessResult(res, next, err, info);
						})
					} else {
						database_tool.addMultiStockLike(stocks, clientIP, (err, info) => {
							clearTimeout(t)
							tool.apiProcessResult(res, next, err, info);
						})
					}
				} else {
					if (stocks.length == 1) {
						database_tool.getOneStock(stocks, (err, info) => {
							clearTimeout(t)
							tool.apiProcessResult(res, next, err, info);
						})
					} else {
						database_tool.getManyStock(stocks, (err, info) => {
							clearTimeout(t)
							tool.apiProcessResult(res, next, err, info);
						})
					}
				}
			}
		})
		.delete(function (req, res, next) {
			let stocks = req.query.stock
			var t = setTimeout(() => { next({ message: 'timeout' }) }, timeout);
			let clientIP = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(",")[0] : req.connection.remoteAddress
			database_tool.deleteLikeData(stocks, clientIP, (err, info) => {
				clearTimeout(t)
				tool.apiProcessResult(res, next, err, info);
			})
		})

};
