import fs from "fs";


/*
const sum = (a,b) => (parseInt(a)+parseInt(b))

const substract = (a,b) => (parseInt(a)-parseInt(b))

const newArgs = process.argv.slice(2)
console.log(newArgs)

const n1 = newArgs[1]
const n2 = newArgs[2]

if(newArgs[0] === "sum" ){
    console.log(sum(n1,n2))   
}
if(newArgs[0] === "substract"){
    console.log(substract(n1,n2))
}
*/
export const readJson = (jsonPath) =>{
try{
    const jsonData = fs.readFileSync(jsonPath)
    const data = JSON.parse(jsonData)
    return data
}catch(e){
    console.log(e)

}
}
export const updateJson = (newData, jsonPath) =>{
    try{
        const jsonData = fs.readFileSync(jsonPath)
        const data = JSON.stringify(newData)
        const newJson = fs.writeFileSync(jsonPath, data)
        return newJson;
        
    }catch(e){
        console.log(e)
    
    }
    }

