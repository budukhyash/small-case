const trade = require("../models/trade");

exports.addTrade = async (req, res) => {
    try 
    {
        const { ticker, avgBuyPrice, shares } = req.body;
        const newTrade = new trade({ ticker, avgBuyPrice, shares });
        const findTrade = await trade.find({ticker:ticker});

        if(findTrade[0]!=undefined)
        {
            throw "DUPLICATE";
        }
        
        const savedTrade = await newTrade.save();
        res.send(savedTrade);
    } 
    catch (error) {
        if(error._message)
            res.status(400).send({ message: error._message });
        else
        res.status(500).send({ message: "Duplicate entry" });
    }
}

exports.getTrade = async (req,res)=>{
    try {
        let allTrades = await trade.find({});
        res.send(allTrades);
    } 
    catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
}

exports.updateTrade = async (req,res)=>{

    const {shares,operation,ticker,currentPrice} = req.body;
    console.log(currentPrice);
    if(typeof(currentPrice)!="number" || currentPrice<=0)
    {
        res.status(400).send({message:"Check data types"});
        return ;
    }

    try 
    {
        let Trades = await trade.findOne({ticker:ticker});
        console.log(Trades);
        if(!Trades)
        {
            res.status(404).send({ message: "Ticker not found" });
            return;
        }
        if(operation=='buy')
        {
            let totalShares    = Trades.shares+shares;
            let oldComponent   = Trades.avgBuyPrice*Trades.shares;
            let newComponent   = currentPrice*shares;
            let newAvgBuyPrice = (oldComponent+newComponent)/(totalShares);

            Trades.avgBuyPrice = newAvgBuyPrice;
            Trades.shares      = totalShares;

            await Trades.save();
            res.send(Trades);

        }
        else if(operation=='sell')
        {
            if(Trades.shares >= shares)
            {
                Trades.shares -= shares;
                if(Trades.shares==0)
                    await trade.findByIdAndDelete(Trades._id);
                else
                    await Trades.save();
                res.send(Trades);
            }
            else
                res.status(400).send({ message:"Not enough quantity"});
        }
        else
            res.status(400).send({ message:"Invalid operation use buy/sell"})
    } 
    catch (error) 
    {
        if(error._message)
            res.status(400).send({ message: error._message });
        else
            res.status(500).send({ message: "Internal server error" });
    }
    
}

exports.removeTrade = async (req,res) =>
{
    try 
    {
        let Trades = await trade.findOneAndDelete({ticker:req.body.ticker});
        if(!Trades)
        {
            res.status(404).send({message:"Ticker not found"});
            return;
        }
        
        res.send({message:"Trade deleted"});
    } catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }

}

exports.getReturns = async (req, res) => {

    try 
    {
        const currentPrice = 100;
        const Trades = await trade.find();
        let returns = 0;
        for (let index = 0; index < Trades.length; index++) {
            returns += (currentPrice - Trades[index].avgBuyPrice) * Trades[index].shares;
        }
         res.send({returns: returns});
    } 
    catch (err) 
    {
        console.log(err);
        res.status(500).send({ message: "Internal server error" });
    }
  };