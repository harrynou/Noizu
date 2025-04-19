const formatDuration = (ms:number | null): string => {
    if (ms === null) return '0:00';
    let seconds = ms / 1000;
    const minutes =  Math.floor(seconds / 60);
    seconds = Math.floor(seconds%60);
    if (seconds < 10) return `${minutes}:0${seconds}`;
    else return `${minutes}:${seconds}`;
}

export default formatDuration