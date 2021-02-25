import React  from 'react';

const Confirmation = ({ handleDelete, show, children, id }) => {
    const showHideClassName = show ? "modal" : "modal hide";
    

    return ( 

        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <h1>Delete selected post?</h1>
                <p>Deleted posts cannot be recovered.</p>
                <div className="btn-group">
                    <button className="cancel" type="button" onClick={() => handleDelete(false, id) }>
                        Cancel
                    </button>
                    <button className="confirm" type="button" onClick={() => handleDelete(true, id)}>
                        Confirm
                    </button>
                    
                </div>
            </section>
        </div>

     );
}
 
export default Confirmation;