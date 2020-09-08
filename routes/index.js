var express = require('express');
var router = express.Router();

var tradeC = require('../controllers/tradeController.js');

router.get('/',(req,res)=>{
  res.render('index',{title:'Smallcase assignment'});
});

router.post('/add-trade',tradeC.addTrade);

router.get('/fetch-holdings',tradeC.getTrade);

router.put('/update-trade',tradeC.updateTrade);

router.delete('/',tradeC.removeTrade);

router.get('/fetch-returns',tradeC.getReturns);
module.exports = router;
