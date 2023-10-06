// import StudentModel from "../models/Student.js";

class StudentController{
    static createDoc = (req, res)=>{
        // res.send("DAta created ---");

    }
    static getAllDoc = async (req, res)=>{
        // res.send("All Doc ---");
        try {
            // const result = await StudentModel.find();
            // res.send(result);
        } catch (error) {
            
        }
    }
    static getSingleDocById = (req, res)=>{
        res.send("single doc ---");
    }
    static UpdateDocById = (req, res)=>{
        res.send("update doc ---");
    }
    static DeleteDocById = (req, res)=>{
        res.send("delete doc ---");
    }
}

export default StudentController;