import React, {useEffect, useContext} from 'react';
import { motion} from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContext } from './ToastContext';
const DropdownSpan = (props) => {

    const {toastValue} = useContext(ToastContext);
    const [showToast, setShowToast] = toastValue;
    const handleCopy = () => {
        setShowToast({
            show:true,
            message:"Copied to clipboard 😈",
        })
        setTimeout(()=>{}, 300);
        props.setOpenDropdown(false);
    }

    useEffect(()=> {
        setTimeout(()=>{
            if(showToast.show){
                setShowToast({
                    show:false,
                    message:"",
                })
            }
        }, 2500)
    },[showToast])

    return (
        <motion.a whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{duration:0.1}} href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            <CopyToClipboard text={`${window.location.origin}/${props.slug}/${props.id}`} onCopy={handleCopy}><span>{props.text}</span></CopyToClipboard>
            <span className="icon-right">{props.rightIcon}</span>

        </motion.a>

    );
}

export default DropdownSpan;

