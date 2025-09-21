import { supabase } from "../config/supabase.js";
//saving the results in suoabase
//to create table usewise and userId as foreign key later

const saveResults = async (req,res)=>{

    try {

        const {results} = req.body
        // const results = data.results
        // console.log("REQ BODY ===>", req.body);


        for(const element of results){
          const {data,error} = await supabase
            .from('Hmpi_Results')
            .insert([
                {
                    state : element.location.state , 
                    district : element.location.district, 
                    latitude : element.location.coordinates.latitude,
                    longitude : element.location.coordinates.longitude,
                    hmpiValue : element.hmpiResult.value
                    
                }
            ])
            .select()
        }

        res.status(200).json({
            message : "Results Saved SuccessFully!!"
        })


        
    } catch (error) {
        res.status(500).json({
            error : 'error in saving file ',
            message : error.message
        })
    }
}


const fetchHmpiResults = async (req,res)=>{
    try {

        const {data , error} = await supabase
        .from('Hmpi_Results')
        .select('*')

        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json({
            error : "error in fetching results",
            message : error.message
        })
    }
}
export {saveResults,fetchHmpiResults}