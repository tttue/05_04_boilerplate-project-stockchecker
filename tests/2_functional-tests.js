/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)
let stockName = "vrtx"
let stockName1 = "wba"
let stockName2 = "wdc"
let timeout = 9000
let lastLike = undefined
suite('Functional Tests', function () {
	suite('DELETE /api/stock-prices', function () {

		test('delete like stock data for testing', function (done) {
			this.timeout(timeout)
			chai.request(server)
				.delete('/api/stock-prices')
				.query({ stock: [stockName, stockName1, stockName2] })
				.end(function (err, res) {
					assert.equal(res.status, 200)
					assert.equal(res.text, "Delete succesful")
					done()
				})
		})
	})

	suite('GET /api/stock-prices => stockData object', function () {
		this.timeout(timeout)
		test('1 stock', function (done) {
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: stockName })
				.end(function (err, res) {

					//complete this one too
					assert.equal(res.status, 200)
					assert.property(res.body.stockData, "stock", "stockData of Body must have property stock")
					assert.isNumber(res.body.stockData.price, "price of stockData of Body must be number")
					assert.isNumber(res.body.stockData.likes, "likes of stockData of Body must be number")
					done()
				})
		})

		test('1 stock with like', function (done) {
			this.timeout(timeout)
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: stockName })
				.end(function (err, res) {

					//complete this one too
					assert.equal(res.status, 200)
					assert.property(res.body.stockData, "stock", "stockData of Body must have property stock")
					assert.isNumber(res.body.stockData.price, "price of stockData of Body must be number")
					assert.isNumber(res.body.stockData.likes, "likes of stockData of Body must be number")
					lastLike = res.body.stockData.likes
					done()
				})

		})

		test('1 stock with like again (ensure likes arent double counted)', function (done) {
			this.timeout(timeout)
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: stockName, like: "true" })
				.end(function (err, res) {

					//complete this one too
					assert.equal(res.status, 200)
					assert.property(res.body.stockData, "stock", "stockData of Body must have property stock")
					assert.isNumber(res.body.stockData.price, "price of stockData of Body must be number")
					assert.isNumber(res.body.stockData.likes, "likes of stockData of Body must be number")
					assert.equal(res.body.stockData.likes,lastLike)
					done()
				})

		})

		test('2 stocks', function (done) {
			this.timeout(timeout)
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: [stockName1, stockName2] })
				.end(function (err, res) {

					//complete this one too
					assert.equal(res.status, 200)
					assert.isArray(res.body.stockData)
					assert.property(res.body.stockData[0], "stock", "stockData of Body must have property stock")
					assert.isNumber(res.body.stockData[0].price, "price of stockData of Body must be number")
					assert.isNumber(res.body.stockData[0].rel_likes, "rel_likes of stockData of Body must be number")
					done()
				})

		})

		test('2 stocks with like', function (done) {
			this.timeout(timeout)
			chai.request(server)
				.get('/api/stock-prices')
				.query({ stock: [stockName1, stockName2], like: "true" })
				.end(function (err, res) {

					//complete this one too
					assert.equal(res.status, 200)
					assert.isArray(res.body.stockData)
					assert.property(res.body.stockData[0], "stock", "stockData of Body must have property stock")
					assert.isNumber(res.body.stockData[0].price, "price of stockData of Body must be number")
					assert.isNumber(res.body.stockData[0].rel_likes, "rel_likes of stockData of Body must be number")
					done()
				})
		})

	})

})
