export const getTimestamp = (createdAt) => {
    if(createdAt!=null){
        let today = new Date().getTime()
        let diffSeconds = (today/1000 - createdAt.seconds);
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
    }else{
        return "refresh";
    }

}