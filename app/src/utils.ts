const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;
const month = 30 * day;
const year = 365 * day;

export function toHumanReadableDate(datestring: string): string {
    const date = new Date(datestring);
    const currentDate = new Date();
    const diff = currentDate.getTime() - date.getTime();

    if (diff < hour) {
        const minutes = Math.max(Math.floor(diff / minute), 0);
        if (minutes === 0) {
            return 'now';
        }
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diff < month) {
        const weeks = Math.floor(diff / week);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months} month{months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(diff / year);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

// mainly used for accessibility, courtesy of https://www.w3resource.com/javascript-exercises/javascript-math-exercise-105.php
export function toEnglishString(n: number): string {
    let prefix = '';
    if (n < 0) {
        prefix = 'minus ';
        n = -n;
    }
    const singleDigit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const doubleDigit = [
        'Ten',
        'Eleven',
        'Twelve',
        'Thirteen',
        'Fourteen',
        'Fifteen',
        'Sixteen',
        'Seventeen',
        'Eighteen',
        'Nineteen',
    ];
    const belowHundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (n === 0) return 'Zero';
    function translate(n: number): string {
        let word = '';
        if (n < 10) {
            word = (singleDigit[n] as string) + ' ';
        } else if (n < 20) {
            word = (doubleDigit[n - 10] as string) + ' ';
        } else if (n < 100) {
            const rem = translate(n % 10);
            word = (belowHundred[(n - (n % 10)) / 10 - 2] as string) + ' ' + rem;
        } else if (n < 1000) {
            word = (singleDigit[Math.trunc(n / 100)] as string) + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(Math.floor(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(Math.floor(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(Math.floor(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }
    const result = translate(n);
    return prefix + result.trim();
}

export function splitArrayInChunks<T>(array: T[], splitSize: number): T[][] {
    const numberPage = Math.trunc(array.length / splitSize) + (array.length % splitSize > 0 ? 1 : 0);

    const slicedArray: T[][] = [];

    for (let i = 0; i < numberPage; i++) {
        slicedArray.push(array.slice(i * splitSize, (i + 1) * splitSize));
    }
    return slicedArray;
}

export function getUsernameFromUserChannel(channelname: string, myname: string): string {
    const channel = channelname.substring(1);
    const name = channel.split('-');
    if (name[0] === myname) return name[1] as string;
    else return name[0] as string;
}

export function stringFormat(template: string, args: string[]): string {
    let formatted = template;

    args.forEach((arg, index) => {
        const regexp = new RegExp(`\\{${index}\\}`, 'gi');
        formatted = formatted.replace(regexp, arg);
    });

    return formatted;
}

export function setIntervalX(callback: () => void, delay: number, repetitions: number): void {
    if (repetitions <= 0) return;

    const intervalID = window.setInterval(() => {
        const storageItem = localStorage.getItem(`${intervalID}-intervals`);
        if (storageItem === null) {
            window.clearInterval(intervalID);
            return;
        }

        const x = parseInt(storageItem);
        callback();
        if (x - 1 === 0) {
            localStorage.removeItem(`${intervalID}-intervals`);
            window.clearInterval(intervalID);
        }
        localStorage.setItem(`${intervalID}-intervals`, (x - 1).toString());
    }, delay);
    localStorage.setItem(`${intervalID}-intervals`, repetitions.toString());
}

function isIntervalIdKey(key: string): boolean {
    return key.endsWith('-intervals');
}

export function clearLocalstorageIntervals(): void {
    Object.keys(localStorage)
        .filter(isIntervalIdKey)
        .forEach((key) => {
            localStorage.removeItem(key);
        });
}
