import { readFileSync } from "fs";

export function sendErrorPage(error:any) {
    let html = readFileSync(__dirname+"/views/error.html", "utf8");
    if (error["code"] != 500) {
        html = html.replace("{{code}}", error["code"])
        html = html.replace("{{message}}", error["message"])
    } else {
        html = html.replace("{{code}}", "500")
        html = html.replace("{{message}}", "Internal Server Error.")
    }
    return html;
}