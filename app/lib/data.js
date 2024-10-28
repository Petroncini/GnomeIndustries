import { Contssss, FixNames, ForName} from "./models";
import { connectToDB } from './utils'




/*====================================================================================================================================*/

export const fetchContas = async () => {
    try {
        connectToDB();
        const contas = await Contssss.find();
        return contas
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch the "contas"')
    }
}

export const fetchFixNames = async () => {
    try {
        connectToDB();
        const fixNames = await FixNames.find();
        return fixNames
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch the "fixNames"')
    }
}

export const fetchFixName = async (id) => {
    try {
        connectToDB();
        const fixName = await FixNames.findById(id);
        return fixName
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch the "fixName"')
    }
}



export const fetchForNames = async () => {
    try {
        connectToDB();
        const forNames = await ForName.find();
        return forNames
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch the "ForNames"')
    }
}

export const fetchForName = async (id) => {
    try {
        connectToDB();
        const forName = await ForName.findById(id);
        return forName
    } catch (err) {
        console.log(err);
        throw new Error('Failed to fetch the "ForName"')
    }
}