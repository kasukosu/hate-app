import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url)=> {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);


    useEffect(()=> {
        axios.get(url)
            .then(res => {
                if(res.data){
                    console.log(res.data);
                    setData(res.data);
                    setIsPending(false);
                    setError(null);
                }
            })
            .catch(err => {
                setIsPending(false);
                setError(err.message);
            })
         
    },[url])
    return {data, isPending, error};
} 
export default useFetch;