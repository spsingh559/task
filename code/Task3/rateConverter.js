const express = require('express');
const axios=require('axios');
var bodyParser = require('body-parser');
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const apiKey = '0607d03ea66f60759dc7';
const HOST = "0.0.0.0";
const PORT =8080;
var cache = require('memory-cache');

app.post('/api/v0/rate', (req,res)=>{
    console.log(req.body.currencyCode,req.body.amount);

    if(cache.get(req.body.currencyCode)==null){ //checking data exist in cache
     
        convertCurrency(req.body.currencyCode, 'INR').then(result=> {
        console.log('result after promise', result)
        cache.put(req.body.currencyCode, result, 120000, function(key, value) {
          console.log(key + ' did ' + value);
      });
      rateResponse(req.body.currencyCode,req.body.amount,result,res);
      
    }, err=> {
        console.log(err);
        res.json({        
          "returncode": 201, "err": "operation failed","timestamp": Date.now()     })
    })
  }else{
        rateResponse(req.body.currencyCode,req.body.amount,cache.get(req.body.currencyCode),res);
  }
    

});


// prepare response of api post success
rateResponse=(currencyCode,amount, ConversionRate,res)=>{
console.log('rateResp', currencyCode,amount, ConversionRate);
  var total = ConversionRate * amount;
  console.log('total is',  Math.round(total * 100) / 100);
  
  res.json({
      "SourceCurrency ":currencyCode,    
      "ConversionRate": ConversionRate,    
      "Amount": amount,    
      "Total" : Math.round(total * 100) / 100,    
      "returncode": 1,    
      "err": "success",    
      "timestamp": Date.now(),    
    })
}


// conversion rate from api
convertCurrency=(fromCurrency, toCurrency)=> {  
  var query = fromCurrency + '_' + toCurrency;
  var url = 'https://free.currencyconverterapi.com/api/v6/convert?q='
            + query + '&compact=ultra&apiKey=' + apiKey;
   return new Promise(function(resolve, reject) {         
            
   axios.get(url)
  .then(response=> {   
    resolve(response.data[query]); 
  })
  .catch(error=> {
    console.log(error);
    reject(error);
  })
})
}

app.listen(PORT,HOST);
console.log(`Running on ${PORT}`);

// curl api to check post function
// curl -d '{"currencyCode":"USD", "amount":10}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/v0/rate