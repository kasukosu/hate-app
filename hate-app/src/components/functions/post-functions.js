const getTimestamp = (diffSeconds) => {

    let diffMins = diffSeconds / 60; // minutes
    let diffHrs = diffMins / 60; // hours
    let diffDays = diffHrs / 24; // days

    if(diffHrs >= 24){
        diffDays = Math.floor(diffDays);
        return diffDays +'d';
    }
    else if(24>diffHrs && diffHrs>1){
        diffHrs = Math.floor(diffHrs);
        return diffHrs +'h';
    }
    else if(diffMins>=1 && diffHrs<1){
        diffMins = Math.floor(diffMins);
        return diffMins +'min';
    }
    else{
        diffSeconds = Math.floor(diffSeconds);
        return diffSeconds + 's';
    }
} 

const toggleControls = (e) => {
    let el = e.target.closest(".controls");
    let dropdown = el.querySelector(".control-dropdown");
    dropdown.classList.toggle("open");

}
const startDeletePost = (e) => {
    toggleControls(e);
    showModal({show: "show"});

}

const confirmDeletePost = async(choice, id, uid) => {
    const postsRef = db.collection('posts');
    console.log(id);
    if(choice===true){
        console.log(user);
        if(uid === user.uid ){
            await postsRef.doc(id).delete();
            setShow(false);

        }
        else{
            console.log("No permission to delete post");
            console.log(uid + " != " + user.uid);
            setShow(false);
        }

    }else{
        console.log(choice);
        setShow(false);
    }
}
