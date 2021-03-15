import React from 'react';
import {motion} from 'framer-motion';

const DropdownItem = (props) => {
    return (
        <motion.a whileHover={{backgroundColor: 'rgba(66, 69, 84, 0.35)'}} transition={{duration:0.1}} href="#" className="menu-item">
            <span className="icon-button">{props.leftIcon}</span>
            <span>{props.children}</span>
            <span className="icon-right">{props.rightIcon}</span>
        </motion.a>

    );
}

export default DropdownItem;

