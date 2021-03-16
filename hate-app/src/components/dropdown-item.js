import React from 'react';
import {motion} from 'framer-motion';

const DropdownItem = (props) => {
    return (
        <motion.div onClick={props.onClick} whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{duration:0.1}} className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            <span>{props.children}</span>
            <span className="icon-right">{props.rightIcon}</span>
        </motion.div>

    );
}

export default DropdownItem;

