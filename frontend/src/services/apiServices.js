import axios from "axios";

export const apiServices = async (type, endpoint, data) => {
    let location = window.location.origin

    // const DEV_BASE_URL = "https://devurl.com"
    // const PRD_BASE_URL = "https://prdurl.com";

    // let BASE_URL = (location === "https://www.prdurl.com" || location === "https://prdurl.com") ? PRD_BASE_URL : DEV_BASE_URL
    let BASE_URL = "http://localhost:3001"

    let AuthObj= JSON.parse(localStorage.getItem('user'));
    let athtoken= AuthObj?.access_token;
    
    if (type === "GET") {
        try {
            let result = axios({
                url: `${BASE_URL}/${endpoint}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + athtoken,
                    Accept: 'application/json',
                },
            }).then((res) => res)
            return (result)
        } catch (error) {
            console.error("GET API FAILED !");
        }
    }
    else if (type === "PUT") {
        try {
            let result = axios({
               url: `${BASE_URL}/${endpoint}`,
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + athtoken,
                    Accept: 'application/json',
                },
                data: data
            }).then((res) => res)
            return (result)
        }
        catch (error) {

            console.log("GET Api Failed")
        }
    }
    else if (type === 'DELETE') {
        try {
            let result = axios({
                url: `${BASE_URL}/${endpoint}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + athtoken,
                    Accept: 'application/json'
                },
                data: {
                    '_id': data
                }
            }).then((res) => res)
            return (result)
        }
        catch (error) {
            console.log("Delete Api Failed")
        }

    }
    else {
        try {
            let result = axios({
                url: `${BASE_URL}/${endpoint}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + athtoken,
                    Accept: 'application/json',
                    withCredentials: true
                },
                data: data
            }).then((res) => res)
            return (result)
        } catch (error) {
            console.error("POST API FAILED!");
        }
    }
}

