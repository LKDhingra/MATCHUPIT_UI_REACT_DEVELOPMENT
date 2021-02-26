import { videoFormats, logoFormats, logoMaxSize, videoMaxSize } from "./constants";

export const isInputEmpty = (input) => {
    return (input === '')
}

export const passwordInFormat = (password) => {
    let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return strongRegex.test(password)
}

export const emailInFormat = (email) => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email)
}

export const passwordsMatching = (password,confirmPassword) => {
    return (password === confirmPassword)
}

export const alphaOnly = (value) => {
    let regex = /^[a-zA-Z ]*$/;
    return regex.test(value)
}

export const numOnly = (value) => {
    let regex = /^[0-9 +]*$/;;
    return regex.test(value)
}

export const numOnlyDots = (value) => {
    let regex = /^[0-9 + .]*$/;;
    return regex.test(value)
}

export const alphaNumOnly = (value) => {
    let regex = /^[a-zA-Z0-9]*$/;
    return regex.test(value)
}
export const alphaNumOnlyWithSpace = (value) => {
    let regex = /^[a-zA-Z0-9 ]*$/;
    return regex.test(value)
}
export const isZipcodeOk = (value) => {
    let regex = /^[0-9\-]$/;
    return regex.test(value)
}
export const isImageOk = (value, size) => {
    let splits = value.split('.')
    let ext = splits[splits.length-1]
    let formats=logoFormats
    if(formats.includes(ext.toLowerCase()) && size <= logoMaxSize){
        return true
    }else{
        return false
    }
}
export const isVideoOk = (value, size) => {
    let splits = value.split('.')
    let ext = splits[splits.length-1]
    let formats=videoFormats
    if(formats.includes(ext.toLowerCase()) && size <= videoMaxSize){
        return true
    }else{
        return false
    }
}
export const isPDFOk = (value, size) => {
    let splits = value.split('.')
    let ext = splits[splits.length-1]
    if(ext.toLowerCase()==='pdf' && size <= 2048000){
        return true
    }else{
        return false
    }
}
export const dateInFormat = (value) =>{
    let dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    return dateRegex.test(value)
}