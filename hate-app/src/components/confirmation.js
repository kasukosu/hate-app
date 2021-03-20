import React  from 'react';
import {motion} from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const innerVariants = {
    hidden: {
        scale: 0.9,
        y: -40,
        opacity: 0,

    },
    visible:{
        scale: 1,
        opacity:1,
        y: 0,
    },
    exit:{
        opacity: 0,
        scale: 0.8,
        y: 80,
        transition:{
            duration:0.25,
            ease: 'easeInOut',
        }
    }
}
const Confirmation = ({ handleDelete, children, id, uid }) => {


    return (

            <motion.section variants={innerVariants} initial="hidden" animate="visible" exit="exit" className="modal modal-main">
                <motion.div whileHover={{scale: 1.1, backgroundColor: 'rgb(104,84,134)', opacity:0.9}} transition={{type:'spring'}} className="close-btn" onClick={()=> handleDelete(false, id, uid)}>
                    <FontAwesomeIcon icon={faTimes}/>
                </motion.div>
                <div className="grid">
                    <div className="text-container">
                        <h1>Delete selected post?</h1>
                        <p>Deleted posts cannot be recovered.</p>
                    </div>
                    <div className="btn-group">
                        <button className="cancel" type="button" onClick={() => handleDelete(false, id, uid) }>
                            Cancel
                        </button>
                        <button className="confirm" type="button" onClick={() => handleDelete(true, id, uid)}>
                            Confirm
                        </button>
                    </div>
                </div>
            </motion.section>

     );
}

export default Confirmation;