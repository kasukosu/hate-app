import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DropdownSpan = (props) => {


    const [isCopied, setIsCopied] = useState({
        value:'',
        copied: false,
    });

    const handleCopy = () => {
        setIsCopied({copied:true})
        console.log(window.location);

    }

    useEffect(()=> {
        setTimeout(()=>{
            if(isCopied){
                setIsCopied({copied:false})
            }
        }, 2500)
    },[isCopied])

    return (
        <motion.a whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{duration:0.1}} href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            <CopyToClipboard text={`${window.location.origin}/post/${props.id}`} onCopy={handleCopy}><span>Share post</span></CopyToClipboard>
            <span className="icon-right">{props.rightIcon}</span>
            <AnimatePresence>
                {isCopied.copied ? <ClipboardToast message={"Copied to clipboard 😈"}/>:null}
            </AnimatePresence>
        </motion.a>

    );
}


const ClipboardToast = ({message}) => {
    return ( 
        <motion.div initial={{opacity:0, y:200}} animate={{opacity:1, y:0}} exit={{y:200}} transition={{duration:0.5}} className="toast">
            <div className="message">
                <span>{message}</span>
            </div>
        </motion.div>

    );
}
 

export default DropdownSpan;

