const {response}=require("./app");
const Expense = require("./model");

const getExpense=(req,res,next)=>{
    Expense.find()
        .then(response=>{
            res.json({response})
        })
        .catch(error=>{
            res.json({error})
        })
};

//////////////////////////////////////////////////
const addExpense=(req,res,next)=>{
    const expense=new Expense({
        
        amount:req.body.amount,
        category:req.body.category,
        description:req.body.description,
        date:req.body.date,
       
    });

    expense.save()

    .then(response=>{
        res.json({response})
    })

    .catch(error=>{
        res.json({error})
    })
}

////////////////////////////////////////////////////

const updateExpense=(req,res,next)=>{
    const { id } = req.params;
    const{amount,category,description,date}=req.body;
    const ObjectId = require('mongodb').ObjectId;

    Expense.updateOne({_id:new ObjectId(id)}, { $set: { amount, category, description, date}})
    
    .then(response =>{
        res.json({ message: "Expense updated successfully" });
    })
    .catch(error =>{
        res.json({ error: "Error updating Expense" })
    })
}

//////////////////////////////////////////////////////
const deleteExpense = (req, res) => {
    const { id } = req.params; // Get user ID from URL parameters
    const ObjectId = require('mongodb').ObjectId;

    Expense.deleteOne({ _id: new ObjectId(id) })
        .then(response => {
            if (response.deletedCount > 0) {
                res.json({ message: "Expense deleted successfully" });
            } else {
                res.status(404).json({ error: "Expense not found" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Error deleting Expense", details: error.message });
        });
};

exports.getExpense=getExpense;
exports.addExpense=addExpense;
exports.updateExpense=updateExpense;
exports.deleteExpense=deleteExpense;
