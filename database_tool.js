/*
 Promise.all()
 */
const promiseForeach = require('promise-foreach')
const fetch = require("node-fetch");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), 'private.env') });
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const tool = require("./tool")
const stock = require("./stock")
const request = require('request');

const likeStockSchema = new mongoose.Schema({
	stock: String,
	ip: String
});
likeStockSchema.index({ stock: 1 });
likeStockSchema.index({ ip: 1 });

const LikeStock = mongoose.model('LikeStock', likeStockSchema);



const getOneStock = (stockName, done) => {
	var checkResult = tool.checkStringNotBlank(stockName, "stock", true);
	if (checkResult) {
		done(null, { errorCode: -2, errorMsg: checkResult });
		return;
	}
	stock.getStockInfo(stockName, (err, data) => {
		if (err) {
			done(err);
			return;
		}
		if (tool.isEmpty(data)) {
			done(null, { errorCode: 1, message: stockName + ": This stock doesn't exists" })
			return;
		}
		LikeStock.countDocuments({ stock: data.symbol }, (err, count) => {
			let stockObj = {
				stock: data.symbol,
				price: data.profile.price,
				likes: count
			}
			done(null, stockObj);
		})
	})
}

const getManyStock = (stockNames, done) => {
	var arrStock = stockNames.map(elm => {
		return {
			stock: elm,
			url: 'https://financialmodelingprep.com/api/v3/company/profile/' + elm
		}
	});

	promiseForeach.each(arrStock, (elm) => {
		return fetch(elm.url).then(response => response.json());
	}, (arrResult, elm) => {
		elm.result = arrResult[0];
		return elm;
	}, (err, newList) => {
		if (err) {
			done(err)
		} else {
			let ret = newList.map(elm => {
				if (tool.isEmpty(elm.result)) {
					return { errorCode: 1, message: elm.stock + ": This stock doesn't exists" }
				} else {
					return {
						errorCode: 0,
						data: {
							stock: elm.symbol,
							price: elm.result.profile.price,
						}
					}
				}
			})
			done(null, { errorCode: 0, data: ret });
		}
	});

}
exports.getOneStock = getOneStock;
exports.getManyStock = getManyStock;
