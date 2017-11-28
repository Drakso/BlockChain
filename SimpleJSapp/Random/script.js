// External library called crypto-js with which we can generate hash strings
const SHA256 = require('crypto-js/sha256');

/* A class that represents a block 
    - index : It represents where this block is on the chain
    - timestamp : When the block was created
    - data : Data valuable for transaction ( ex: Sender, Receiver etc. )
    - previousHash : Hash of the block before this block
    - hash : Hash of this block which is calculated by a function calculateHash
    - random : this is a random character so that you don't get stuck into infinite loop if you pass the same data twice trough mining
    - calculateHash() : Takes all properties from the block and makes a unique hash from those information
    - mineBlock(difficulty) : The function keeps running untill the hash starts with a certain number of zeroes ( difficulty )
        = difficulty is the number of zeroes that we wish the hash to start with.
        = The more zeroes, the more dificult the mining is
*/
class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.random = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.random).toString();
    }

    // hash.substring takes characters from 0 to difficulty character. Ex: if difficulty is 5 it will take the first 5 characters\
    // The While loop will run as long as the hash is not equal to difficulty number of zeroes
    // Ex: Array of difficulty 5 + 1 ( Array(6)) elements with separators between the elements 0 will return 5 zeroes
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.random++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

/* A class that represents a block chain
    - chain : An array of all the block on this chain ( always starts with the GENESIS BLOCK )
    - createFirstBlock() : Craetes a GENESIS BLOCK
    - getLatestBlock() : returns the last block of the chain array
    - addBlock(block) : adds new block in the chain array, setting the previous block property and creating new hash for that block.
*/
class BlockChain{
    constructor(){
        this.chain = [this.createFirstBlock()];
        this.difficulty = 2;
    }

    createFirstBlock(){
        return new Block(0, "30/12/2017", "Genesis Block", "0000");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(block){
        block.previousHash = this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);
        this.chain.push(block);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let iBornCoin = new BlockChain();
// iBornCoin.addBlock(new Block(1, "31/12/2017", { sender: "Dragan", receiver: "Zlate", amount: 10 }));
// iBornCoin.addBlock(new Block(2, "16/01/2018", { sender: "Zlate", receiver: "KlimenT", amount: 99 }));
// iBornCoin.addBlock(new Block(3, "22/02/2018", { sender: "Kliment", receiver: "Dragan", amount: 5 }));

//console.log(JSON.stringify(iBornCoin, null, 4));

// console.log("Is this chain valid?");
// console.log(iBornCoin.isChainValid());

// iBornCoin.chain[1].data = { sender: "Jovan", receiver: "Zlate", amount: 10 };
// iBornCoin.chain[1].hash = iBornCoin.chain[1].calculateHash();

// console.log("Is this chain valid?");
// console.log(iBornCoin.isChainValid());

console.log("Mining block 1...");
iBornCoin.addBlock(new Block(1, "31/12/2017", { sender: "Dragan", receiver: "Zlate", amount: 10 }));

console.log("Mining block 2...");
iBornCoin.addBlock(new Block(2, "16/01/2018", { sender: "Zlate", receiver: "KlimenT", amount: 99 }));


