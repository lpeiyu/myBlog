const regs={
    phone:/^((1[0-9]))\d{9}$/,
    email:/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    number:/^\d+$/,
    password:/^\w+$/,
    account:/^[A-Za-z0-9_]{1,}$/,
    ip:/^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/,
    pInt:/^\+?[1-9]\d*$/,
    pointNumber:/^150$|^(?:\d|[1-9]\d|1[0-4]\d)(?:\.5)?$/,
    money:/^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/,
    vmName:/^(?:[\u4e00-\u9fa5·]{2,16})$/
}
const verify = (rule,value,reg,callback)=>{
    if(value){
        if(reg.test(value)){
            callback()
        }else{
            callback(newError(rule.message))
        }
    }else{
        callback()
    }
}
export default {
    phone:(rule,value,callback)=>{
        return verify(rule,value,regs.phone,callback)
    },
    email:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    number:(rule,value,callback)=>{
        return verify(rule,value,regs.email,callback)
    },
    password:(rule,value,callback)=>{
        return verify(rule,value,regs.password,callback)
    },
    account:(rule,value,callback)=>{
        return verify(rule,value,regs.account,callback)
    },
    ip:(rule,value,callback)=>{
        return verify(rule,value,regs.ip,callback)
    },
    pInt:(rule,value,callback)=>{
        return verify(rule,value,regs.pInt,callback)
    },
    pointNumber:(rule,value,callback)=>{
        return verify(rule,value,regs.pointNumber,callback)
    },
    money:(rule,value,callback)=>{
        return verify(rule,value,regs.money,callback)
    },
    vmName:(rule,value,callback)=>{
        return verify(rule,value,regs.vmName,callback)
    },
}