import _ from 'lodash'
import Web3 from 'web3'
import NFTTokenBean from '../beans/Fingerprint'
import tokenJSON from '../../abis/Fingerprints.json'
import IPFS from '../config/ipfs'

class BlockchainInterface {
    constructor() {  
		this.web3 = undefined;
		this.account = undefined;
		this.tokenJSON = tokenJSON;
		this.contract = undefined;
		this.tokens = [];
		this.NFTTokenBean = NFTTokenBean
	}

	async initialize(){
		await this.loadWeb3()
		return this.loadBlockchainData()
	}


	async loadWeb3() {
		if (window.ethereum) {
			this.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		else if (window.web3) {
			this.web3 = new Web3(this.web3.currentProvider)
		}
		else {
			this.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
		window.web3 = this.web3;
	}

	async loadBlockchainData() {
		const web3 = this.web3
		const accounts = await web3.eth.getAccounts();
		this.account = accounts[0];
		const networkId = await web3.eth.net.getId()
		const networkData = this.tokenJSON.networks[networkId];
		if(networkData) {
		  const abi = this.tokenJSON.abi
		  const address = networkData.address
		  const contract = new web3.eth.Contract(abi, address)
		  this.contract = contract
		  const totalSupply = await contract.methods.totalTokens().call()
		  for (var i = 1; i <= totalSupply; i++) {
			const nftToken = await contract.methods.metadataOf(i).call()
			this.tokens = [...this.tokens, new this.NFTTokenBean(nftToken)]
		  }
		} else {
		  window.alert('Smart contract not deployed to detected network.')
		}
		return this.tokens
	  }


    createToken({options}){
		let payLoad = {
			account: this.account,
			file: options.file,
			name: options.tokenName,
			category: options.tokenCategory,
			amount: parseFloat(options.tokenSupply),
			price:  this.web3.utils.toWei(options.tokenCost, 'ether'),
			uri: options.file
		  }
		  this.contract.methods.mint(
			payLoad.account, 
			payLoad.name,
			payLoad.category,
			payLoad.amount,
			payLoad.price,
			payLoad.uri,
			).send({ from: this.account })
				.once('receipt', (receipt) => {
			
				})
    }

    getTokens(){
		return this.tokens
    }

	getFilePath(file){
		const promise = new Promise((resolve, reject) => {
			const reader = new window.FileReader()
			reader.readAsArrayBuffer(file);
			reader.onloadend = () => {
				IPFS.files.add(Buffer(reader.result), (error, result) => {
					if(error) {
						console.error(error)
						reject(error)
					}
					resolve(result[0].path)
				})
			}
		});
		
		return promise
	}

	 buyToken(){
        
    }
}

export default new BlockchainInterface()