const database_tool = require("./database_tool")
let stock = "GOOG"
database_tool.getManyStock([stock,"GOOG1"],(err, data)=>{
	if (err){
		console.log("Error:", err);
		return;
	}
	console.log("Data: ", data);
})