export function getToken(data){
    return data.cookies["jwt"][0].Value
}