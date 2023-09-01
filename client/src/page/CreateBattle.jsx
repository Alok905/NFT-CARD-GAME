import React, { useEffect, useState } from 'react';
import { CustomButton, CustomInput, GameLoad, PageHOC } from '../components';
import { useGlobalContext } from '../context';
import styles from '../styles';
import { useNavigate } from 'react-router-dom';

const CreateBattle = () => {
  const { contract, battleName, setBattleName, gameData } = useGlobalContext()
  const navigate = useNavigate()

  const [waitBattle, setWaitBattle] = useState(false)


  const handleClick = async () => {
    /**
     * If battle name is not given in the input field.
     */
    if (!battleName || !battleName.trim()) return null
    
    try {
      await contract.createBattle(battleName)

      setWaitBattle(true)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 0n) {
      setWaitBattle(true)
    }
  }, [gameData])
  

  return (
    <>
      {waitBattle && <GameLoad />}

      <div className='flex flex-col mb-5'>
        <CustomInput 
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        /> 
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />

        <p className={styles.infoText} onClick={() => navigate('/join-battle')}>Or join already existing battles</p>
      </div>
    </>
  )
};

export default PageHOC(
  CreateBattle,
  <>Create <br /> a new Battle</>,
  <>Create your own battle and wait for other players to join you</>
);