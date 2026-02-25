export function toSriLankaTime(timestamp: { seconds: number; nanos: number }): string {
    const ms = timestamp.seconds * 1000 + Math.floor(timestamp.nanos / 1_000_000);
    
    return new Date(ms).toLocaleString('en-LK', {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}