import { Contract, ethers } from "ethers"
import { createContext, useContext, useEffect, useState } from "react"
import { ABI, ADDRESS } from "../contract"
import { createEventListeners } from "./createEventListeners"
import { useNavigate } from "react-router-dom"

const GlobalContext = createContext()

export const GlobalContextProvider = ({ children }) => {
    const navigate = useNavigate()
    const [walletAddress, setWalletAddress] = useState('')
    const [provider, setProvider] = useState('')
    const [contract, setContract] = useState('')
    const [showAlert, setShowAlert] = useState({
        status: false,
        type: 'info',
        message: ''
    })
    const [battleName, setBattleName] = useState("")
    const [gameData, setGameData] = useState({
        players: [],
        pendingBattles: [],
        activeBattle: null
    })
    const [updateGameData, setUpdateGameData] = useState(0)

    
    /**
     * set the wallet address to state
     */
    const updateCurrentWalletAddress = async () => {

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        })

        if (accounts) setWalletAddress(accounts[0])
    }

    /**
     * Whenever the account is switched, it change the current account address and store in the state "walletAddress"
     */
    useEffect(() => {
        updateCurrentWalletAddress()
        
        window.ethereum.on('accountChanged', updateCurrentWalletAddress)
    }, [])
    


    /**
     * set the smart contract and the provider to the state when the webpage is loaded
     */
    useEffect(() => {
        const setSmartContractAndProvider = async () => {
            
            const newProvider = new ethers.BrowserProvider(window.ethereum)
            const signer = await newProvider.getSigner()
            /* contract can be created using the contract addresss, the ABI of the contract, and the signer */
            const newContract = new Contract(ADDRESS, ABI, signer)
            setProvider(newProvider)
            setContract(newContract)
        }
        setSmartContractAndProvider()
    }, [])

    /**
     * When ever the contract is changed (i.e. any function of the smart contract is called) then this useEffect is executed.
     */
    useEffect(() => {
        if (contract) {
            createEventListeners({navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData})
        }
    }, [contract])
    
        
    useEffect(() => {
        /* If the alert is showing */
        if (showAlert?.status) {

            /* after 5 second, close the alert after 5 second */
            const timer = setTimeout(() => {
                setShowAlert({status: false, type: 'info', message: ''})
            }, [5000])

            return () => clearTimeout(timer)
        }
    }, [showAlert])
    
    /* 
        * Set the game data to the state 
        * If the user has created a battle, then for that user, the "GameLoad" function should be displayed till other player is found even after refreshing the page
    */
    useEffect(() => {
        const fetchGameData = async () => {
            const fetchBattles = await contract.getAllBattles()
            const pendingBattles = fetchBattles.filter(battle => battle.battleStatus === 0n)

            let activeBattle = null;

            fetchBattles.forEach(battle => { 
                /* If the current address of the wallet is the player */
                if (battle.players.find(player => player.toLowerCase() === walletAddress.toLocaleLowerCase())) {
                    /* If there is not any winner of the battle */
                    if (battle.winner.startsWith('0x00')){
                        activeBattle = battle
                    }
                }
            })
            setGameData({
                pendingBattles: pendingBattles.slice(1),
                activeBattle
            })
        }
        if(contract)    fetchGameData()
    }, [contract, updateGameData])
    
    

    return (
        <GlobalContext.Provider value={{
            contract,
            walletAddress,
            showAlert,
            setShowAlert,
            battleName,
            setBattleName,
            gameData
        }} >
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext)