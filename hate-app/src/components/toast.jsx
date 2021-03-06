import React from 'react';
import { motion} from 'framer-motion';

const Toast = ({message}) => {
    return (
        <motion.div initial={{opacity:0, y:200}} animate={{opacity:1, y:0}} exit={{y:200}} transition={{duration:0.5}} className="toast">
            <div className="message">
                <span>{message}</span>
            </div>
        </motion.div>

    );
}

export default Toast;