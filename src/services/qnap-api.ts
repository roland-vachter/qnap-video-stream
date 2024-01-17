import { ezEncode, utf16to8 } from '../helpers/get-sid';

export function login(user: string, pwd: string) {
    return fetch(`${process.env.NAS_URL}/cgi-bin/filemanager/authLogin.cgi?user=${user}&pwd=${ezEncode(utf16to8(pwd))}`);
}

export function validateSid(sid: string) {
    return fetch(`${process.env.NAS_URL}/cgi-bin/filemanager/utilRequest.cgi?func=check_sid&sid=${sid}`);
}

export function listFolders(path: string, sid: string) {
    return fetch(`${process.env.NAS_URL}/cgi-bin/filemanager/utilRequest.cgi?func=get_tree&sid=${sid}&node=/${process.env.BASE_PATH}/${path}`);
}

export function listFiles(path: string, sid: string) {
    return fetch(`${process.env.NAS_URL}/cgi-bin/filemanager/utilRequest.cgi?func=get_list&sid=${sid}&list_mode=all&path=/${process.env.BASE_PATH}/${path}&sort=filename&start=0&limit=500&type=2`);
}