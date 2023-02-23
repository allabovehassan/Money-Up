const express=require("express");
const accountRouter=express();

const{Accountmodel}=require("../model/account.model");
const{authenticator}=require("../middleware/authentication");


accountRouter.post("/create",authenticator,async(req,res)=>{
    const accountData=req.body;
    try {
        if(accountData){
            const account=new Accountmodel(accountData);
            await account.save();
            res.send("created new account successfully.");
        }else{
            res.status(404).send({"error":error.message,"msg":"unable to create new account"});
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send({"error":error.message,"msg":"unable to create new account"});
    }
})

accountRouter.get("/",authenticator,async(req,res)=>{
    const userID_in_body=req.body.userID;
    try {
        const accountData=await Accountmodel.find({userID:userID_in_body});
        if(accountData){
            res.send(accountData);
        }else{
            res.status(404).send("unable to find the data");
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send({"error":error.message,"msg":"unable to get the data"});
    }
})





accountRouter.patch("/update/:id",authenticator,async(req,res)=>{
    let id=req.params.id;
    let newData=req.body;
    const account=await Accountmodel.findOne({"_id":id});
    const userID_in_account=account.userID;
    const userID_req=req.body.userID;
    try {
        if(account){
            if(userID_req!==userID_in_account){
                res.send({"msg":"You are not authorized"});
            }else{
                await Accountmodel.findByIdAndUpdate({"_id":id},newData);
                res.send(`account is updated`);
            }
        }else{
            res.status(404).send("Unable to update the account");
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send("Unable to update the account");
    }
})



accountRouter.delete("/delete/:id",authenticator,async(req,res)=>{
    let id=req.params.id;
    const account=await Accountmodel.findOne({"_id":id});
    const userID_in_account=account.userID;
    const userID_req=req.body.userID;
    try {
        if(account){
            if(userID_req!==userID_in_account){
                res.send({"msg":"You are not authorized"});
            }else{
                await Accountmodel.findByIdAndDelete({"_id":id});
                res.send(`account is deleted`);
            }
        }else{
            res.status(404).send("Unable to delete  the account");
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).send("Unable to delete the account");
    }
})


module.exports={
    accountRouter
}
