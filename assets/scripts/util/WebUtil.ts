export default class WebUtil {

    public static async postData(url: string, data: string) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: data // body data type must match "Content-Type" header
        });

        // console.log(await response.text());

        return response.json(); // parses JSON response into native JavaScript objects
    }

    public static async getData(url: string) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });

        // console.log(await response.text());

        return response.json(); // parses JSON response into native JavaScript objects
    }

    // 取得 cookie
    public static getCookie(name: string) {
        var nameEQ = name + '='
        var ca = document.cookie.split(';') // 把cookie分割成组
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i] // 取得字符串
            while (c.charAt(0) == ' ') { // 判断一下字符串有没有前导空格
                c = c.substring(1, c.length) // 有的话，从第二位开始取
            }
            if (c.indexOf(nameEQ) == 0) { // 如果含有我们要的name
                return decodeURI(c.substring(nameEQ.length, c.length)) // 解码并截取我们要值
            }
        }
        
        return undefined
    }

    // 清除 cookie
    public static clearCookie(name: string) {
        this.setCookie(name, "", -1);
    }

    // 设置 cookie
    public static setCookie(name: string, value: string, seconds?: number) {
        seconds = seconds || 0;
        let expires = "";
        if (seconds != 0) {      // 设置cookie生存时间
            let date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = "; expires=" + date.toString();
        }
        document.cookie = name + "=" + encodeURI(value) + expires + "; path=/";   // 转码并赋值
    }

}