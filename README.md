# Timer Abort Controller

## A wrapper for NodeJS AbortController class that makes interaction easier

## Installation

```bash
$ npm i timer-abort-controller
```

#### This code snippet shows how it works

```javascript
import { TimerAbortController } from 'timer-abort-controller';

const timeToWait = 1000;
const timeToResolve = 2000;

(async function() {
    const p = new Promise<string>((res) => {
        setTimeout(() => {
            res(`promise resolved after ${timeToResolve} milliseconds`);
        }, timeToResolve);
    });
    
    try {
        const result = await TimerAbortController.resolveInTime<string>(p, timeToWait);

        console.log(result);
    } catch (error) {
        console.log(`promise aborted after ${timeToWait} milliseconds`);
        console.log(error);
    }
})();
```