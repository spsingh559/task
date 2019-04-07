var bitcore = require('bitcore-lib');
var hdkey1 = require('ethereumjs-wallet/hdkey');



const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  readline.question(`No of address `, (n) => {
    console.log(n)
    validateNumber(n);
    // readline.close()
  })

  validateNumber=(n)=>{
    if(n>=1 && n<=100){
generateAddress(n);

    }else{
      readline.question(`No of address between 1 to 100 `, (n) => {
          console.log(n)
          validateNumber(n)
        //   readline.close()
        })
    }

  }
  
generateAddress=(n)=>{
    console.log('----starting gen address');
    
        // generate eth coin
        console.log('===========Eth Coin================>')
        generateEthCoin(n,60);
        // genearte bitcoin
        console.log('=================BTH Coin===========')
        generateEthCoin(n,0);
        // gen Litecoin
        console.log('==============Lite Coin============>')
        generateEthCoin(n,2);
        
    
}

generateEthCoin=(n, coinType)=>{
var seed = 'xprv9s21ZrQH143K2uRcdeb2VJAEwhJQCtAjTCgx9JQt5NGhSkG4xGiuXvea8yN3tz3Q4LwPoP8j2cwERYNyw959ed9yqCrHGT1oDxJhNWoobqf'
var hdKey = new bitcore.HDPrivateKey(seed);

for(var i=1; i<=n;i++){
    //BIP Format :  m / purpose' / coin_type' / account' / change / address_index
        var derivationPath = `m/44'/${coinType}'/0'/0'/${i}'`;
        var derivedPrivKey = hdKey.derive(derivationPath)
        var derivedPubKey = hdKey.derive(derivationPath).hdPublicKey
        var extPubKey = derivedPubKey.toString()
        var hdwallet = hdkey1.fromExtendedKey(extPubKey);
        var wallet = hdwallet.getWallet();
        var address = wallet.getAddress();
        console.log('Derivation Path: ', derivationPath)
        console.log('Private Key: ', derivedPrivKey.toString())
        console.log('Public Key:  ', derivedPubKey.toString())
        console.log(`public address: 0x${address.toString('hex')}`);
        console.log('coin type is ', coinType);
        }
}

  
