import React  from 'react';
import {motion} from 'framer-motion';

const Confirmation = ({ handleDelete, children, id, uid }) => {


    return (

        <motion.div initial={{opacity: 0.2}} animate={{opacity: 1}} className="modal">
            <section className="modal-main">
                {children}
                <h1>Delete selected post?</h1>
                <p>Deleted posts cannot be recovered.</p>
                <div className="btn-group">
                    <button className="cancel" type="button" onClick={() => handleDelete(false, id, uid) }>
                        Cancel
                    </button>
                    <button className="confirm" type="button" onClick={() => handleDelete(true, id, uid)}>
                        Confirm
                    </button>

                </div>
            </section>
        </motion.div>

     );
}

export default Confirmation;