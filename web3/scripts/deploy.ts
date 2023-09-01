import { ethers } from 'hardhat';
import console from 'console';

const _metadataUri = "https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi";

async function deploy(name: string, ...params: [string]) {
  console.log(process.env.INFURA_API_PRIVATE_KEY)
  console.log(process.env.INFURA_ACCOUNT_PRIVATE_KEY)
  const contractFactory = await ethers.getContractFactory(name);

  return await contractFactory.deploy(...params);
}

async function main() {
  const [admin] = await ethers.getSigners();
  
  console.log(`Deploying a smart contract...`);

  const AVAXGods = (await deploy('AVAXGods', _metadataUri)).connect(admin);

  console.log({ AVAXGodsAddress: AVAXGods.target });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
 