import React, { useEffect, useState } from 'react';
import { CustomButton, CustomInput, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { contract, walletAddress, setShowAlert } = useGlobalContext()
  const [playerName, setPlayerName] = useState("")
  const navigate = useNavigate()

  /**
   * If the user (i.e. current wallet address) is already registered, then navigate to /create-battle page.
   * It'll check the user is registered or not each time the account of the wallet (i.e. metamask) is changed.
   */
  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress)
      const playerTokenExists = await contract.isPlayerToken(walletAddress)

      if(playerExists && playerTokenExists) navigate('/create-battle')
    }
    
    if(contract) checkForPlayerToken()
  }, [contract])

  /**
   * It'll register the user of curent wallet address to the blockchain. 
   */
  const handleClick = async () => {
    try {
      const playerExists = await contract.isPlayer(walletAddress)

      if (!playerExists) {
        await contract.registerPlayer(playerName, playerName)

        setShowAlert({
          status: true,
          type: "info",
          message: `${playerName} is being summoned!`
        })
      }
    } catch (error) {
      console.log(error)
      setShowAlert({
        status: true,
        type: "failure",
        message: "Something went wrong!!"
      })
    }
  }

  

  return (
    <div className='flex flex-col'>
      <CustomInput
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
      />
      <CustomButton
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
        /> 
    </div>
  )
};

export default PageHOC(
  Home,
  <>Welcome to Avax Gods <br /> a Web3 Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
);