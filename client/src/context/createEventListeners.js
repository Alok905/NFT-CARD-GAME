import { ethers } from "ethers";
import { ABI } from "../contract";

const AddNewEvent = async (eventFilter, contract, cb) => {

    const res = await contract.on(eventFilter, (owner, name, event) => {
        cb({ owner, name, event })
    })
    // console.log({res})
    // provider.removeListener(eventFilter)
    
    // provider.on(eventFilter, (logs) => {
    //         const parsedLog = (new ethers.Interface(ABI)).parseLog(logs)

    //         cb(parsedLog)
    // })
}

export const createEventListeners = ({ navigate, contract, provider, walletAddress, setShowAlert, setUpdateGameData }) => {

    /* we can get the event that is created inside the solidity file of ours */
    const NewPlayerEventFilter = contract.filters.NewPlayer

    AddNewEvent(NewPlayerEventFilter, contract, ({ owner, name, event }) => {
        console.log("New player created!", {owner, name, event})

        if (walletAddress === owner) {
            setShowAlert({
                status: true,
                type: "success",
                message: "Player has been successfully registered"
            })
        }
    })

    const NewBattleEventFilter = contract.filters.NewBattle

    AddNewEvent(NewBattleEventFilter, contract, (args) => {
        console.log('New battle started!', args, walletAddress)

        if (walletAddress.toLowerCase() === args.player1.toLowerCase() || walletAddress.toLowerCase() === args.player2.toLowerCase()) {
            navigate(`/battle/${args.battleName}`)
        }

        setUpdateGameData(prevUpdateGameData => prevUpdateGameData + 1)
    })
}